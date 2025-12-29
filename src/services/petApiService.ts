// Service to interact with WordPress Pet Management API

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/wp-json/pet-management/v1';

export interface PetImage {
  id: number;
  url: string;
  width: number;
  height: number;
  thumbnail: string;
  medium: string;
  alt: string;
}

export interface PetGroup {
  id: number;
  name: string;
  slug: string;
}

export interface Pet {
  id: number;
  name: string;
  description: string;
  excerpt: string;
  height: string;
  weight: string;
  lifespan: string;
  story: string;
  gallery: PetImage[];
  groups: PetGroup[];
  featured_image: PetImage | null;
  date_created: string;
  date_modified: string;
  slug: string;
}

export interface PetListResponse {
  success: boolean;
  data: Pet[];
  pagination?: {
    total: number;
    total_pages: number;
    current_page: string | number;
    per_page: string | number;
    from: number;
    to: number;
    has_more: boolean;
    next_page: number | null;
    prev_page: number | null;
  };
}

export interface PetDetailResponse {
  success: boolean;
  data: Pet;
}

export interface FetchPetsParams {
  page?: number;
  per_page?: number;
  type?: 'dog' | 'cat';
  q?: string;  // Changed from 'search' to 'q'
}

/**
 * Fetch list of pets from backend with pagination support
 */
export const fetchPets = async (params?: FetchPetsParams): Promise<PetListResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.per_page) {
      queryParams.append('per_page', params.per_page.toString());
    }
    if (params?.type) {
      queryParams.append('type', params.type);
    }
    if (params?.q) {
      queryParams.append('q', params.q);  // Changed from 'search' to 'q'
    }

    const url = `${API_BASE_URL}/pets${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    console.log('Fetching pets from:', url);  // Debug log
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch pets: ${response.statusText}`);
    }
    
    const result: PetListResponse = await response.json();
    
    if (!result.success) {
      throw new Error('API returned unsuccessful response');
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching pets:', error);
    throw error;
  }
};

/**
 * Fetch single pet detail by ID
 */
export const fetchPetById = async (petId: number): Promise<Pet> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pets/${petId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch pet: ${response.statusText}`);
    }
    const result: PetDetailResponse = await response.json();
    if (!result.success) {
      throw new Error('API returned unsuccessful response');
    }
    return result.data;
  } catch (error) {
    console.error('Error fetching pet detail:', error);
    throw error;
  }
};

/**
 * Fetch single pet detail by slug
 */
export const fetchPetBySlug = async (slug: string): Promise<Pet> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pets/slug/${slug}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch pet: ${response.statusText}`);
    }
    const result: PetDetailResponse = await response.json();
    if (!result.success) {
      throw new Error('API returned unsuccessful response');
    }
    return result.data;
  } catch (error) {
    console.error('Error fetching pet by slug:', error);
    throw error;
  }
};

/**
 * Filter pets by type (dog or cat)
 */
export const filterPetsByType = (pets: Pet[], type: 'dog' | 'cat'): Pet[] => {
  const typeSlug = type.toLowerCase();
  return pets.filter(pet => 
    pet.groups.some(group => group.slug === typeSlug)
  );
};

/**
 * Search pets by query string
 */
export const searchPets = (pets: Pet[], query: string): Pet[] => {
  const lowerQuery = query.toLowerCase();
  return pets.filter(pet => 
    pet.name.toLowerCase().includes(lowerQuery) ||
    pet.description.toLowerCase().includes(lowerQuery) ||
    pet.excerpt.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Get pet type from groups (dog or cat)
 */
export const getPetType = (pet: Pet): 'dog' | 'cat' | 'unknown' => {
  const dogGroup = pet.groups.find(g => g.slug === 'dog');
  const catGroup = pet.groups.find(g => g.slug === 'cat');
  
  if (dogGroup) return 'dog';
  if (catGroup) return 'cat';
  return 'unknown';
};

/**
 * Get pet category/group (excluding dog/cat)
 */
export const getPetCategory = (pet: Pet): string => {
  const mainGroup = pet.groups.find(g => g.slug !== 'dog' && g.slug !== 'cat');
  return mainGroup?.name || 'Unknown';
};
