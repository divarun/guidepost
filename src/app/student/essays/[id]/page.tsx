'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Loading } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import { calculateWordCount, formatShortDate } from '@/lib/utils/formatters';

export default function EssayEditorPage() {
  const router = useRouter();
  const params = useParams();
  const essayId = params.id as string;
  const { showToast } = useToast();

  const [essay, setEssay] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gettingFeedback, setGettingFeedback] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    prompt: '',
    content: '',
    status: 'DRAFT',
    schoolName: '',
    dueDate: '',
  });

  useEffect(() => {
    loadEssay();
  }, [essayId]);

  const loadEssay = async () => {
    try {
      const response = await fetch('/api/students/essays');
      const data = await response.json();

      if (data.success) {
        const foundEssay = data.data.find((e: any) => e.id === essayId);
        if (foundEssay) {
          setEssay(foundEssay);
          setFormData({
            title: foundEssay.title,
            prompt: foundEssay.prompt,
            content: foundEssay.content,
            status: foundEssay.status,
            schoolName: foundEssay.schoolName || '',
            dueDate: foundEssay.dueDate
              ? new Date(foundEssay.dueDate).toISOString().split('T')[0]
              : '',
          });

          // Load existing feedback if available
          if (foundEssay.feedback && foundEssay.feedback.length > 0) {
            const latestFeedback = foundEssay.feedback[0];
            if (latestFeedback.isAI) {
              try {
                setFeedback(JSON.parse(latestFeedback.feedback));
              } catch (e) {
                console.error('Failed to parse feedback:', e);
              }
            }
          }
        } else {
          showToast('Essay not found', 'error');
          router.push('/student/essays');
        }
      }
    } catch (error) {
      showToast('Failed to load essay', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/students/essays', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: essayId, ...formData }),
      });

      const data = await response.json();

      if (data.success) {
        showToast('Essay saved successfully', 'success');
        setEssay(data.data);
      } else {
        showToast(data.error || 'Failed to save essay', 'error');
      }
    } catch (error) {
      showToast('An error occurred', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleGetFeedback = async () => {
    if (!formData.content || formData.content.trim().length < 50) {
      showToast('Please write at least 50 characters before requesting feedback', 'warning');
      return;
    }

    setGettingFeedback(true);
    try {
      const response = await fetch('/api/ai/essay-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          essayId,
          content: formData.content,
          prompt: formData.prompt,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFeedback(data.feedback);
        showToast('Feedback generated successfully', 'success');
      } else {
        showToast(data.error || 'Failed to generate feedback', 'error');
      }
    } catch (error) {
      showToast('An error occurred while getting feedback', 'error');
    } finally {
      setGettingFeedback(false);
    }
  };

  const wordCount = calculateWordCount(formData.content);

  const statusOptions = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'IN_REVIEW', label: 'In Review' },
    { value: 'REVISED', label: 'Revised' },
    { value: 'FINAL', label: 'Final' },
  ];

  if (loading) {
    return <Loading />;
  }

  if (!essay) {
    return <div className="p-8">Essay not found</div>;
  }

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <button
            onClick={() => router.push('/student/essays')}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 mb-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Essays
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{formData.title}</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} isLoading={saving}>
            Save
          </Button>
          <Button onClick={handleGetFeedback} variant="secondary" isLoading={gettingFeedback}>
            Get AI Feedback
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Editor - Left Side (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Essay Details */}
          <Card>
            <CardHeader>
              <CardTitle>Essay Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Common App Essay - Personal Growth"
              />

              <Textarea
                label="Prompt"
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                rows={3}
                placeholder="Essay prompt..."
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="School"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  placeholder="Stanford University"
                />

                <Input
                  label="Due Date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>

              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={statusOptions}
              />
            </CardContent>
          </Card>

          {/* Essay Content */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Essay Content</CardTitle>
                <div className="text-sm text-gray-600">
                  {wordCount} words
                  {wordCount > 650 && (
                    <span className="text-red-600 ml-2">(exceeds 650 word limit)</span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={20}
                placeholder="Start writing your essay here..."
                className="font-serif text-base leading-relaxed"
                showCharCount={false}
              />
            </CardContent>
          </Card>

          {/* Version History */}
          {essay.versions && essay.versions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Version History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {essay.versions.map((version: any, index: number) => (
                    <div
                      key={version.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-900">Version {version.version}</div>
                        <div className="text-sm text-gray-600">
                          {version.wordCount} words • {formatShortDate(version.createdAt)}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setFormData({ ...formData, content: version.content });
                          showToast(`Restored version ${version.version}`, 'success');
                        }}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Feedback - Right Side (1 column) */}
        <div className="space-y-6">
          {/* AI Feedback */}
          {feedback ? (
            <Card>
              <CardHeader>
                <CardTitle>AI Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Narrative Clarity */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">Narrative Clarity</span>
                    <span className="text-lg font-bold text-primary-600">
                      {feedback.narrativeClarity.score}/10
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{feedback.narrativeClarity.comments}</p>
                </div>

                {/* Prompt Alignment */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">Prompt Alignment</span>
                    <span className="text-lg font-bold text-primary-600">
                      {feedback.promptAlignment.score}/10
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{feedback.promptAlignment.comments}</p>
                </div>

                {/* Specificity */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">Specificity</span>
                    <span className="text-lg font-bold text-primary-600">
                      {feedback.specificityVsGenerality.score}/10
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {feedback.specificityVsGenerality.comments}
                  </p>
                </div>

                {/* Revision Suggestions */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Revision Suggestions</h4>
                  <ul className="space-y-2">
                    {feedback.revisionSuggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
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
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Overall Assessment */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-2">Overall Assessment</h4>
                  <p className="text-sm text-gray-700">{feedback.overallAssessment}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="text-center py-8">
                <svg
                  className="w-12 h-12 text-blue-600 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <h3 className="font-semibold text-blue-900 mb-2">Get AI Feedback</h3>
                <p className="text-sm text-blue-800 mb-4">
                  Write at least 50 characters and click "Get AI Feedback" to receive structured
                  feedback on your essay.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Writing Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Writing Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">•</span>
                  <span>Be specific with examples and details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">•</span>
                  <span>Show, don't just tell your story</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">•</span>
                  <span>Focus on personal growth and insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">•</span>
                  <span>Keep your authentic voice</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">•</span>
                  <span>Proofread carefully before submitting</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}