import axios, { AxiosInstance } from 'axios';
import { ApiResponse, Item, Location, Guide, Patch, LoginRequest, LoginResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
  }

  setToken(token: string | null) {
    this.token = token;
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.client.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      credentials
    );
    return response.data.data as LoginResponse;
  }

  async logout() {
    await this.client.post('/auth/logout');
  }

  async getMe() {
    const response = await this.client.get('/auth/me');
    return response.data.data;
  }

  // Items endpoints
  async getItems(params?: any) {
    const response = await this.client.get<ApiResponse<Item[]>>('/items', { params });
    return response.data;
  }

  async getItem(id: string) {
    const response = await this.client.get<ApiResponse<Item>>(`/items/${id}`);
    return response.data.data;
  }

  async searchItems(q: string, limit?: number) {
    const response = await this.client.get<ApiResponse<Item[]>>('/items/search', {
      params: { q, limit },
    });
    return response.data.data;
  }

  async createItem(data: Partial<Item>) {
    const response = await this.client.post<ApiResponse<Item>>('/items', data);
    return response.data.data;
  }

  async updateItem(id: string, data: Partial<Item>) {
    const response = await this.client.put<ApiResponse<Item>>(`/items/${id}`, data);
    return response.data.data;
  }

  async deleteItem(id: string) {
    await this.client.delete(`/items/${id}`);
  }

  // Locations endpoints
  async getLocations(params?: any) {
    const response = await this.client.get<ApiResponse<Location[]>>('/locations', { params });
    return response.data;
  }

  async getLocation(id: string) {
    const response = await this.client.get<ApiResponse<Location>>(`/locations/${id}`);
    return response.data.data;
  }

  // Guides endpoints
  async getGuides(params?: any) {
    const response = await this.client.get<ApiResponse<Guide[]>>('/guides', { params });
    return response.data;
  }

  async getGuide(slug: string) {
    const response = await this.client.get<ApiResponse<Guide>>(`/guides/${slug}`);
    return response.data.data;
  }

  // Patches endpoints
  async getPatches(params?: any) {
    const response = await this.client.get<ApiResponse<Patch[]>>('/patches', { params });
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
