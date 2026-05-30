// src/services/auth.service.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.19:8000/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  person_name: string;
  last_name: string;
  phone: string;
  password: string;
  confirm_password: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  person_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  role: string;
  status: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

class AuthService {
  private accessToken: string | null = null;
  private refreshTokenValue: string | null = null;

  constructor() {
    this.loadTokens();
  }

  private async loadTokens() {
    this.accessToken = await AsyncStorage.getItem('access_token');
    this.refreshTokenValue = await AsyncStorage.getItem('refresh_token');
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/login/`, credentials);
      const data = response.data;
      
      await this.storeTokens(data.access, data.refresh);
      return data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/register/`, userData);
      const data = response.data;
      
      await this.storeTokens(data.access, data.refresh);
      return data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      const refresh = await AsyncStorage.getItem('refresh_token');
      if (refresh) {
        await axios.post(`${API_URL}/auth/logout/`, { refresh });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await this.clearTokens();
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const refresh = await AsyncStorage.getItem('refresh_token');
      if (!refresh) return null;

      const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
        refresh,
      });
      
      const newAccessToken = response.data.access;
      await AsyncStorage.setItem('access_token', newAccessToken);
      this.accessToken = newAccessToken;
      
      return newAccessToken;
    } catch (error) {
      await this.clearTokens();
      return null;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await this.getAccessToken();
      if (!token) return null;

      const response = await axios.get(`${API_URL}/auth/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const token = await this.getAccessToken();
    if (!token) throw new Error('No access token');

    const response = await axios.put(`${API_URL}/auth/me/update/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return response.data;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const token = await this.getAccessToken();
    if (!token) throw new Error('No access token');

    await axios.post(
      `${API_URL}/auth/me/change-password/`,
      { old_password: oldPassword, new_password: newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  async softDeleteAccount(): Promise<void> {
    const token = await this.getAccessToken();
    if (!token) throw new Error('No access token');

    await axios.delete(`${API_URL}/auth/me/delete/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    await this.clearTokens();
  }

  private async storeTokens(access: string, refresh: string): Promise<void> {
    await AsyncStorage.setItem('access_token', access);
    await AsyncStorage.setItem('refresh_token', refresh);
    this.accessToken = access;
    this.refreshTokenValue = refresh;
  }

  private async clearTokens(): Promise<void> {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    this.accessToken = null;
    this.refreshTokenValue = null;
  }

  async getAccessToken(): Promise<string | null> {
    if (this.accessToken) return this.accessToken;
    await this.loadTokens();
    return this.accessToken;
  }

  private handleError(error: any): Error {
    if (error.response?.data) {
      const data = error.response.data;
      if (typeof data === 'object') {
        const messages = Object.values(data).flat();
        return new Error(messages.join(', '));
      }
      return new Error(data.message || 'حدث خطأ غير متوقع');
    }
    return new Error('فشل الاتصال بالخادم');
  }
}

export const authService = new AuthService();