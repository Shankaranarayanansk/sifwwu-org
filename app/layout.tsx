import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'),
  title: {
    default: 'South Indian Film Workers Welfare Union | SIFWWU',
    template: '%s | SIFWWU',
  },
  description:
    'A dedicated platform for South Indian film industry professionals. Our mission is to support, protect, and uplift all those working in the film industry, from producers to technicians.',
  keywords: [
    'South Indian Film',
    'Film Workers',
    'Welfare Union',
    'Tamil Cinema',
    'Film Industry',
    'SIFWWU',
  ],
  authors: [{ name: 'SIFWWU Team' }],
  creator: 'SIFWWU',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'http://localhost:3001',
    title: 'South Indian Film Workers Welfare Union',
    description: 'Supporting South Indian film industry professionals',
    siteName: 'SIFWWU',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'South Indian Film Workers Welfare Union',
    description: 'Supporting South Indian film industry professionals',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
