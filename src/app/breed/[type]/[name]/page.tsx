'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBreedDetail, generatePetImage } from '@/services/geminiService';
import { BreedDetail, PetType } from '@/types';

export default function BreedDetailView() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as string;
  const name = params.name as string;
  
  const [detail, setDetail] = useState<BreedDetail | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!name || !type) return;
      setLoading(true);
      setError(null);
      try {
        const breedData = await getBreedDetail(name, type as PetType);
        setDetail(breedData);
        
        // Generate a beautiful AI image for this specific breed
        try {
          const aiImg = await generatePetImage(`${name} ${type}`);
          setMainImage(aiImg);
        } catch (imgErr) {
          setMainImage(`https://picsum.photos/seed/${name}/800/600`);
        }
      } catch (err) {
        setError('Could not load breed details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [name, type]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin text-4xl text-orange-500"><i className="fas fa-paw"></i></div>
        <p className="text-gray-600 font-medium italic">Opening the encyclopedia...</p>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
        <p className="text-gray-500 mb-8">{error}</p>
        <button onClick={() => router.push('/dictionary')} className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg">Back to Dictionary</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <button 
        onClick={() => router.back()} 
        className="mb-8 flex items-center text-gray-500 hover:text-orange-500 font-bold transition-colors"
      >
        <i className="fas fa-arrow-left mr-2"></i> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <div className="space-y-6">
          <div className="relative group">
            <img 
              src={mainImage} 
              alt={detail.name} 
              className="w-full h-[500px] object-cover rounded-[2rem] shadow-2xl border-4 border-white"
            />
            <div className="absolute -bottom-4 -right-4 bg-orange-500 text-white px-6 py-3 rounded-2xl shadow-xl font-bold">
               AI Generated Visual
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
             {[1, 2, 3].map(i => (
               <img 
                key={i}
                src={`https://picsum.photos/seed/${detail.name}${i}/400/400`} 
                alt={`${detail.name} gallery`} 
                className="w-full h-24 object-cover rounded-xl shadow cursor-pointer hover:opacity-80 transition-opacity"
               />
             ))}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center space-x-3 text-orange-500 font-bold mb-2 uppercase tracking-widest text-sm">
              <i className="fas fa-tag"></i>
              <span>{detail.type} Breed</span>
            </div>
            <h1 className="text-5xl font-extrabold text-gray-800 mb-2">{detail.name}</h1>
            <p className="text-xl text-gray-400 italic font-medium">{detail.scientificName}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <StatBox icon="fa-arrows-alt-v" label="Height" value={detail.height} />
            <StatBox icon="fa-weight-hanging" label="Weight" value={detail.weight} />
            <StatBox icon="fa-hourglass-half" label="Lifespan" value={detail.lifespan} />
            <StatBox icon="fa-globe-americas" label="Origin" value={detail.origin} />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-orange-50 shadow-sm">
             <h3 className="font-bold text-gray-800 mb-4 flex items-center">
               <i className="fas fa-star text-orange-400 mr-2"></i> Key Characteristics
             </h3>
             <div className="flex flex-wrap gap-2">
               {detail.characteristics.map((c, i) => (
                 <span key={i} className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                   {c}
                 </span>
               ))}
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-20">
        <section>
          <div className="flex items-center space-x-4 mb-8">
             <h2 className="text-3xl font-bold text-gray-800">History & Legacy</h2>
             <div className="flex-grow h-[1px] bg-orange-100"></div>
          </div>
          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-4">
             {detail.history.split('\n').map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </section>

        <section className="bg-orange-50 rounded-[3rem] p-12 relative overflow-hidden">
          <i className="fas fa-quote-left absolute top-8 left-8 text-8xl text-orange-100/50"></i>
          <div className="relative z-10 max-w-4xl mx-auto">
             <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center italic">The Heart of the {detail.name}</h2>
             <div className="text-xl text-gray-700 leading-loose text-center font-medium opacity-90">
                "{detail.story}"
             </div>
          </div>
          <i className="fas fa-paw absolute bottom-4 right-8 text-9xl text-orange-100/30"></i>
        </section>
      </div>
    </div>
  );
}

const StatBox: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start space-x-4">
    <div className="bg-orange-100 p-3 rounded-lg text-orange-500">
      <i className={`fas ${icon}`}></i>
    </div>
    <div>
      <p className="text-xs text-gray-400 font-bold uppercase">{label}</p>
      <p className="text-gray-800 font-bold">{value}</p>
    </div>
  </div>
);



