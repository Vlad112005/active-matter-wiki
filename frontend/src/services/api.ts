import axios, { AxiosInstance } from 'axios';
import { ApiResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  async get<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    return this.client.get(url, config);
  }

  async post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.client.post(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.client.put(url, data, config);
  }

  async delete<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    return this.client.delete(url, config);
  }

  async login(credentials: { username: string; password: string }) {
    const response = await this.post<any>('/auth/login', credentials);
    return response.data;
  }

  async register(data: { email: string; username: string; password: string }) {
    const response = await this.post<any>('/auth/register', data);
    return response.data;
  }

  async logout() {
    return this.post('/auth/logout');
  }

  async getMe() {
    const response = await this.get<any>('/auth/me');
    return response.data;
  }
}

export const apiClient = new ApiClient();
