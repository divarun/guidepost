import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast'; //

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Guidepost - College Application Platform',
  description: 'Navigate your college application journey with confidence',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
