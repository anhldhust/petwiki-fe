'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getBreedList, searchBreeds } from '@/services/geminiService';
import { BreedSummary, PetType } from '@/types';
import Link from 'next/link';

export default function Dictionary() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [breeds, setBreeds] = useState<BreedSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryParam = searchParams.get('q');
  const typeParam = searchParams.get('type') as PetType | null;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let result: BreedSummary[] = [];
        if (queryParam) {
          result = await searchBreeds(queryParam);
        } else if (typeParam) {
          result = await getBreedList(typeParam);
        } else {
          // Default to dogs if nothing specified
          result = await getBreedList(PetType.DOG);
        }
        setBreeds(result);
      } catch (err: any) {
        setError('Failed to fetch breeds. Please check your API key or connection.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [queryParam, typeParam]);

  const toggleType = (type: PetType) => {
    router.push(`/dictionary?type=${type}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            {queryParam ? `Search Results for "${queryParam}"` : 'Breed Dictionary'}
          </h1>
          <p className="text-gray-500 mt-2">Discover the unique traits of every furry friend.</p>
        </div>

        <div className="flex bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden p-1">
          <button 
            onClick={() => toggleType(PetType.DOG)}
            className={`px-8 py-2 rounded-lg font-bold transition-all ${typeParam === PetType.DOG || (!typeParam && !queryParam) ? 'bg-orange-500 text-white shadow-md' : 'text-gray-500 hover:bg-orange-50'}`}
          >
            Dogs
          </button>
          <button 
            onClick={() => toggleType(PetType.CAT)}
            className={`px-8 py-2 rounded-lg font-bold transition-all ${typeParam === PetType.CAT ? 'bg-orange-500 text-white shadow-md' : 'text-gray-500 hover:bg-orange-50'}`}
          >
            Cats
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="animate-spin text-4xl text-orange-500"><i className="fas fa-paw"></i></div>
          <p className="text-gray-600 font-medium">Fetching furry facts...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-8 rounded-2xl text-center text-red-600">
          <i className="fas fa-exclamation-triangle text-4xl mb-4"></i>
          <p className="text-xl font-bold mb-2">Oops!</p>
          <p>{error}</p>
        </div>
      ) : breeds.length === 0 ? (
        <div className="text-center py-24">
          <i className="fas fa-search text-6xl text-gray-200 mb-6"></i>
          <p className="text-xl text-gray-500">We couldn't find any breeds matching your search.</p>
          <button onClick={() => router.push('/dictionary')} className="text-orange-500 font-bold mt-4 hover:underline">Clear search</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {breeds.map((breed, idx) => (
            <BreedCard key={`${breed.name}-${idx}`} breed={breed} />
          ))}
        </div>
      )}
    </div>
  );
}

const BreedCard: React.FC<{ breed: BreedSummary }> = ({ breed }) => {
  const placeholderImage = breed.type === PetType.DOG 
    ? `https://picsum.photos/seed/${breed.name}/400/300` 
    : `https://picsum.photos/seed/${breed.name}cat/400/300`;

  return (
    <Link 
      href={`/breed/${breed.type}/${encodeURIComponent(breed.name)}`}
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-orange-50 cursor-pointer group hover:shadow-2xl transition-all block"
    >
      <div className="relative h-48">
        <img src={placeholderImage} alt={breed.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-orange-600 shadow-sm">
          {breed.type.toUpperCase()}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">{breed.name}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
          {breed.shortDescription}
        </p>
        <div className="flex justify-between items-center pt-4 border-t border-gray-50">
          <span className="text-xs font-medium text-gray-400"><i className="fas fa-expand-alt mr-1"></i> {breed.size}</span>
          <span className="text-orange-500 text-sm font-bold">Details <i className="fas fa-arrow-right ml-1"></i></span>
        </div>
      </div>
    </Link>
  );
};

