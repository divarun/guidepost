import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container-custom py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary-600">Guidepost</h1>
            <div className="flex gap-4">
              <Link href="/auth/login" className="btn-secondary">
                Log In
              </Link>
              <Link href="/auth/register" className="btn-primary">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container-custom py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Navigate Your College Journey with Confidence
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            From application essays to financial aid, Guidepost helps students and families
            stay organized, meet deadlines, and make informed decisions.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-6 justify-center mb-20">
            <Link
              href="/explore/students"
              className="px-8 py-4 bg-primary-600 text-white text-lg font-medium rounded-lg hover:bg-primary-700 shadow-lg transition-colors"
            >
              Explore for Students
            </Link>
            <Link
              href="/explore/parents"
              className="px-8 py-4 bg-secondary-600 text-white text-lg font-medium rounded-lg hover:bg-secondary-700 shadow-lg transition-colors"
            >
              Explore for Parents
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="card text-left">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Task Management</h3>
              <p className="text-gray-600">
                Keep track of essays, testing, extracurriculars, and application deadlines all in one place.
              </p>
            </div>

            <div className="card text-left">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Essay Editor with AI</h3>
              <p className="text-gray-600">
                Write, revise, and get AI-powered feedback on your college essays with version history.
              </p>
            </div>

            <div className="card text-left">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Financial Aid Planning</h3>
              <p className="text-gray-600">
                Track FAFSA, CSS Profile, scholarships, and compare college costs with budget planning tools.
              </p>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="mt-16 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>Privacy First:</strong> Our AI features run locally on your device.
              Your essays and personal information never leave your computer.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="container-custom py-8">
          <p className="text-center text-gray-600">
            © 2025 Guidepost. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}