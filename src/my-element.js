import { LitElement, html } from 'lit';
import { api } from './services/api';
import './styles.css';

class LoginScreen extends LitElement {
  static properties = {
    username: { type: String },
    password: { type: String },
    error: { type: String },
    isLoading: { type: Boolean }
  };

  constructor() {
    super();
    this.username = '';
    this.password = '';
    this.error = '';
    this.isLoading = false;
  }

  async handleLogin() {
    if (!this.username || !this.password) {
      this.error = 'Please enter both username and password! ✨';
      return;
    }

    this.isLoading = true;
    this.error = '';

    try {
      await api.login(this.username, this.password);
      this.dispatchEvent(new CustomEvent('login-success'));
    } catch (err) {
      this.error = 'Oops! Wrong username or password. Try again? 🌟';
    } finally {
      this.isLoading = false;
    }
  }

  render() {
    return html`
      <div class="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full transform transition-all">
          <div class="text-center mb-8">
            <div class="text-7xl mb-4">📖✨</div>
            <h1 class="text-4xl font-bold text-purple-600 mb-2">AI StoryTime</h1>
            <p class="text-gray-600">Create magical adventures together!</p>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-gray-700 font-semibold mb-2">Your Name</label>
              <input 
                type="text" 
                .value=${this.username}
                @input=${(e) => this.username = e.target.value}
                @keypress=${(e) => e.key === 'Enter' && this.handleLogin()}
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                placeholder="Enter your username..."
                ?disabled=${this.isLoading}
              >
            </div>

            <div>
              <label class="block text-gray-700 font-semibold mb-2">Secret Word</label>
              <input 
                type="password" 
                .value=${this.password}
                @input=${(e) => this.password = e.target.value}
                @keypress=${(e) => e.key === 'Enter' && this.handleLogin()}
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                placeholder="Enter your password..."
                ?disabled=${this.isLoading}
              >
            </div>

            ${this.error ? html`
              <div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg">
                <p class="font-medium">${this.error}</p>
              </div>
            ` : ''}

            <button 
              @click=${this.handleLogin}
              ?disabled=${this.isLoading}
              class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 text-lg"
            >
              ${this.isLoading ? '✨ Creating Magic...' : 'Start Your Adventure →'}
            </button>
          </div>

          <div class="mt-6 text-center text-sm text-gray-500">
            <p>💡 Tip: Use "alice" / "password123" to start!</p>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('login-screen', LoginScreen);

class StoryLibrary extends LitElement {
  static properties = {
    stories: { type: Array },
    isLoading: { type: Boolean },
    showCreator: { type: Boolean },
    newStoryTitle: { type: String }
  };

  constructor() {
    super();
    this.stories = [];
    this.isLoading = true;
    this.showCreator = false;
    this.newStoryTitle = '';
    this.loadStories();
  }

  async loadStories() {
    try {
      this.stories = await api.getStories();
    } catch (err) {
      console.error('Failed to load stories:', err);
    } finally {
      this.isLoading = false;
    }
  }

  async createStory() {
    if (!this.newStoryTitle.trim()) return;
    
    try {
      const story = await api.createStory(this.newStoryTitle);
      this.stories.unshift(story);
      this.showCreator = false;
      this.newStoryTitle = '';
    } catch (err) {
      console.error('Failed to create story:', err);
    }
  }

  selectStory(storyId) {
    this.dispatchEvent(new CustomEvent('story-selected', { detail: { storyId } }));
  }

  render() {
    return html`
      <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div class="max-w-6xl mx-auto p-6">
          <!-- Header -->
          <div class="flex justify-between items-center mb-8">
            <div>
              <h1 class="text-4xl font-bold text-purple-600">📚 Your Adventures</h1>
              <p class="text-gray-600 mt-2">Choose a story or create a new one!</p>
            </div>
            <button 
              @click=${() => this.showCreator = !this.showCreator}
              class="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
            >
              ✨ New Adventure
            </button>
          </div>

          <!-- Story Creator -->
          ${this.showCreator ? html`
            <div class="bg-white rounded-2xl shadow-xl p-6 mb-8 animate-bounce-in">
              <h2 class="text-2xl font-bold text-gray-800 mb-4">Create New Adventure</h2>
              <div class="flex gap-3">
                <input 
                  type="text"
                  .value=${this.newStoryTitle}
                  @input=${(e) => this.newStoryTitle = e.target.value}
                  @keypress=${(e) => e.key === 'Enter' && this.createStory()}
                  class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="Give your adventure a name..."
                >
                <button 
                  @click=${this.createStory}
                  class="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-all"
                >
                  Create! 🚀
                </button>
                <button 
                  @click=${() => this.showCreator = false}
                  class="bg-gray-400 text-white px-6 py-3 rounded-xl hover:bg-gray-500 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ` : ''}

          <!-- Stories Grid -->
          ${this.isLoading ? html`
            <div class="text-center py-12">
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p class="mt-4 text-gray-600">Loading your adventures...</p>
            </div>
          ` : this.stories.length === 0 ? html`
            <div class="text-center py-12 bg-white rounded-2xl shadow-lg">
              <div class="text-6xl mb-4">📖✨</div>
              <h3 class="text-2xl font-bold text-gray-700 mb-2">No Adventures Yet!</h3>
              <p class="text-gray-500">Click "New Adventure" to start your first story!</p>
            </div>
          ` : html`
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${this.stories.map(story => html`
                <div 
                  @click=${() => this.selectStory(story.id)}
                  class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer overflow-hidden"
                >
                  <div class="bg-gradient-to-r from-purple-500 to-pink-500 h-32 flex items-center justify-center">
                    <span class="text-6xl">📖</span>
                  </div>
                  <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${story.title || 'Untitled Adventure'}</h3>
                    <p class="text-gray-500 text-sm">Click to continue your story ✨</p>
                  </div>
                </div>
              `)}
            </div>
          `}
        </div>
      </div>
    `;
  }
}

customElements.define('story-library', StoryLibrary);

class StoryChat extends LitElement {
  static properties = {
    storyId: { type: Number },
    messages: { type: Array },
    currentInput: { type: String },
    isLoading: { type: Boolean },
    story: { type: Object },
    avatar: { type: Object }
  };

  constructor() {
    super();
    this.messages = [];
    this.currentInput = '';
    this.isLoading = false;
    this.story = null;
    this.avatar = null;
    this.loadStoryData();
  }

  async loadStoryData() {
    try {
      this.story = await api.getStory(this.storyId);
      const messages = await api.getMessages(this.storyId);
      this.messages = messages;
      
      // Check if avatar exists
      if (this.story.avatar_id) {
        // Avatar would be loaded here
      }
    } catch (err) {
      console.error('Failed to load story:', err);
    }
  }

  async sendMessage() {
    if (!this.currentInput.trim() || this.isLoading) return;

    const userMessage = this.currentInput.trim();
    this.currentInput = '';
    
    // Add user message
    this.messages.push({ content: userMessage, role: 'user' });
    this.isLoading = true;
    this.requestUpdate();

    try {
      // Send to backend and get AI response
      const response = await api.createMessage(this.storyId, userMessage, 'user');
      // Wait for AI response (you might need a separate endpoint for AI generation)
      // For now, let's simulate by getting messages again
      const updatedMessages = await api.getMessages(this.storyId);
      this.messages = updatedMessages;
    } catch (err) {
      console.error('Failed to send message:', err);
      this.messages.push({ 
        content: "✨ The story machine needs a moment! Let's try again?", 
        role: 'assistant' 
      });
    } finally {
      this.isLoading = false;
    }
  }

  render() {
    return html`
      <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
        <!-- Header -->
        <div class="bg-white shadow-md p-4 sticky top-0 z-10">
          <div class="max-w-4xl mx-auto flex justify-between items-center">
            <div class="flex items-center gap-3">
              <button 
                @click=${() => this.dispatchEvent(new CustomEvent('back-to-library'))}
                class="text-purple-600 hover:text-purple-800 text-2xl"
              >
                ←
              </button>
              <div>
                <h1 class="text-2xl font-bold text-purple-600">${this.story?.title || 'Your Adventure'}</h1>
                <p class="text-sm text-gray-500">Continue the story!</p>
              </div>
            </div>
            <div class="text-3xl">🐉 ✨</div>
          </div>
        </div>

        <!-- Messages -->
        <div class="flex-1 max-w-4xl mx-auto w-full p-4 pb-32">
          ${this.messages.map(msg => html`
            <div class="mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}">
              <div class="inline-block max-w-3xl ${msg.role === 'user' 
                ? 'bg-purple-600 text-white rounded-2xl rounded-tr-sm' 
                : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm shadow-md'} p-4">
                <p class="text-lg">${msg.content}</p>
              </div>
            </div>
          `)}
          
          ${this.isLoading ? html`
            <div class="text-left">
              <div class="inline-block bg-white rounded-2xl p-4 shadow-md">
                <div class="flex gap-2">
                  <div class="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                  <div class="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Input -->
        <div class="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-purple-100 p-4">
          <div class="max-w-4xl mx-auto flex gap-3">
            <input 
              type="text"
              .value=${this.currentInput}
              @input=${(e) => this.currentInput = e.target.value}
              @keypress=${(e) => e.key === 'Enter' && this.sendMessage()}
              class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-full focus:border-purple-500 focus:outline-none text-lg"
              placeholder="What happens next in your story?..."
              ?disabled=${this.isLoading}
            >
            <button 
              @click=${this.sendMessage}
              ?disabled=${this.isLoading || !this.currentInput.trim()}
              class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 font-semibold"
            >
              Send ✨
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('story-chat', StoryChat);

// Main App Component
export class MyElement extends LitElement {
  static properties = {
    isLoggedIn: { type: Boolean },
    currentView: { type: String },
    selectedStoryId: { type: Number }
  };

  constructor() {
    super();
    this.isLoggedIn = !!api.token;
    this.currentView = 'library';
    this.selectedStoryId = null;
  }

  handleLoginSuccess() {
    this.isLoggedIn = true;
    this.currentView = 'library';
  }

  handleStorySelected(e) {
    this.selectedStoryId = e.detail.storyId;
    this.currentView = 'chat';
  }

  handleBackToLibrary() {
    this.currentView = 'library';
    this.selectedStoryId = null;
  }

  render() {
    if (!this.isLoggedIn) {
      return html`<login-screen @login-success=${this.handleLoginSuccess}></login-screen>`;
    }

    if (this.currentView === 'library') {
      return html`<story-library @story-selected=${this.handleStorySelected}></story-library>`;
    }

    if (this.currentView === 'chat' && this.selectedStoryId) {
      return html`<story-chat 
        .storyId=${this.selectedStoryId}
        @back-to-library=${this.handleBackToLibrary}
      ></story-chat>`;
    }

    return html`<story-library></story-library>`;
  }
}

customElements.define('my-element', MyElement);