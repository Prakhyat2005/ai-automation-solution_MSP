// AI system removed: disabled stub service

export interface AIConfig {
  provider: 'disabled';
  apiKey?: string;
  model: string;
  maxTokens: number;
  temperature: number;
  baseUrl?: string;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  finishReason: string;
}

class AIService {
  private config: AIConfig;

  constructor() {
    this.config = {
      provider: 'disabled',
      apiKey: undefined,
      model: 'none',
      maxTokens: 0,
      temperature: 0,
      baseUrl: undefined,
    };
  }

  async sendMessage(messages: AIMessage[]): Promise<AIResponse> {
    return this.getMockResponse(messages);
  }

  private getMockResponse(messages: AIMessage[]): AIResponse {
    const lastMessage = messages[messages.length - 1];
    const query = lastMessage?.content?.toLowerCase?.() || '';

    const mockContent = `The AI system has been removed from this project.\n\nNo automated analysis or chatbot functionality is available.\nIf you need assistance, please use the standard features or contact support.`;

    return {
      content: mockContent,
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
      },
      model: this.config.model,
      finishReason: 'stop',
    };
  }

  getConfig(): AIConfig {
    return { ...this.config };
  }

  isReady(): boolean {
    return false;
  }

  getStatus(): { configured: boolean; provider: string; model: string } {
    return {
      configured: false,
      provider: this.config.provider,
      model: this.config.model,
    };
  }
}

export const aiService = new AIService();
export default aiService;

