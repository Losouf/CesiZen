import { API_URL } from '../config/api';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  displayName?: string;
  role?: string;
  roleId?: number;
  createdAt?: string;
}

export interface CreateAdminUser {
  username: string;
  email: string;
  password: string;
  displayName?: string;
  roleId?: number;
}

export interface UpdateAdminUser {
  displayName?: string;
  email?: string;
  roleId?: number;
  newPassword?: string;
}

export const userService = {
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  async getAll(): Promise<AdminUser[]> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/Users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  async getById(id: number): Promise<AdminUser> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/Users/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  async create(data: CreateAdminUser): Promise<{ id: number }> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/Users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || 'Failed to create user');
    }
    return response.json();
  },

  async update(id: number, data: UpdateAdminUser): Promise<void> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/Users/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update user');
  },

  async delete(id: number): Promise<void> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/Users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete user');
  }
};
