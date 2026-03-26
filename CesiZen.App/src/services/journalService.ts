const API_URL = `${window.location.protocol}//${window.location.hostname}:5000/api`;

export interface JournalEntry {
  id: number;
  loggedAt: string;
  content: string;
  userId: number;
  emotionId: number;
  emotionLabel?: string;
}

export interface CreateJournalEntry {
  content: string;
  userId: number;
  emotionId: number;
}

export interface UpdateJournalEntry {
  content: string;
  emotionId: number;
}

export const journalService = {
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  async getAll(): Promise<JournalEntry[]> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/JournalEntries`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch journal entries');
    return response.json();
  },

  async getById(id: number): Promise<JournalEntry> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/JournalEntries/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch journal entry');
    return response.json();
  },

  async create(data: CreateJournalEntry): Promise<JournalEntry> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/JournalEntries`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to create journal entry');
    return response.json();
  },

  async update(id: number, data: UpdateJournalEntry): Promise<void> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/JournalEntries/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to update journal entry');
  },

  async delete(id: number): Promise<void> {
    const token = this.getToken();
    const response = await fetch(`${API_URL}/JournalEntries/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to delete journal entry');
  }
};
