
export enum PetType {
  DOG = 'dog',
  CAT = 'cat'
}

export interface BreedSummary {
  name: string;
  type: PetType;
  shortDescription: string;
  size: string;
}

export interface BreedDetail extends BreedSummary {
  scientificName: string;
  height: string;
  weight: string;
  lifespan: string;
  origin: string;
  history: string;
  story: string;
  characteristics: string[];
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  type: 'image' | 'video';
  prompt?: string;
}



