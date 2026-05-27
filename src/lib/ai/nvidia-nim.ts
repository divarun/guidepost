import axios from 'axios';

const NIM_API_KEY = process.env.NVIDIA_NIM_API_KEY;
const NIM_BASE_URL = process.env.NVIDIA_NIM_BASE_URL || 'https://integrate.api.nvidia.com/v1';
const NIM_MODEL = process.env.NVIDIA_NIM_MODEL || 'meta/llama-3.1-70b-instruct';

export class NvidiaClient {
  private baseURL: string;
  private model: string;
  private apiKey: string;

  constructor() {
    this.baseURL = NIM_BASE_URL;
    this.model = NIM_MODEL;
    this.apiKey = NIM_API_KEY || '';
  }

  async generate(
    prompt: string,
    options?: { temperature?: number; top_p?: number; max_tokens?: number }
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error(
        'NVIDIA NIM API key not configured. Set NVIDIA_NIM_API_KEY in your environment.'
      );
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: options?.temperature ?? 0.7,
          top_p: options?.top_p ?? 0.9,
          max_tokens: options?.max_tokens ?? 2048,
          stream: false,
        },
        {
          timeout: 60000,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      return response.data.choices?.[0]?.message?.content ?? '';
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401) throw new Error('Invalid NVIDIA NIM API key.');
        if (status === 429) throw new Error('NVIDIA NIM rate limit exceeded. Please try again later.');
        throw new Error(`NVIDIA NIM API error: ${error.message}`);
      }
      throw error;
    }
  }
}

export const nim = new NvidiaClient();
