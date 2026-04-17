// API Client for AI StoryTime Backend
const API_BASE_URL = 'http://localhost:8000';

class APIClient {
  constructor() {
    this.token = localStorage.getItem('access_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  }

  // Login using JSON (as required by backend)
  async login(username, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Login failed');
    }
    
    const data = await response.json();
    this.setToken(data.access_token);
    return data;
  }

  async register(username, email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    return response.json();
  }

  async getStories() {
    const response = await fetch(`${API_BASE_URL}/story/`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch stories');
    }
    
    return response.json();
  }

  async createStory(title) {
    const response = await fetch(`${API_BASE_URL}/story/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create story');
    }
    
    return response.json();
  }

  async getStory(storyId) {
    const response = await fetch(`${API_BASE_URL}/story/${storyId}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch story');
    }
    
    return response.json();
  }

  async createAvatar(storyId, name, description) {
    const response = await fetch(`${API_BASE_URL}/story/${storyId}/avatar/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create avatar');
    }
    
    return response.json();
  }

  async getMessages(storyId) {
    const response = await fetch(`${API_BASE_URL}/story/${storyId}/message/`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    
    return response.json();
  }

  async createMessage(storyId, content, role = 'user') {
    const response = await fetch(`${API_BASE_URL}/story/${storyId}/message/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, role }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create message');
    }
    
    return response.json();
  }
}

export const api = new APIClient();