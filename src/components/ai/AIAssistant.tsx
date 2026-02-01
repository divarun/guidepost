'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface AIAssistantProps {
  type: 'essay-feedback' | 'financial-aid-summary';
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export function AIAssistant({ type, onSubmit, isLoading = false }: AIAssistantProps) {
  const [input, setInput] = useState('');

  const handleSubmit = async () => {
    if (!input.trim()) return;
    await onSubmit({ content: input });
  };

  const placeholders = {
    'essay-feedback': 'Paste your essay here to receive AI-powered feedback...',
    'financial-aid-summary': 'Paste your FAFSA, award letter, or scholarship document here...',
  };

  const titles = {
    'essay-feedback': 'AI Essay Feedback',
    'financial-aid-summary': 'AI Document Summary',
  };

  const descriptions = {
    'essay-feedback': 'Get structured feedback on narrative clarity, prompt alignment, and specificity.',
    'financial-aid-summary': 'Extract key points, deadlines, and action items from financial aid documents.',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{titles[type]}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{descriptions[type]}</p>

        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          placeholder={placeholders[type]}
          className="font-mono text-sm"
        />

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {input.trim().split(/\s+/).filter(Boolean).length} words
          </div>
          <Button onClick={handleSubmit} isLoading={isLoading} disabled={!input.trim()}>
            Get AI Analysis
          </Button>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm text-blue-900">
              <strong>Privacy Note:</strong> All AI processing happens locally on your device via
              Ollama. Your data never leaves your computer.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}