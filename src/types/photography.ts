export type PackageType = 'photo' | 'drone' | 'photo_drone';

export type PackageTierType = 'budget' | 'standard' | 'premium';

export type PropertySize = 'klein' | 'mittel' | 'gross';

export interface PackageTier {
  id: string;
  name: string;
  type: PackageType;
  tier: PackageTierType;
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
