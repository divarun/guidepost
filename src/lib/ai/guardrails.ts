export class AIGuardrails {
  checkContent(text: string): { safe: boolean; reason?: string } {
    const piiPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b\d{16}\b/,             // Credit card
      /\b\d{3}-\d{3}-\d{4}\b/, // Phone number
    ];

    for (const pattern of piiPatterns) {
      if (pattern.test(text)) {
        return { safe: false, reason: 'Content contains potential personally identifiable information' };
      }
    }

    if (text.length > 50000) {
      return { safe: false, reason: 'Content exceeds maximum length' };
    }

    return { safe: true };
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
    let sanitized = response.replace(/<script[^>]*>.*?<\/script>/gi, '');
    sanitized = sanitized.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');
    return sanitized.trim();
  }

  parseJSONResponse<T>(response: string): T | null {
    try {
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) return JSON.parse(jsonMatch[1]);
      // Extract first {...} block in case of leading/trailing prose
      const objectMatch = response.match(/\{[\s\S]*\}/);
      if (objectMatch) return JSON.parse(objectMatch[0]);
      return JSON.parse(response);
    } catch {
      console.error('Failed to parse JSON response');
      return null;
    }
  }
}

export const guardrails = new AIGuardrails();
