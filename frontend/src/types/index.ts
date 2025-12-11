export interface Item {
  id: string;
  name: string;
  description: string;
  image?: string;
  type: 'weapon' | 'armor' | 'consumable' | 'quest' | 'other';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  price: number;
  weight: number;
  stackable: boolean;
  source: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'nightmare';
  mapImage?: string;
  tips: string[];
  enemies: Array<{ name: string; count: number; level?: number }>;
  loot: Array<{ itemId: string; spawnChance: number; quantity: number }>;
  recommendedGear: string[];
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
  author: {
    id: string;
    username: string;
  };
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Patch {
  id: string;
  version: string;
  title: string;
  releaseDate: string;
  content: string;
  changes: Array<{
    type: 'NEW' | 'CHANGED' | 'FIXED' | 'REMOVED';
    description: string;
  }>;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  token: string;
  expiresIn: string;
}

export interface AuthState {
  user: LoginResponse['user'] | null;
  token: string | null;
  isAuthenticated: boolean;
}
