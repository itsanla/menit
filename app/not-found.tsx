import Link from 'next/link';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 px-6 py-24">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50">
          <FileQuestion className="h-10 w-10 text-[var(--color-primary)]" />
        </div>

        <h1 className="text-6xl font-extrabold tracking-tight text-gray-900">404</h1>
        <p className="mt-3 text-lg text-gray-600">
          Halaman yang kamu cari tidak ditemukan.
        </p>
        <p className="mt-1 text-sm text-gray-400">
          Mungkin sudah dipindahkan atau dihapus.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
