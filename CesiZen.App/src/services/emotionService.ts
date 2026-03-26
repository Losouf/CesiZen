const API_URL = `${window.location.protocol}//${window.location.hostname}:5000/api`;

export interface Emotion {
  id: number;
  label: string;
  color?: string;
  parentId?: number;
  createdByUserId?: number;
}

export interface CreateEmotion {
  label: string;
  color?: string;
  parentId?: number;
  createdByUserId?: number;
}

export interface UpdateEmotion {
  label: string;
  color?: string;
  parentId?: number;
}

export const emotionService = {
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  async getAll(): Promise<Emotion[]> {
    const response = await fetch(`${API_URL}/Emotions`);
    if (!response.ok) throw new Error('Failed to fetch emotions');
    return response.json();
  },

  async getById(id: number): Promise<Emotion> {
    const response = await fetch(`${API_URL}/Emotions/${id}`);
    if (!response.ok) throw new Error('Failed to fetch emotion');
    return response.json();
  },

  async create(data: CreateEmotion): Promise<Emotion> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/Emotions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to create emotion');
    return response.json();
  },

  async update(id: number, data: UpdateEmotion): Promise<void> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/Emotions/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to update emotion');
  },

  async delete(id: number): Promise<void> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/Emotions/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to delete emotion');
  }
};
