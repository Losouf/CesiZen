import { API_URL } from '../config/api';

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  expiresAt: string;
}

export interface UserPreference {
  darkTheme: boolean;
  language: string;
}

export interface UserPrivacy {
  isProfilePublic: boolean;
  dataSharingConsent: boolean;
}

export interface UserNotification {
  emailEnabled: boolean;
  pushEnabled: boolean;
  weeklySummary: boolean;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  phone?: string;
  birthDate?: string;
  profilePictureUrl?: string;
  role?: string;
  createdAt?: string;
  preferences?: UserPreference;
  privacy?: UserPrivacy;
  notifications?: UserNotification;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }

    const data = await response.json();
    this.setToken(data.token);
    return data;
  },

  async register(username: string, email: string, password: string, displayName?: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, displayName }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Registration failed');
    }

    const data = await response.json();
    this.setToken(data.token);
    return data;
  },

  async getCurrentUser(): Promise<UserInfo> {
    const token = this.getToken();
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      this.logout();
      throw new Error('Session expired');
    }

    return await response.json();
  },

  logout() {
    localStorage.removeItem('token');
  },

  setToken(token: string) {
    localStorage.setItem('token', token);
  },

  getToken() {
    return localStorage.getItem('token');
  },

  async updateProfile(data: Partial<UserInfo>): Promise<void> {
    const token = this.getToken();
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_URL}/auth/me/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to update profile');
    }
  },

  async updatePreferences(data: UserPreference): Promise<void> {
    const token = this.getToken();
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_URL}/auth/me/preferences`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to update preferences');
    }
  },

  async getPrivacy(): Promise<UserPrivacy> {
    const token = this.getToken();
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_URL}/UserPrivacy/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to fetch privacy settings');
    return response.json();
  },

  async updatePrivacy(data: UserPrivacy): Promise<void> {
    const token = this.getToken();
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_URL}/UserPrivacy/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to update privacy settings');
    }
  },

  async getNotifications(): Promise<UserNotification> {
    const token = this.getToken();
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_URL}/UserNotification/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to fetch notification settings');
    return response.json();
  },

  async updateNotifications(data: UserNotification): Promise<void> {
    const token = this.getToken();
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_URL}/UserNotification/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to update notification settings');
    }
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};
