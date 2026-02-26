import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, Mail, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kontak',
  description:
    'Hubungi tim redaksi menit.live — kirim pertanyaan, saran, atau kolaborasi melalui halaman kontak kami.',
  alternates: {
    canonical: 'https://menit.live/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3 text-xs text-gray-400 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors"
          >
            <Home className="h-3 w-3" />
            Beranda
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-600">Kontak</span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:p-10">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Hubungi Kami
          </h1>
          <p className="mt-3 text-base leading-relaxed text-gray-500">
            Kami senang mendengar dari Anda. Silakan hubungi kami untuk
            pertanyaan, saran, kritik, atau peluang kerja sama.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {/* Email Card */}
            <div className="rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
                  <Mail className="h-5 w-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Email</h3>
                  <a
                    href="mailto:me@anla.my.id"
                    className="text-sm text-[var(--color-primary)] hover:underline"
                  >
                    me@anla.my.id
                  </a>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
                  <MapPin className="h-5 w-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Lokasi</h3>
                  <p className="text-sm text-gray-500">Indonesia</p>
                </div>
              </div>
            </div>
          </div>

          <div className="prose prose-gray mt-8 max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-a:text-[var(--color-primary)]">
            <h2>Informasi Kontak</h2>
            <p>
              Untuk keperluan bisnis, kolaborasi konten, atau pertanyaan
              editorial, Anda dapat menghubungi kami melalui:
            </p>
            <ul>
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:me@anla.my.id">me@anla.my.id</a>
              </li>
              <li>
                <strong>GitHub:</strong>{' '}
                <a
                  href="https://github.com/itsanla"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/itsanla
                </a>
              </li>
              <li>
                <strong>LinkedIn:</strong>{' '}
                <a
                  href="https://www.linkedin.com/in/anlaharpanda"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  linkedin.com/in/anlaharpanda
                </a>
              </li>
              <li>
                <strong>Website Pribadi:</strong>{' '}
                <a
                  href="https://anla.my.id"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  anla.my.id
                </a>
              </li>
            </ul>

            <h2>Waktu Respons</h2>
            <p>
              Kami berusaha merespons setiap pesan dalam waktu 1-3 hari kerja.
              Untuk pertanyaan mendesak, silakan kirim email dengan subjek
              yang jelas agar kami dapat memprioritaskan pesan Anda.
            </p>

            <h2>Kerja Sama</h2>
            <p>
              Kami terbuka untuk berbagai bentuk kerja sama, termasuk:
            </p>
            <ul>
              <li>Kontribusi artikel (guest post)</li>
              <li>Kolaborasi konten teknologi</li>
              <li>Partnership media</li>
              <li>Review produk dan layanan teknologi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
