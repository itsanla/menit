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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/favicon.ico', sizes: '180x180', type: 'image/x-icon' },
    ],
  },
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
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.ico" sizes="16x16" />
        <link rel="apple-touch-icon" href="/favicon.ico" sizes="180x180" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4348406121095343"
          crossOrigin="anonymous"
        ></script>
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
