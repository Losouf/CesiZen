const API_URL = `${window.location.protocol}//${window.location.hostname}:5000/api`;

export interface UserPreference {
  darkTheme: boolean;
  language: string;
}

export const userPreferenceService = {
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  async getMe(): Promise<UserPreference> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/UserPreferences/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch preferences');
    return response.json();
  },

  async updateMe(data: UserPreference): Promise<void> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/UserPreferences/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to update preferences');
  },

  async deleteMe(): Promise<void> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/UserPreferences/me`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to delete preferences');
  }
};
