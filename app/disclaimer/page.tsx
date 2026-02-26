import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description:
    'Disclaimer menit.live — batasan tanggung jawab dan informasi penting mengenai konten yang disajikan di situs kami.',
  alternates: {
    canonical: 'https://menit.live/disclaimer',
  },
};

export default function DisclaimerPage() {
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
          <span className="text-gray-600">Disclaimer</span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:p-10">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Disclaimer
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Terakhir diperbarui: 1 Januari 2026
          </p>

          <div className="prose prose-gray mt-8 max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-a:text-[var(--color-primary)]">
            <h2>1. Informasi Umum</h2>
            <p>
              Seluruh informasi yang disajikan di situs{' '}
              <strong>menit.live</strong> disediakan &quot;sebagaimana adanya&quot;
              untuk tujuan informatif dan edukasi. Kami berusaha menyajikan
              informasi yang akurat dan terkini, namun kami tidak memberikan
              jaminan atau garansi, baik tersurat maupun tersirat, mengenai
              kelengkapan, keakuratan, keandalan, atau ketersediaan informasi
              tersebut.
            </p>

            <h2>2. Bukan Nasihat Profesional</h2>
            <p>
              Konten yang dipublikasikan di situs ini tidak dimaksudkan sebagai
              nasihat profesional, termasuk namun tidak terbatas pada nasihat
              hukum, keuangan, investasi, atau medis. Untuk keputusan penting,
              silakan konsultasikan dengan profesional yang berkompeten di
              bidangnya.
            </p>

            <h2>3. Konten Berita</h2>
            <p>
              Berita dan artikel yang dipublikasikan di menit.live bersumber
              dari berbagai sumber terpercaya. Meskipun kami berupaya
              memverifikasi setiap informasi, kami tidak dapat menjamin 100%
              keakuratan setiap berita. Pembaca disarankan untuk melakukan
              verifikasi mandiri terhadap informasi penting.
            </p>

            <h2>4. Gambar dan Media</h2>
            <p>
              Gambar yang digunakan di situs ini bersumber dari layanan stok
              foto berlisensi (termasuk Unsplash) dan digunakan sesuai dengan
              ketentuan lisensi masing-masing. Jika Anda menemukan gambar yang
              melanggar hak cipta, silakan hubungi kami untuk segera ditindak.
            </p>

            <h2>5. Iklan dan Konten Pihak Ketiga</h2>
            <p>
              Situs ini menampilkan iklan dari Google AdSense dan mungkin
              menyertakan konten dari pihak ketiga. Kami tidak bertanggung jawab
              atas:
            </p>
            <ul>
              <li>Konten atau keakuratan iklan yang ditampilkan</li>
              <li>Produk atau layanan yang diiklankan</li>
              <li>
                Kerugian yang timbul dari interaksi dengan pengiklan pihak
                ketiga
              </li>
              <li>
                Praktik privasi dari situs web pihak ketiga yang ditautkan
              </li>
            </ul>

            <h2>6. Tautan Eksternal</h2>
            <p>
              Situs ini mungkin berisi tautan ke situs web eksternal. Tautan
              ini disediakan untuk kenyamanan pembaca dan kami tidak memiliki
              kendali atas konten atau kebijakan situs-situs tersebut.
              Mengikuti tautan eksternal adalah risiko Anda sendiri.
            </p>

            <h2>7. Ketersediaan Situs</h2>
            <p>
              Kami berupaya menjaga agar situs selalu dapat diakses. Namun,
              kami tidak menjamin bahwa situs akan selalu tersedia, bebas dari
              gangguan, atau bebas dari kesalahan teknis. Kami berhak
              menangguhkan atau menghentikan layanan tanpa pemberitahuan
              sebelumnya.
            </p>

            <h2>8. Batasan Tanggung Jawab</h2>
            <p>
              Dalam hal apa pun, menit.live, pemilik, penulis, dan
              kontributornya tidak bertanggung jawab atas kerugian langsung,
              tidak langsung, insidental, atau konsekuensial yang timbul dari
              penggunaan atau ketidakmampuan menggunakan situs ini atau
              informasi yang terkandung di dalamnya.
            </p>

            <h2>9. Perubahan Disclaimer</h2>
            <p>
              Kami berhak memperbarui Disclaimer ini kapan saja. Perubahan
              akan berlaku segera setelah dipublikasikan di halaman ini.
            </p>

            <h2>10. Hubungi Kami</h2>
            <p>
              Jika Anda memiliki pertanyaan tentang Disclaimer ini, silakan
              hubungi kami melalui halaman{' '}
              <Link href="/contact">Kontak</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
