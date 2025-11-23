export type PackageType = 'photo' | 'drone' | 'photo_drone';

export interface PackageTier {
  id: string;
  name: string;
  type: PackageType;
  photoCount: number;
  price: number;
  breakdown?: string;
  features: string[];
  popular?: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}
