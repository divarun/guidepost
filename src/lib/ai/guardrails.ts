import { ollama } from './ollama';
import { formatGuardrailPrompt } from './prompts';

export class AIGuardrails {
  async checkContent(text: string): Promise<{ safe: boolean; reason?: string }> {
    // Check for obvious PII patterns
    const piiPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b\d{16}\b/, // Credit card
      /\b\d{3}-\d{3}-\d{4}\b/, // Phone number
    ];

    for (const pattern of piiPatterns) {
      if (pattern.test(text)) {
        return {
          safe: false,
          reason: 'Content contains potential personally identifiable information',
        };
      }
    }

    // Check content length
    if (text.length > 50000) {
      return {
        safe: false,
        reason: 'Content exceeds maximum length',
      };
    }

    // Use AI to check for additional safety concerns
    try {
      const prompt = formatGuardrailPrompt(text);
      const response = await ollama.generate(prompt, { temperature: 0.1 });

      const isSafe = response.trim().toUpperCase().includes('SAFE');

      return {
        safe: isSafe,
        reason: isSafe ? undefined : 'Content flagged by AI safety check',
      };
    } catch (error) {
      // If AI check fails, err on the side of caution but log the error
      console.error('AI guardrail check failed:', error);
      return { safe: true }; // Allow content if guardrail check fails
    }
  }

  validateEssayContent(content: string): { valid: boolean; error?: string } {
    if (!content || content.trim().length === 0) {
      return { valid: false, error: 'Essay content cannot be empty' };
    }

    if (content.length > 10000) {
      return { valid: false, error: 'Essay content exceeds maximum length of 10,000 characters' };
    }

    const wordCount = content.trim().split(/\s+/).length;
    if (wordCount < 10) {
      return { valid: false, error: 'Essay must contain at least 10 words' };
    }

    return { valid: true };
  }

  sanitizeResponse(response: string): string {
    // Remove any potential code injection attempts
    let sanitized = response.replace(/<script[^>]*>.*?<\/script>/gi, '');
    sanitized = sanitized.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');

    return sanitized.trim();
  }

  parseJSONResponse<T>(response: string): T | null {
    try {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }

      // Try to parse directly
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse JSON response:', error);
      return null;
    }
  }

  validateFinancialAmount(amount: number): boolean {
    return amount >= 0 && amount <= 500000; // Reasonable range for college costs
  }
}

export const guardrails = new AIGuardrails();