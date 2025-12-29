'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchPets, getPetType, getPetCategory } from '@/services/petApiService';
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

function DictionaryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [breeds, setBreeds] = useState<BreedDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    current_page: 1,
    per_page: 12,
    total_pages: 1,
    from: 0,
    to: 0,
    has_more: false,
    next_page: null as number | null,
    prev_page: null as number | null,
  });

  const queryParam = searchParams.get('q');
  const typeParam = searchParams.get('type') as PetType | null;
  const pageParam = parseInt(searchParams.get('page') || '1');
  const perPageParam = parseInt(searchParams.get('per_page') || '12');

  // Sync search input with URL query param
  useEffect(() => {
    setSearchInput(queryParam || '');
  }, [queryParam]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Prepare fetch params
        const fetchParams: any = {
          page: pageParam,
          per_page: perPageParam,
        };

        if (queryParam) {
          fetchParams.q = queryParam;  // Changed from 'search' to 'q'
        } else if (typeParam) {
          fetchParams.type = typeParam;
        } else {
          // Default to dogs if nothing specified
          fetchParams.type = PetType.DOG;
        }

        const result = await fetchPets(fetchParams);

        console.log('API Response:', result);
        console.log('Pagination:', result.pagination);

        // Transform to display format
        const displayBreeds: BreedDisplay[] = result.data.map(pet => ({
          id: pet.id,
          name: pet.name,
          type: getPetType(pet) as PetType,
          shortDescription: pet.excerpt || pet.description || getPetCategory(pet),
          size: `${pet.height} | ${pet.weight}`,
          imageUrl: pet.featured_image?.medium || pet.featured_image?.url || '',
          slug: pet.slug,
        }));

        setBreeds(displayBreeds);
        
        // Update pagination info
        if (result.pagination) {
          setPagination({
            total: result.pagination.total,
            current_page: typeof result.pagination.current_page === 'string' 
              ? parseInt(result.pagination.current_page) 
              : result.pagination.current_page,
            per_page: typeof result.pagination.per_page === 'string'
              ? parseInt(result.pagination.per_page)
              : result.pagination.per_page,
            total_pages: result.pagination.total_pages,
            from: result.pagination.from,
            to: result.pagination.to,
            has_more: result.pagination.has_more,
            next_page: result.pagination.next_page,
            prev_page: result.pagination.prev_page,
          });
        } else {
          // Fallback if backend doesn't return pagination
          setPagination({
            total: displayBreeds.length,
            current_page: pageParam,
            per_page: perPageParam,
            total_pages: 1,
            from: 1,
            to: displayBreeds.length,
            has_more: false,
            next_page: null,
            prev_page: null,
          });
        }
      } catch (err: any) {
        setError('Failed to fetch pets. Please check your backend connection.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [queryParam, typeParam, pageParam, perPageParam]);

  const toggleType = (type: PetType) => {
    const params = new URLSearchParams();
    params.set('type', type);
    params.set('page', '1');
    router.push(`/dictionary?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const params = new URLSearchParams();
      params.set('q', searchInput.trim());
      params.set('page', '1');
      router.push(`/dictionary?${params.toString()}`);
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    router.push('/dictionary?page=1');
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams();
    
    // Preserve search or type filter
    if (queryParam) {
      params.set('q', queryParam);
    } else if (typeParam) {
      params.set('type', typeParam);
    }
    
    params.set('page', page.toString());
    if (perPageParam !== 12) {
      params.set('per_page', perPageParam.toString());
    }
    router.push(`/dictionary?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header with Search */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              {queryParam ? `Search Results for "${queryParam}"` : 'Breed Dictionary'}
            </h1>
            <p className="text-gray-500 mt-2">
              Discover the unique traits of every furry friend.
              {pagination.total > 0 && (
                <span className="ml-2 text-orange-500 font-semibold">
                  ({pagination.total} total)
                </span>
              )}
            </p>
          </div>

          {!queryParam && (
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
          )}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
          <div className="relative flex-grow">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="Search breeds (e.g., Golden Retriever, Siamese)..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-800 focus:outline-none focus:border-orange-400 transition-all"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md active:scale-95"
          >
            Search
          </button>
          {queryParam && (
            <button 
              type="button"
              onClick={clearSearch}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-6 py-3 rounded-xl transition-all"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </form>
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
          <p className="text-xl text-gray-500 mb-2">We couldn't find any breeds matching your search.</p>
          {queryParam && (
            <p className="text-gray-400 mb-4">Try different keywords or browse all breeds.</p>
          )}
          <button onClick={clearSearch} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-md">
            {queryParam ? 'Clear Search' : 'View All Breeds'}
          </button>
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
                  onClick={() => pagination.prev_page && goToPage(pagination.prev_page)}
                  disabled={!pagination.prev_page}
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
                    Math.abs(page - pagination.current_page) <= 1;

                  const showEllipsis = 
                    (page === 2 && pagination.current_page > 3) ||
                    (page === pagination.total_pages - 1 && pagination.current_page < pagination.total_pages - 2);

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
                        page === pagination.current_page
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
                  onClick={() => pagination.next_page && goToPage(pagination.next_page)}
                  disabled={!pagination.has_more}
                  className="px-4 py-2 rounded-lg border border-orange-200 text-orange-600 font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-orange-50 transition-all"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>

              {/* Page Info */}
              <p className="text-sm text-gray-500">
                Page {pagination.current_page} of {pagination.total_pages} 
                <span className="mx-2">•</span>
                Showing {pagination.from}-{pagination.to} of {pagination.total} pets
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function Dictionary() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="animate-spin text-4xl text-orange-500"><i className="fas fa-paw"></i></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <DictionaryContent />
    </Suspense>
  );
}

const BreedCard: React.FC<{ breed: BreedDisplay }> = ({ breed }) => {
  const imageUrl = breed.imageUrl || (breed.type === PetType.DOG 
    ? `https://picsum.photos/seed/${breed.name}/400/300` 
    : `https://picsum.photos/seed/${breed.name}cat/400/300`);

  return (
    <Link 
      href={`/breed/${breed.slug}`}
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-orange-50 cursor-pointer group hover:shadow-2xl transition-all block"
    >
      <div className="relative h-48">
        <img src={imageUrl} alt={breed.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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



