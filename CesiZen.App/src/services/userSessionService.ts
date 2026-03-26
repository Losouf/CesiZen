const API_URL = `${window.location.protocol}//${window.location.hostname}:5000/api`;

export interface UserSession {
  id: number;
  jwtId: string;
  isRevoked: boolean;
  createdAt: string;
  expiresAt: string;
  userId: number;
}

export const userSessionService = {
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  async getAll(): Promise<UserSession[]> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/UserSessions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch sessions');
    return response.json();
  },

  async revoke(id: number): Promise<void> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/UserSessions/revoke/${id}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to revoke session');
  },

  async delete(id: number): Promise<void> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/UserSessions/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete session');
  }
};
