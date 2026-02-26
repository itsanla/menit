import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Syarat dan Ketentuan',
  description:
    'Syarat dan Ketentuan penggunaan situs menit.live — aturan dan ketentuan yang mengatur penggunaan layanan kami.',
  alternates: {
    canonical: 'https://menit.live/terms',
  },
};

export default function TermsPage() {
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
          <span className="text-gray-600">Syarat dan Ketentuan</span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:p-10">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Syarat dan Ketentuan
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Terakhir diperbarui: 1 Januari 2026
          </p>

          <div className="prose prose-gray mt-8 max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-a:text-[var(--color-primary)]">
            <h2>1. Penerimaan Syarat</h2>
            <p>
              Dengan mengakses dan menggunakan situs{' '}
              <strong>menit.live</strong> (&quot;Situs&quot;), Anda menyetujui
              untuk terikat dengan Syarat dan Ketentuan ini. Jika Anda tidak
              menyetujui syarat-syarat ini, harap tidak menggunakan situs ini.
            </p>

            <h2>2. Deskripsi Layanan</h2>
            <p>
              menit.live adalah portal berita dan teknologi yang menyediakan
              artikel, berita, dan konten informatif seputar teknologi, web
              development, dan inovasi digital. Layanan kami disediakan secara
              gratis dan didukung oleh iklan.
            </p>

            <h2>3. Konten Situs</h2>
            <p>
              Semua konten yang dipublikasikan di situs ini, termasuk teks,
              gambar, grafik, dan multimedia, dilindungi oleh hak cipta dan
              undang-undang kekayaan intelektual yang berlaku.
            </p>
            <ul>
              <li>
                Konten hanya boleh digunakan untuk keperluan pribadi dan
                non-komersial.
              </li>
              <li>
                Dilarang menyalin, mereproduksi, atau mendistribusikan konten
                tanpa izin tertulis dari kami.
              </li>
              <li>
                Anda diizinkan membagikan tautan ke artikel kami di media sosial
                atau situs lain dengan menyertakan atribusi yang sesuai.
              </li>
            </ul>

            <h2>4. Iklan dan Sponsor</h2>
            <p>
              Situs ini menampilkan iklan dari pihak ketiga, termasuk Google
              AdSense. Kami tidak bertanggung jawab atas konten iklan yang
              ditampilkan. Interaksi Anda dengan pengiklan atau pembelian yang
              dilakukan melalui iklan sepenuhnya menjadi tanggung jawab Anda.
            </p>

            <h2>5. Tautan Eksternal</h2>
            <p>
              Situs ini mungkin berisi tautan ke situs web pihak ketiga. Kami
              tidak mengontrol atau bertanggung jawab atas konten, kebijakan
              privasi, atau praktik situs web pihak ketiga tersebut.
            </p>

            <h2>6. Komentar dan Interaksi Pengguna</h2>
            <p>
              Jika fitur komentar atau interaksi tersedia, Anda bertanggung
              jawab penuh atas konten yang Anda posting. Dilarang memposting
              konten yang:
            </p>
            <ul>
              <li>Mengandung ujaran kebencian, SARA, atau diskriminasi</li>
              <li>Bersifat spam atau promosi yang tidak relevan</li>
              <li>Melanggar hak cipta atau hak kekayaan intelektual</li>
              <li>Mengandung informasi palsu atau menyesatkan</li>
              <li>Bersifat vulgar, mengancam, atau melanggar hukum</li>
            </ul>

            <h2>7. Batasan Tanggung Jawab</h2>
            <p>
              Informasi yang disediakan di situs ini bersifat umum dan untuk
              tujuan informatif saja. Kami tidak menjamin keakuratan,
              kelengkapan, atau kesesuaian informasi untuk tujuan tertentu. Kami
              tidak bertanggung jawab atas:
            </p>
            <ul>
              <li>
                Kerugian yang timbul dari penggunaan informasi di situs ini
              </li>
              <li>Gangguan layanan atau kesalahan teknis</li>
              <li>Kerusakan perangkat akibat virus atau malware</li>
            </ul>

            <h2>8. Perubahan Syarat</h2>
            <p>
              Kami berhak mengubah Syarat dan Ketentuan ini kapan saja tanpa
              pemberitahuan sebelumnya. Perubahan akan berlaku segera setelah
              diposting di halaman ini. Penggunaan situs secara berkelanjutan
              setelah perubahan berarti Anda menyetujui syarat yang diperbarui.
            </p>

            <h2>9. Hukum yang Berlaku</h2>
            <p>
              Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai
              dengan hukum Republik Indonesia. Setiap sengketa yang timbul
              akan diselesaikan melalui musyawarah atau melalui pengadilan yang
              berwenang di Indonesia.
            </p>

            <h2>10. Hubungi Kami</h2>
            <p>
              Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini,
              silakan hubungi kami melalui halaman{' '}
              <Link href="/contact">Kontak</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
