import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description:
    'Kebijakan Privasi menit.live — informasi tentang bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.',
  alternates: {
    canonical: 'https://menit.live/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
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
          <span className="text-gray-600">Kebijakan Privasi</span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:p-10">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Kebijakan Privasi
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Terakhir diperbarui: 1 Januari 2026
          </p>

          <div className="prose prose-gray mt-8 max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-a:text-[var(--color-primary)]">
            <h2>1. Pendahuluan</h2>
            <p>
              Selamat datang di <strong>menit.live</strong> (&quot;Situs&quot;).
              Kami menghargai privasi Anda dan berkomitmen untuk melindungi data
              pribadi yang Anda berikan kepada kami. Kebijakan Privasi ini
              menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan,
              dan melindungi informasi Anda saat mengunjungi situs kami.
            </p>

            <h2>2. Informasi yang Kami Kumpulkan</h2>
            <p>Kami dapat mengumpulkan informasi berikut:</p>
            <ul>
              <li>
                <strong>Informasi yang diberikan secara sukarela:</strong> nama,
                alamat email, dan pesan yang Anda kirimkan melalui formulir
                kontak.
              </li>
              <li>
                <strong>Data penggunaan otomatis:</strong> alamat IP, jenis
                browser, halaman yang dikunjungi, waktu akses, dan informasi
                perangkat.
              </li>
              <li>
                <strong>Cookies dan teknologi pelacakan:</strong> kami
                menggunakan cookies untuk meningkatkan pengalaman pengguna dan
                menganalisis lalu lintas situs.
              </li>
            </ul>

            <h2>3. Google AdSense dan Iklan Pihak Ketiga</h2>
            <p>
              Situs ini menggunakan <strong>Google AdSense</strong> untuk
              menampilkan iklan. Google AdSense menggunakan cookies, termasuk
              cookie DART, untuk menayangkan iklan berdasarkan kunjungan
              pengguna ke situs ini dan situs lainnya di internet.
            </p>
            <p>
              Penggunaan cookie DART oleh Google memungkinkan Google dan
              mitranya menayangkan iklan kepada pengguna berdasarkan kunjungan
              mereka ke situs Anda dan/atau situs lain di internet. Pengguna
              dapat memilih untuk tidak menggunakan cookie DART dengan mengunjungi{' '}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
              >
                halaman kebijakan iklan Google
              </a>
              .
            </p>
            <p>Vendor iklan pihak ketiga, termasuk Google, menggunakan cookies untuk menayangkan iklan berdasarkan kunjungan pengguna sebelumnya ke situs web Anda atau situs web lain. Anda dapat memilih untuk tidak ikut personalisasi iklan dengan mengunjungi{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pengaturan Iklan Google
              </a>
              .
            </p>

            <h2>4. Google Analytics</h2>
            <p>
              Kami menggunakan Google Analytics untuk menganalisis penggunaan
              situs. Google Analytics menggunakan cookies untuk mengumpulkan
              informasi tentang bagaimana pengunjung menggunakan situs kami. Data
              ini dikumpulkan secara anonim dan digunakan untuk memperbaiki
              layanan kami.
            </p>

            <h2>5. Penggunaan Informasi</h2>
            <p>Informasi yang kami kumpulkan digunakan untuk:</p>
            <ul>
              <li>Menyediakan dan memelihara layanan situs</li>
              <li>Meningkatkan pengalaman pengguna</li>
              <li>Menganalisis tren penggunaan situs</li>
              <li>Menampilkan iklan yang relevan melalui Google AdSense</li>
              <li>Merespons pertanyaan dan pesan dari pengguna</li>
            </ul>

            <h2>6. Perlindungan Data</h2>
            <p>
              Kami menerapkan langkah-langkah keamanan yang wajar untuk
              melindungi informasi pribadi Anda dari akses yang tidak sah,
              penggunaan, atau pengungkapan. Namun, tidak ada metode transmisi
              melalui internet yang 100% aman.
            </p>

            <h2>7. Hak Pengguna</h2>
            <p>Anda memiliki hak untuk:</p>
            <ul>
              <li>Mengakses data pribadi Anda yang kami simpan</li>
              <li>Meminta koreksi data yang tidak akurat</li>
              <li>Meminta penghapusan data pribadi Anda</li>
              <li>Menolak penggunaan cookies dengan mengatur browser Anda</li>
              <li>
                Memilih keluar dari personalisasi iklan Google melalui{' '}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pengaturan Iklan
                </a>
              </li>
            </ul>

            <h2>8. Cookies</h2>
            <p>
              Cookies adalah file kecil yang disimpan di perangkat Anda saat
              mengunjungi situs web. Kami menggunakan cookies untuk:
            </p>
            <ul>
              <li>Mengingat preferensi pengguna</li>
              <li>Menganalisis lalu lintas situs melalui Google Analytics</li>
              <li>
                Menampilkan iklan yang dipersonalisasi melalui Google AdSense
              </li>
            </ul>
            <p>
              Anda dapat mengontrol dan menghapus cookies melalui pengaturan
              browser Anda. Namun, menonaktifkan cookies dapat memengaruhi
              fungsionalitas situs.
            </p>

            <h2>9. Tautan ke Situs Lain</h2>
            <p>
              Situs kami mungkin berisi tautan ke situs web pihak ketiga. Kami
              tidak bertanggung jawab atas praktik privasi atau konten situs
              tersebut. Kami menyarankan Anda untuk membaca kebijakan privasi
              setiap situs yang Anda kunjungi.
            </p>

            <h2>10. Perubahan Kebijakan</h2>
            <p>
              Kami berhak memperbarui Kebijakan Privasi ini kapan saja.
              Perubahan akan diposting di halaman ini dengan tanggal pembaruan
              terbaru. Kami menyarankan Anda untuk meninjau halaman ini secara
              berkala.
            </p>

            <h2>11. Hubungi Kami</h2>
            <p>
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini,
              silakan hubungi kami melalui halaman{' '}
              <Link href="/contact">Kontak</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
