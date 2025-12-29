'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchPetBySlug, getPetType, getPetCategory, Pet } from '@/services/petApiService';
import { generatePetImage } from '@/services/geminiService';

export default function BreedDetailView() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      try {
        const petData = await fetchPetBySlug(slug);
        setPet(petData);
        
        // Use featured image from backend, or generate AI image as fallback
        if (petData.featured_image?.url) {
          setMainImage(petData.featured_image.url);
        } else {
          try {
            const aiImg = await generatePetImage(petData.name);
            setMainImage(aiImg);
          } catch (imgErr) {
            setMainImage(`https://picsum.photos/seed/${petData.name}/800/600`);
          }
        }
      } catch (err) {
        setError('Could not load pet details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin text-4xl text-orange-500"><i className="fas fa-paw"></i></div>
        <p className="text-gray-600 font-medium italic">Opening the encyclopedia...</p>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
        <p className="text-gray-500 mb-8">{error}</p>
        <button onClick={() => router.push('/dictionary')} className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg">Back to Dictionary</button>
      </div>
    );
  }

  const petType = getPetType(pet);
  const category = getPetCategory(pet);
  
  // Parse story to extract English name and more info link
  const storyLines = pet.story.split('\n');
  const englishName = storyLines.find(line => line.startsWith('English name:'))?.replace('English name:', '').trim() || '';
  const moreInfoLink = storyLines.find(line => line.startsWith('More info:'))?.replace('More info:', '').trim() || '';
  
  // Get gallery images (use gallery if available, otherwise use featured image)
  const galleryImages = pet.gallery.length > 0 
    ? pet.gallery.slice(0, 3) 
    : pet.featured_image 
      ? [pet.featured_image, pet.featured_image, pet.featured_image]
      : [];

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
              alt={pet.name} 
              className="w-full h-[500px] object-cover rounded-[2rem] shadow-2xl border-4 border-white"
            />
            {!pet.featured_image && (
              <div className="absolute -bottom-4 -right-4 bg-orange-500 text-white px-6 py-3 rounded-2xl shadow-xl font-bold">
                AI Generated Visual
              </div>
            )}
          </div>
          
          {galleryImages.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {galleryImages.map((img, i) => (
                <img 
                  key={i}
                  src={img.thumbnail || img.url} 
                  alt={`${pet.name} gallery ${i + 1}`} 
                  className="w-full h-24 object-cover rounded-xl shadow cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setMainImage(img.url)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center space-x-3 text-orange-500 font-bold mb-2 uppercase tracking-widest text-sm">
              <i className="fas fa-tag"></i>
              <span>{petType} - {category}</span>
            </div>
            <h1 className="text-5xl font-extrabold text-gray-800 mb-2">{pet.name}</h1>
            {englishName && (
              <p className="text-xl text-gray-400 italic font-medium">{englishName}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <StatBox icon="fa-arrows-alt-v" label="Height" value={pet.height} />
            <StatBox icon="fa-weight-hanging" label="Weight" value={pet.weight} />
            <StatBox icon="fa-hourglass-half" label="Lifespan" value={pet.lifespan} />
            <StatBox icon="fa-calendar-alt" label="Added" value={new Date(pet.date_created).toLocaleDateString()} />
          </div>

          {pet.groups.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-orange-50 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-star text-orange-400 mr-2"></i> Groups & Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {pet.groups.map((group) => (
                  <span key={group.id} className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {group.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {moreInfoLink && (
            <a 
              href={moreInfoLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all"
            >
              <i className="fas fa-external-link-alt"></i>
              <span>Learn More</span>
            </a>
          )}
        </div>
      </div>

      {pet.description && (
        <div className="space-y-20">
          <section>
            <div className="flex items-center space-x-4 mb-8">
              <h2 className="text-3xl font-bold text-gray-800">About {pet.name}</h2>
              <div className="flex-grow h-[1px] bg-orange-100"></div>
            </div>
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-4">
              {pet.description.split('\n').map((p, i) => p.trim() && <p key={i}>{p}</p>)}
            </div>
          </section>
        </div>
      )}
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
