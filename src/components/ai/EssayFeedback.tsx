'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface FeedbackCategory {
  score: number;
  comments: string;
}

interface EssayFeedbackData {
  narrativeClarity: FeedbackCategory;
  promptAlignment: FeedbackCategory;
  specificityVsGenerality: FeedbackCategory;
  revisionSuggestions: string[];
  overallAssessment: string;
}

interface EssayFeedbackProps {
  feedback: EssayFeedbackData;
  showTitle?: boolean;
}

export function EssayFeedback({ feedback, showTitle = true }: EssayFeedbackProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Strong';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Needs Work';
    return 'Significant Revision Needed';
  };

  return (
    <Card>
      {showTitle && (
        <CardHeader>
          <CardTitle>AI Feedback</CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-6">
        {/* Narrative Clarity */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="font-medium text-gray-900">Narrative Clarity</span>
              <span className="text-sm text-gray-500 ml-2">
                ({getScoreLabel(feedback.narrativeClarity.score)})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-8 rounded-sm ${
                      i < feedback.narrativeClarity.score
                        ? 'bg-primary-600'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className={`text-lg font-bold ${getScoreColor(feedback.narrativeClarity.score)}`}>
                {feedback.narrativeClarity.score}/10
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            {feedback.narrativeClarity.comments}
          </p>
        </div>

        {/* Prompt Alignment */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="font-medium text-gray-900">Prompt Alignment</span>
              <span className="text-sm text-gray-500 ml-2">
                ({getScoreLabel(feedback.promptAlignment.score)})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-8 rounded-sm ${
                      i < feedback.promptAlignment.score
                        ? 'bg-primary-600'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className={`text-lg font-bold ${getScoreColor(feedback.promptAlignment.score)}`}>
                {feedback.promptAlignment.score}/10
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            {feedback.promptAlignment.comments}
          </p>
        </div>

        {/* Specificity */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="font-medium text-gray-900">Specificity vs Generality</span>
              <span className="text-sm text-gray-500 ml-2">
                ({getScoreLabel(feedback.specificityVsGenerality.score)})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-8 rounded-sm ${
                      i < feedback.specificityVsGenerality.score
                        ? 'bg-primary-600'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className={`text-lg font-bold ${getScoreColor(feedback.specificityVsGenerality.score)}`}>
                {feedback.specificityVsGenerality.score}/10
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            {feedback.specificityVsGenerality.comments}
          </p>
        </div>

        {/* Revision Suggestions */}
        <div className="pt-4 border-t">
          <h4 className="font-medium text-gray-900 mb-3">Revision Suggestions</h4>
          <ul className="space-y-2">
            {feedback.revisionSuggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-700">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Overall Assessment */}
        <div className="pt-4 border-t bg-primary-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Overall Assessment</h4>
          <p className="text-sm text-gray-700">{feedback.overallAssessment}</p>
        </div>

        {/* Average Score */}
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">Overall Score</span>
            <span className="text-2xl font-bold text-primary-600">
              {((feedback.narrativeClarity.score +
                feedback.promptAlignment.score +
                feedback.specificityVsGenerality.score) /
                3).toFixed(1)}
              /10
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}