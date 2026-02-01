import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container-custom py-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-primary-600 mb-4">Guidepost</h3>
            <p className="text-sm text-gray-600">
              Navigate your college application journey with confidence.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">For Students</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/explore/students" className="hover:text-primary-600">
                  Explore Features
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-primary-600">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">For Parents</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/explore/parents" className="hover:text-primary-600">
                  Explore Features
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-primary-600">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-primary-600">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>© {currentYear} Guidepost. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}