import { Message } from '../components/DogChat';

export interface ChatData {
  messages: Message[];
  metadata: {
    created: string;
    lastUpdated: string;
    totalMessages: number;
    description: string;
  };
}

export class MowgliChatService {
  private static instance: MowgliChatService;
  private readonly STORAGE_KEY = 'mowgli-chat-data';
  private readonly FALLBACK_DATA: ChatData = {
    messages: [
      {
        id: '1',
        text: "*soft bark* Woof... I'm here. I miss you so much. Tell me about your day?",
        sender: 'dog',
        timestamp: new Date().toISOString()
      }
    ],
    metadata: {
      created: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      totalMessages: 1,
      description: 'Chat messages between user and Mowgli (the dog)'
    }
  };

  static getInstance(): MowgliChatService {
    if (!MowgliChatService.instance) {
      MowgliChatService.instance = new MowgliChatService();
    }
    return MowgliChatService.instance;
  }

  async loadMessages(): Promise<ChatData> {
    try {
      // Try to load from localStorage first
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData) as ChatData;
        return parsedData;
      }

      // If no localStorage data, try to load from JSON file
      try {
        const response = await fetch('/data/mowgli-messages.json');
        if (response.ok) {
          const fileData = await response.json() as ChatData;
          // Save to localStorage for future use
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(fileData));
          return fileData;
        }
      } catch (fileError) {
        console.log('Could not load from JSON file, using localStorage');
      }

      // Return fallback data
      return this.FALLBACK_DATA;
    } catch (error) {
      console.error('Error loading messages:', error);
      return this.FALLBACK_DATA;
    }
  }

  async saveMessages(messages: Message[]): Promise<void> {
    const chatData: ChatData = {
      messages,
      metadata: {
        created: this.FALLBACK_DATA.metadata.created,
        lastUpdated: new Date().toISOString(),
        totalMessages: messages.length,
        description: this.FALLBACK_DATA.metadata.description
      }
    };

    try {
      // Save to localStorage (primary storage)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(chatData));
      
      // In a real implementation, you would also save to a backend API here
      // For now, we'll provide a method to export the data as JSON
      this.exportToJSON(chatData);
    } catch (error) {
      console.error('Error saving messages:', error);
      throw error;
    }
  }

  async addMessage(text: string, sender: 'user' | 'dog'): Promise<void> {
    const currentData = await this.loadMessages();
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...currentData.messages, newMessage];
    await this.saveMessages(updatedMessages);
  }

  exportToJSON(data: ChatData): void {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mowgli-messages-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting to JSON:', error);
    }
  }

  async importFromJSON(file: File): Promise<ChatData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content) as ChatData;
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  clearMessages(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getMessageStats(): { total: number; user: number; dog: number; firstMessage?: string; lastMessage?: string } {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return { total: 0, user: 0, dog: 0 };
      
      const chatData = JSON.parse(data) as ChatData;
      const messages = chatData.messages;
      
      return {
        total: messages.length,
        user: messages.filter(m => m.sender === 'user').length,
        dog: messages.filter(m => m.sender === 'dog').length,
        firstMessage: messages[0]?.text,
        lastMessage: messages[messages.length - 1]?.text
      };
    } catch (error) {
      console.error('Error getting message stats:', error);
      return { total: 0, user: 0, dog: 0 };
    }
  }
}

export default MowgliChatService;