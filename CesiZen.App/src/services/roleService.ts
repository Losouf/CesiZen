const API_URL = `${window.location.protocol}//${window.location.hostname}:5000/api`;

export interface Role {
  id: number;
  label: string;
}

export interface Permission {
  id: number;
  label: string;
  code: string;
}

export interface CreateRole {
  label: string;
}

export interface UpdateRole {
  label: string;
}

export const roleService = {
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  async getAll(): Promise<Role[]> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/Roles`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch roles');
    return response.json();
  },

  async getById(id: number): Promise<Role> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/Roles/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch role');
    return response.json();
  },

  async create(data: CreateRole): Promise<Role> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/Roles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to create role');
    return response.json();
  },

  async update(id: number, data: UpdateRole): Promise<void> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/Roles/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to update role');
  },

  async delete(id: number): Promise<void> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/Roles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to delete role');
  },

  async getAllPermissions(): Promise<Permission[]> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/Roles/permissions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch permissions');
    return response.json();
  }
};
