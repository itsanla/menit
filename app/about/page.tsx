import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description:
    'Tentang menit.live — portal berita teknologi dan inovasi digital terkini yang dikelola oleh Anla Harpanda, Full Stack Web Developer & UI/UX Designer.',
  alternates: {
    canonical: 'https://menit.live/about',
  },
};

export default function AboutPage() {
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
          <span className="text-gray-600">Tentang Kami</span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:p-10">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Tentang Kami
          </h1>

          <div className="prose prose-gray mt-8 max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-a:text-[var(--color-primary)]">
            <h2>Apa itu menit.live?</h2>
            <p>
              <strong>menit.live</strong> adalah portal berita dan teknologi yang
              menyajikan informasi terkini seputar dunia teknologi, web
              development, inovasi digital, dan berita nasional maupun
              internasional. Kami berkomitmen menyajikan berita yang akurat,
              terpercaya, dan mudah dipahami.
            </p>

            <h2>Visi Kami</h2>
            <p>
              Menjadi sumber informasi teknologi dan berita terdepan di
              Indonesia yang menyajikan konten berkualitas tinggi, informatif,
              dan dapat diakses oleh semua kalangan.
            </p>

            <h2>Misi Kami</h2>
            <ul>
              <li>
                Menyajikan berita teknologi dan digital terkini dengan akurat
                dan berimbang
              </li>
              <li>
                Memberikan panduan dan tutorial berkualitas tentang web
                development dan teknologi modern
              </li>
              <li>
                Menjadi jembatan informasi antara perkembangan teknologi global
                dan pembaca Indonesia
              </li>
              <li>
                Mengutamakan integritas jurnalistik dalam setiap konten yang
                dipublikasikan
              </li>
            </ul>

            <h2>Tim Redaksi</h2>
            <div className="not-prose mt-4 rounded-lg border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-primary)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://anla.my.id/pfp.webp"
                    alt="Anla Harpanda"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Anla Harpanda</h3>
                  <p className="text-sm text-[var(--color-primary)] font-medium">
                    Pendiri &amp; Penulis Utama
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    Full Stack Web Developer &amp; UI/UX Designer. Berpengalaman
                    dalam Express.js, Next.js, Laravel, Vue.js, dan React.
                    Mahasiswa Teknologi Informasi di Politeknik Negeri Padang.
                    Peraih Juara 1 Nasional KMIPN VII 2025 dan AWS Certified
                    Developer.
                  </p>
                  <div className="mt-3 flex gap-4">
                    <a
                      href="https://github.com/itsanla"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-500 hover:text-[var(--color-primary)]"
                    >
                      GitHub
                    </a>
                    <a
                      href="https://www.linkedin.com/in/anlaharpanda"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-500 hover:text-[var(--color-primary)]"
                    >
                      LinkedIn
                    </a>
                    <a
                      href="https://anla.my.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-500 hover:text-[var(--color-primary)]"
                    >
                      Website
                    </a>
                    <a
                      href="mailto:me@anla.my.id"
                      className="text-sm text-gray-500 hover:text-[var(--color-primary)]"
                    >
                      Email
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <h2>Pedoman Editorial</h2>
            <p>
              Setiap artikel yang dipublikasikan di menit.live melalui proses
              editorial yang ketat:
            </p>
            <ul>
              <li>
                <strong>Verifikasi Fakta:</strong> Setiap informasi diverifikasi
                dari minimal dua sumber terpercaya sebelum dipublikasikan.
              </li>
              <li>
                <strong>Transparansi:</strong> Kami selalu menyebutkan sumber
                informasi dan memberikan atribusi yang layak.
              </li>
              <li>
                <strong>Keberimbangan:</strong> Kami berupaya menyajikan
                berbagai perspektif dalam setiap topik yang dibahas.
              </li>
              <li>
                <strong>Koreksi:</strong> Jika terdapat kesalahan, kami akan
                segera melakukan koreksi dan memberitahu pembaca.
              </li>
            </ul>

            <h2>Hubungi Kami</h2>
            <p>
              Punya pertanyaan, saran, atau ingin berkolaborasi? Silakan
              hubungi kami melalui halaman{' '}
              <Link href="/contact">Kontak</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
