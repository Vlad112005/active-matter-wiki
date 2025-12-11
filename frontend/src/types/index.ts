export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  role?: Role;
  roleId: string;
  isPremium: boolean;
  premiumUntil?: string;
  createdAt: string;
  updatedAt: string;
  guides?: Guide[];
}

export interface Role {
  id: string;
  name: string;
  displayName: string;
  description?: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  image?: string;
  type: string;
  rarity: string;
  price: number;
  silverPrice?: number;
  replicationPoints?: number;
  monolithLevel?: number;
  weight: number;
  stackable: boolean;
  maxStack: number;
  source: string[];
  tags: string[];
  isQuestItem: boolean;
  damage?: number;
  armor?: number;
  durability?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
  rating: number;
  views: number;
  likes: number;
  authorId: string;
  author?: User;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  mapImage?: string;
  tips: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Patch {
  id: string;
  version: string;
  title: string;
  releaseDate: string;
  content: string;
  changes: PatchChange[];
  createdAt: string;
  updatedAt: string;
}

export interface PatchChange {
  id: string;
  type: string;
  description: string;
}
