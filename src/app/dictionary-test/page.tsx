'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getPetType, getPetCategory } from '@/services/petApiService';
import { PetType } from '@/types';
import Link from 'next/link';

interface BreedDisplay {
  id: number;
  name: string;
  type: PetType;
  shortDescription: string;
  size: string;
  imageUrl: string;
  slug: string;
}

// Mock data generator
const generateMockPets = (page: number, perPage: number) => {
  const total = 50; // Total mock pets
  const start = (page - 1) * perPage;
  const end = Math.min(start + perPage, total);
  
  const pets: BreedDisplay[] = [];
  for (let i = start; i < end; i++) {
    pets.push({
      id: i + 1,
      name: `Mock Pet ${i + 1}`,
      type: i % 2 === 0 ? PetType.DOG : PetType.CAT,
      shortDescription: `This is a mock description for pet ${i + 1}`,
      size: '10-12 inches | 15-20 pounds',
      imageUrl: `https://picsum.photos/seed/pet${i}/400/300`,
      slug: `mock-pet-${i + 1}`,
    });
  }
  
  return {
    data: pets,
    pagination: {
      total,
      page,
      per_page: perPage,
      total_pages: Math.ceil(total / perPage),
    },
  };
};

function DictionaryTestContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [breeds, setBreeds] = useState<BreedDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 12,
    total_pages: 1,
  });

  const pageParam = parseInt(searchParams.get('page') || '1');
  const perPageParam = parseInt(searchParams.get('per_page') || '12');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = generateMockPets(pageParam, perPageParam);
      setBreeds(result.data);
      setPagination(result.pagination);
      
      setLoading(false);
    };

    fetchData();
  }, [pageParam, perPageParam]);

  const goToPage = (page: number) => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    if (perPageParam !== 12) {
      params.set('per_page', perPageParam.toString());
    }
    router.push(`/dictionary-test?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Pagination Test Page
          </h1>
          <p className="text-gray-500 mt-2">
            Testing pagination with mock data.
            {pagination.total > 0 && (
              <span className="ml-2 text-orange-500 font-semibold">
                ({pagination.total} total)
              </span>
            )}
          </p>
        </div>

        <Link 
          href="/dictionary"
          className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600 transition-all"
        >
          Back to Real Dictionary
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="animate-spin text-4xl text-orange-500"><i className="fas fa-paw"></i></div>
          <p className="text-gray-600 font-medium">Loading mock data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {breeds.map((breed) => (
              <BreedCard key={breed.id} breed={breed} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="mt-16 flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => goToPage(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 rounded-lg border border-orange-200 text-orange-600 font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-orange-50 transition-all"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>

                {/* Page Numbers */}
                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage = 
                    page === 1 || 
                    page === pagination.total_pages || 
                    Math.abs(page - pagination.page) <= 1;

                  const showEllipsis = 
                    (page === 2 && pagination.page > 3) ||
                    (page === pagination.total_pages - 1 && pagination.page < pagination.total_pages - 2);

                  if (showEllipsis) {
                    return (
                      <span key={page} className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }

                  if (!showPage) return null;

                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-4 py-2 rounded-lg font-bold transition-all ${
                        page === pagination.page
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'border border-orange-200 text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button
                  onClick={() => goToPage(pagination.page + 1)}
                  disabled={pagination.page === pagination.total_pages}
                  className="px-4 py-2 rounded-lg border border-orange-200 text-orange-600 font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-orange-50 transition-all"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>

              {/* Page Info */}
              <p className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.total_pages} 
                <span className="mx-2">•</span>
                Showing {breeds.length} of {pagination.total} pets
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function DictionaryTest() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="animate-spin text-4xl text-orange-500"><i className="fas fa-paw"></i></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <DictionaryTestContent />
    </Suspense>
  );
}

const BreedCard: React.FC<{ breed: BreedDisplay }> = ({ breed }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-orange-50 cursor-pointer group hover:shadow-2xl transition-all">
      <div className="relative h-48">
        <img src={breed.imageUrl} alt={breed.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
          <span className="text-orange-500 text-sm font-bold">Mock Card</span>
        </div>
      </div>
    </div>
  );
};
