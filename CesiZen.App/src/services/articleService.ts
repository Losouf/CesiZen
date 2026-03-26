const API_URL = 'http://localhost:5000/api';

export interface InfoArticle {
  id: number;
  title: string;
  body: string;
  publishedAt: string;
  authorId: number;
  authorName?: string;
}

export interface CreateInfoArticle {
  title: string;
  body: string;
  authorId: number;
}

export interface UpdateInfoArticle {
  title: string;
  body: string;
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
  }
};
