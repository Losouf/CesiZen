const API_URL = `${window.location.protocol}//${window.location.hostname}:5000/api`;

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  expiresAt: string;
}

export interface UserPreference {
  emailNotifications: boolean;
  pushNotifications: boolean;
  darkTheme: boolean;
  isProfilePublic: boolean;
  language: string;
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

  isAuthenticated() {
    return !!this.getToken();
  }
}
