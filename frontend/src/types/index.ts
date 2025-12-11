export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  role: {
    id: string;
    name: string;
    description?: string;
  };
  isPremium: boolean;
  premiumUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface Item {
  id: string;
  name: string;
  description: string;
  image?: string;
  type: string;
  rarity: string;
  price: number;
  weight: number;
  stackable: boolean;
  maxStack: number;
  source: string[];
  tags: string[];
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
  createdAt: string;
  updatedAt: string;
}
