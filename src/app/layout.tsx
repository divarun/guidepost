import type { Metadata } from 'next';
import { DM_Serif_Display, Space_Grotesk, Space_Mono } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Guidepost — College Application Platform',
  description: 'Navigate your college application journey with confidence. AI-powered by NVIDIA NIM.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
    >
      <body className="font-sans antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
