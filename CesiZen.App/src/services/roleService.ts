import { API_URL } from '../config/api';
import type { Permission } from './permissionService';

export interface Role {
  id: number;
  label: string;
}

export interface RoleWithPermissions {
  id: number;
  label: string;
  permissions: Permission[];
}

export interface CreateRole {
  label: string;
}

export interface UpdateRole {
  label: string;
}

const token = () => localStorage.getItem('token');

export const roleService = {
  async getAll(): Promise<Role[]> {
    const res = await fetch(`${API_URL}/Roles`, {
      headers: { 'Authorization': `Bearer ${token()}` }
    });
    if (!res.ok) throw new Error('Failed to fetch roles');
    return res.json();
  },

  async getById(id: number): Promise<Role> {
    const res = await fetch(`${API_URL}/Roles/${id}`, {
      headers: { 'Authorization': `Bearer ${token()}` }
    });
    if (!res.ok) throw new Error('Failed to fetch role');
    return res.json();
  },

  async create(data: CreateRole): Promise<Role> {
    const res = await fetch(`${API_URL}/Roles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create role');
    return res.json();
  },

  async update(id: number, data: UpdateRole): Promise<void> {
    const res = await fetch(`${API_URL}/Roles/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update role');
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/Roles/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token()}` }
    });
    if (!res.ok) throw new Error('Failed to delete role');
  },

  async getRolePermissions(roleId: number): Promise<RoleWithPermissions> {
    const res = await fetch(`${API_URL}/Roles/${roleId}/permissions`, {
      headers: { 'Authorization': `Bearer ${token()}` }
    });
    if (!res.ok) throw new Error('Failed to fetch role permissions');
    return res.json();
  },

  async addPermission(roleId: number, permissionId: number): Promise<void> {
    const res = await fetch(`${API_URL}/Roles/${roleId}/permissions/${permissionId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token()}` }
    });
    if (!res.ok) throw new Error('Failed to add permission to role');
  },

  async removePermission(roleId: number, permissionId: number): Promise<void> {
    const res = await fetch(`${API_URL}/Roles/${roleId}/permissions/${permissionId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token()}` }
    });
    if (!res.ok) throw new Error('Failed to remove permission from role');
  },

  async getAllPermissions(): Promise<Permission[]> {
    const res = await fetch(`${API_URL}/Roles/permissions`, {
      headers: { 'Authorization': `Bearer ${token()}` }
    });
    if (!res.ok) throw new Error('Failed to fetch permissions');
    return res.json();
  }
};
