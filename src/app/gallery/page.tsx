'use client';

import { useState, useEffect } from 'react';
import { generatePetImage, generatePetVideo } from '@/services/geminiService';

interface GalleryItem {
  id: string;
  url: string;
  title: string;
  type: 'image' | 'video';
  prompt?: string;
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationType, setGenerationType] = useState<'image' | 'video'>('image');
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    // Initial content
    setItems([
      { id: '1', url: 'https://picsum.photos/id/1062/800/800', title: 'Curious Pup', type: 'image' },
      { id: '2', url: 'https://picsum.photos/id/1084/800/800', title: 'Lazy Afternoon', type: 'image' },
      { id: '3', url: 'https://picsum.photos/id/659/800/800', title: 'Mountain Guardian', type: 'image' },
      { id: '4', url: 'https://picsum.photos/id/219/800/800', title: 'Wild Whiskers', type: 'image' },
    ]);

    // Check if API key is available
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    setHasApiKey(!!apiKey);
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      let newItem: GalleryItem;
      if (generationType === 'image') {
        const url = await generatePetImage(prompt);
        newItem = { id: Date.now().toString(), url, title: prompt, type: 'image' };
      } else {
        const url = await generatePetVideo(prompt);
        newItem = { id: Date.now().toString(), url, title: prompt, type: 'video' };
      }
      setItems(prev => [newItem, ...prev]);
      setPrompt('');
    } catch (err) {
      alert("Generation failed. Please try again or check your API key.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Magic Pet Gallery</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          See funny, cute, and smart pets from around the world. Or use our AI Lab to bring your own pet imagination to life.
        </p>
      </div>

      {/* AI Lab Section */}
      <section className="bg-white rounded-[3rem] shadow-2xl p-8 mb-20 border border-orange-50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-8">
            <div className="bg-orange-500 p-3 rounded-2xl text-white shadow-lg">
              <i className="fas fa-magic"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Pet Creation Lab</h2>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <input 
                  type="text" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your imaginary pet (e.g., 'A cat with a tiny astronaut helmet' or 'A dog playing a golden piano')"
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-orange-300 focus:bg-white outline-none transition-all"
                  disabled={isGenerating}
                />
              </div>
              
              <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
                 <button 
                  type="button"
                  onClick={() => setGenerationType('image')}
                  className={`px-6 py-2 rounded-xl font-bold transition-all ${generationType === 'image' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400'}`}
                 >
                   Image
                 </button>
                 <button 
                  type="button"
                  onClick={() => setGenerationType('video')}
                  className={`px-6 py-2 rounded-xl font-bold transition-all ${generationType === 'video' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400'}`}
                 >
                   Video
                 </button>
              </div>

              <button 
                type="submit"
                disabled={isGenerating || !hasApiKey}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold px-10 py-4 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <i className="fas fa-spinner animate-spin"></i>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-wand-sparkles"></i>
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
            {generationType === 'video' && (
              <p className="text-xs text-orange-500/70 italic flex items-center">
                <i className="fas fa-info-circle mr-1"></i> Video generation uses Veo 3.1 and may take a few minutes. 
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline ml-1">Requires paid API key.</a>
              </p>
            )}
            {!hasApiKey && (
              <p className="text-xs text-red-500 italic flex items-center">
                <i className="fas fa-exclamation-triangle mr-1"></i> Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Masonry-style Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="break-inside-avoid relative group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-white"
          >
            {item.type === 'video' ? (
              <video 
                src={item.url} 
                className="w-full h-auto" 
                autoPlay 
                loop 
                muted 
                playsInline
              />
            ) : (
              <img src={item.url} alt={item.title} className="w-full h-auto group-hover:scale-105 transition-transform duration-700" />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
               <h3 className="text-white font-bold text-lg">{item.title}</h3>
               <div className="flex items-center space-x-2 mt-2">
                  <span className="bg-white/20 backdrop-blur px-2 py-1 rounded text-[10px] uppercase font-bold text-white border border-white/30">
                    {item.type}
                  </span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

