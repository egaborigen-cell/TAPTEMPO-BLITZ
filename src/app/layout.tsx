import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'TapTempo Blitz | Rhythm Mastery',
  description: 'A hypercasual rhythm game where speed meets precision.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <Script 
          src="https://yandex.ru/games/sdk/v2" 
          strategy="beforeInteractive"
        />
      </head>
      <body className="font-body antialiased selection:bg-primary/30">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
