import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://menit.live'),
  title: {
    default: 'menit — Portal Berita & Teknologi',
    template: '%s — menit',
  },
  description:
    'Portal berita teknologi, web development, Next.js, Cloudflare, dan inovasi digital terkini.',
  openGraph: {
    title: 'menit — Portal Berita & Teknologi',
    description:
      'Portal berita teknologi, web development, Next.js, Cloudflare, dan inovasi digital terkini.',
    url: 'https://menit.live',
    siteName: 'menit',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: 'https://menit.live/logo.webp',
        width: 512,
        height: 512,
        alt: 'menit — Portal Berita & Teknologi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'menit — Portal Berita & Teknologi',
    description:
      'Portal berita teknologi, web development, Next.js, Cloudflare, dan inovasi digital terkini.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://menit.live',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        {/* Preconnect/preload hints are set per-page dynamically */}

        {/*
          Google AdSense — UNCOMMENT the Script below AFTER your AdSense account is approved.
          Replace ca-pub-XXXXXXXXXXXXXXXX with your actual publisher ID.

          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        */}
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-white`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
