export interface EssayFeedbackRequest {
  essayId: string;
  content: string;
  prompt: string;
}

export interface EssayFeedbackResponse {
  success: boolean;
  feedback?: {
    narrativeClarity: {
      score: number;
      comments: string;
    };
    promptAlignment: {
      score: number;
      comments: string;
    };
    specificityVsGenerality: {
      score: number;
      comments: string;
    };
    revisionSuggestions: string[];
    overallAssessment: string;
  };
  error?: string;
}

export interface FinancialAidSummaryRequest {
  documentType: 'fafsa' | 'award-letter' | 'scholarship';
  content: string;
}

export interface FinancialAidSummaryResponse {
  success: boolean;
  summary?: {
    keyPoints: string[];
    importantDeadlines: string[];
    actionItems: string[];
    financialBreakdown?: {
      totalAid?: number;
      grants?: number;
      loans?: number;
      workStudy?: number;
    };
  };
  error?: string;
}

export interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
  };
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}