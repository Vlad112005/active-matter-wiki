// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Item Types
export interface ItemDTO {
  id: string;
  name: string;
  description: string;
  image?: string;
  type: ItemType;
  rarity: Rarity;
  price: number;
  weight: number;
  stackable: boolean;
  source: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type ItemType = 'weapon' | 'armor' | 'consumable' | 'quest' | 'other';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// Location Types
export interface LocationDTO {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  mapImage?: string;
  tips: string[];
  enemies: EnemyInfo[];
  loot: LootInfo[];
  recommendedGear: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'nightmare';

export interface EnemyInfo {
  name: string;
  count: number;
  level?: number;
}

export interface LootInfo {
  itemId: string;
  spawnChance: number;
  quantity: number;
}

// Guide Types
export interface GuideDTO {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface GuideVersionDTO {
  version: number;
  content: string;
  createdAt: Date;
}

// Character Types
export interface CharacterDTO {
  id: string;
  name: string;
  role: string;
  description: string;
  image?: string;
  locationId?: string;
  sells: string[];
  buys: string[];
  questsGiven: QuestDTO[];
  createdAt: Date;
  updatedAt: Date;
}

// Quest Types
export interface QuestDTO {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  giver: {
    id: string;
    name: string;
  };
  reward: string;
  requirements: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Patch Types
export interface PatchDTO {
  id: string;
  version: string;
  title: string;
  releaseDate: Date;
  content: string;
  changes: PatchChangeDTO[];
  createdAt: Date;
}

export interface PatchChangeDTO {
  type: 'NEW' | 'CHANGED' | 'FIXED' | 'REMOVED';
  description: string;
}

// Auth Types
export interface AuthPayload {
  id: string;
  username: string;
  email: string;
  role: string;
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

// Request Validation
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ItemFilters extends PaginationQuery {
  type?: ItemType;
  rarity?: Rarity;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface LocationFilters extends PaginationQuery {
  difficulty?: Difficulty;
  search?: string;
}

export interface GuideFilters extends PaginationQuery {
  category?: string;
  published?: boolean;
  featured?: boolean;
  search?: string;
}

// Error Types
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
