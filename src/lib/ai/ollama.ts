import axios from 'axios';
import { OllamaRequest, OllamaResponse } from '@/types/ai';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';

export class OllamaClient {
  private baseURL: string;
  private model: string;

  constructor(baseURL: string = OLLAMA_HOST, model: string = OLLAMA_MODEL) {
    this.baseURL = baseURL;
    this.model = model;
  }

  async generate(prompt: string, options?: OllamaRequest['options']): Promise<string> {
    try {
      const response = await axios.post<OllamaResponse>(
        `${this.baseURL}/api/generate`,
        {
          model: this.model,
          prompt,
          stream: false,
          options: {
            temperature: options?.temperature ?? 0.7,
            top_p: options?.top_p ?? 0.9,
            ...options,
          },
        },
        {
          timeout: 120000, // 2 minutes timeout
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error(
            'Unable to connect to Ollama. Please ensure Ollama is running at ' + this.baseURL
          );
        }
        throw new Error(`Ollama API error: ${error.message}`);
      }
      throw error;
    }
  }

  async *generateStream(prompt: string, options?: OllamaRequest['options']): AsyncGenerator<string> {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/generate`,
        {
          model: this.model,
          prompt,
          stream: true,
          options: {
            temperature: options?.temperature ?? 0.7,
            top_p: options?.top_p ?? 0.9,
            ...options,
          },
        },
        {
          responseType: 'stream',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      for await (const chunk of response.data) {
        const lines = chunk.toString().split('\n').filter(Boolean);
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.response) {
              yield data.response;
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error(
            'Unable to connect to Ollama. Please ensure Ollama is running at ' + this.baseURL
          );
        }
        throw new Error(`Ollama API error: ${error.message}`);
      }
      throw error;
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      await axios.get(`${this.baseURL}/api/tags`, { timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const ollama = new OllamaClient();