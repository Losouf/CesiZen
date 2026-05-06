import { API_URL } from '../config/api';

export interface InfoArticle {
  id: number;
  title: string;
  body: string;
  publishedAt: string;
  authorId: number;
  authorName?: string;
  readTime?: number;
  imageUrl?: string;
  isFavorite: boolean;
}

export interface CreateInfoArticle {
  title: string;
  body: string;
  authorId: number;
  readTime?: number;
  imageUrl?: string;
}

export interface UpdateInfoArticle {
  title: string;
  body: string;
  readTime?: number;
  imageUrl?: string;
}

export const articleService = {
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  async getAll(): Promise<InfoArticle[]> {
    const response = await fetch(`${API_URL}/InfoArticles`);
    if (!response.ok) throw new Error('Failed to fetch articles');
    return response.json();
  },

  async getById(id: number): Promise<InfoArticle> {
    const response = await fetch(`${API_URL}/InfoArticles/${id}`);
    if (!response.ok) throw new Error('Failed to fetch article');
    return response.json();
  },

  async create(data: CreateInfoArticle): Promise<InfoArticle> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/InfoArticles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to create article');
    return response.json();
  },

  async update(id: number, data: UpdateInfoArticle): Promise<void> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/InfoArticles/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to update article');
  },

  async delete(id: number): Promise<void> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/InfoArticles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to delete article');
  },

  async toggleFavorite(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/FavoriteArticles/toggle/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erreur lors du changement de favori");
    }
  }
};
