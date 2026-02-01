'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { studentTimeline } from '@/lib/constants/timelineData';

export default function StudentTimelinePage() {
  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Timeline</h1>
      <p className="text-gray-600 mb-8">
        A comprehensive guide to help you navigate the college application process from freshman to senior year.
      </p>

      <div className="space-y-6">
        {studentTimeline.map((event, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 font-bold">{index + 1}</span>
                </div>
                <div>
                  <div className="text-sm text-gray-600">{event.grade}</div>
                  <CardTitle>
                    {event.season}: {event.title}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{event.description}</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Key Tasks:</h4>
                <ul className="space-y-2">
                  {event.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="flex items-start gap-2">
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
                      <span className="text-gray-700">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardContent className="text-center py-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Remember: This is a General Guide
          </h3>
          <p className="text-blue-800">
            Every student's journey is unique. Use this timeline as a reference, but don't hesitate to
            adjust based on your specific goals, circumstances, and the requirements of schools you're
            interested in.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}