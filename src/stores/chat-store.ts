import { defineStore, acceptHMRUpdate } from 'pinia';

interface Message {
  role: 'ai' | 'user';
  text: string;
  timestamp: number;
}

interface ChatSession {
  id: string;
  preview: string;
  date: string;
  timestamp: number;
  messages: Message[];
}

  type MonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export const useChatStore = defineStore('chat', {
  state: () => ({
    sessions: [] as ChatSession[],
    currentSessionId: null as string | null,
  }),

  persist: true,

  getters: {
    sortedSessions: (state) => {
      return [...state.sessions].sort((a, b) => b.timestamp - a.timestamp);
    },

    currentSession: (state) => {
      return state.sessions.find(s => s.id === state.currentSessionId);
    },
  },

  actions: {
    createSession(firstMessage: string): string {
      const sessionId = `chat_${Date.now()}`;
      const now = new Date();

      const session: ChatSession = {
        id: sessionId,
        preview: firstMessage.substring(0, 50) + (firstMessage.length > 50 ? '...' : ''),
        date: this.formatDate(now),
        timestamp: now.getTime(),
        messages: [],
      };

      this.sessions.unshift(session);
      this.currentSessionId = sessionId;

      // Limitar a 50 sesiones
      if (this.sessions.length > 50) {
        this.sessions = this.sessions.slice(0, 50);
      }

      return sessionId;
    },

    addMessage(sessionId: string, message: Message) {
      const session = this.sessions.find(s => s.id === sessionId);
      if (session) {
        session.messages.push(message);
        session.timestamp = Date.now();
        session.date = this.formatDate(new Date());
      }
    },

    loadSession(sessionId: string) {
      this.currentSessionId = sessionId;
    },

    deleteSession(sessionId: string) {
      this.sessions = this.sessions.filter(s => s.id !== sessionId);
      if (this.currentSessionId === sessionId) {
        this.currentSessionId = null;
      }
    },

    clearAllSessions() {
      this.sessions = [];
      this.currentSessionId = null;
    },

    formatDate(date: Date): string {
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (hours < 1) {
        return 'Hace un momento';
      } else if (hours < 24) {
        return `Hace ${hours}h`;
      } else if (days === 1) {
        return 'Ayer';
      } else if (days < 7) {
        return `Hace ${days}d`;
      } else {
        return `${date.getDate()} ${date.getMonth}}`;
      }
    },


      },
    });
    if (import.meta.hot) {
      import.meta.hot.accept(acceptHMRUpdate(useChatStore, import.meta.hot));
    }




