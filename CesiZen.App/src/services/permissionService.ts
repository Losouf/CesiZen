import { API_URL } from '../config/api';

export interface Permission {
  id: number;
  label: string;
  code: string;
}

export interface CreatePermission {
  label: string;
  code: string;
}

export interface UpdatePermission {
  label: string;
  code: string;
}

const token = () => localStorage.getItem('token');

export const permissionService = {
  async getAll(): Promise<Permission[]> {
    const res = await fetch(`${API_URL}/Permissions`, {
      headers: { 'Authorization': `Bearer ${token()}` }
    });
    if (!res.ok) throw new Error('Failed to fetch permissions');
    return res.json();
  },

  async getById(id: number): Promise<Permission> {
    const res = await fetch(`${API_URL}/Permissions/${id}`, {
      headers: { 'Authorization': `Bearer ${token()}` }
    });
    if (!res.ok) throw new Error('Failed to fetch permission');
    return res.json();
  },

  async create(data: CreatePermission): Promise<Permission> {
    const res = await fetch(`${API_URL}/Permissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text() || 'Failed to create permission');
    return res.json();
  },

  async update(id: number, data: UpdatePermission): Promise<void> {
    const res = await fetch(`${API_URL}/Permissions/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text() || 'Failed to update permission');
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/Permissions/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token()}` }
    });
    if (!res.ok) throw new Error('Failed to delete permission');
  }
};
