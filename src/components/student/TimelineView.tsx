'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { studentTimeline } from '@/constants/timelineData';

interface TimelineViewProps {
  highlightGrade?: string;
  compact?: boolean;
}

export function TimelineView({ highlightGrade, compact = false }: TimelineViewProps) {
  return (
    <div className={clsx('space-y-6', compact && 'space-y-4')}>
      {studentTimeline.map((event, index) => {
        const isHighlighted = highlightGrade && event.grade === highlightGrade;

        return (
          <Card
            key={index}
            className={clsx(
              'transition-all',
              isHighlighted && 'ring-2 ring-primary-500 shadow-lg'
            )}
          >
            <CardContent className={clsx('py-6', compact && 'py-4')}>
              <div className="flex gap-4">
                {/* Timeline Indicator */}
                <div className="flex flex-col items-center">
                  <div
                    className={clsx(
                      'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
                      isHighlighted
                        ? 'bg-primary-600 text-white'
                        : 'bg-primary-100 text-primary-600'
                    )}
                  >
                    <span className="font-bold">{index + 1}</span>
                  </div>
                  {index < studentTimeline.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  {/* Header */}
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 font-medium">{event.grade}</div>
                    <h3
                      className={clsx(
                        'text-lg font-semibold',
                        isHighlighted ? 'text-primary-700' : 'text-gray-900'
                      )}
                    >
                      {event.season}: {event.title}
                    </h3>
                    <p className="text-sm text-gray-700 mt-1">{event.description}</p>
                  </div>

                  {/* Tasks */}
                  {!compact && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3 text-sm">Key Tasks:</h4>
                      <ul className="space-y-2">
                        {event.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="flex items-start gap-2">
                            <svg
                              className={clsx(
                                'w-5 h-5 flex-shrink-0 mt-0.5',
                                isHighlighted ? 'text-primary-600' : 'text-gray-400'
                              )}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-sm text-gray-700">{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Helper function for clsx if not imported
function clsx(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}