import Link from 'next/link';

export function Header() {
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      {/* Top bar */}
      <div className="bg-[var(--color-primary)] text-white">
        <div className="mx-auto flex h-8 max-w-5xl items-center justify-between px-4 sm:px-6 text-xs">
          <span>{today}</span>
          <span className="hidden sm:inline">Portal Berita & Teknologi</span>
        </div>
      </div>
      {/* Main nav */}
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-1.5"
        >
          <span className="text-2xl font-extrabold tracking-tighter text-[var(--color-primary)]">menit</span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-gray-600">.live</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="px-3 py-2 text-sm font-semibold text-gray-700 hover:text-[var(--color-primary)]"
          >
            Beranda
          </Link>
          <Link
            href="/blog"
            className="px-3 py-2 text-sm font-semibold text-gray-700 hover:text-[var(--color-primary)]"
          >
            Semua Berita
          </Link>
        </div>
      </nav>
    </header>
  );
}
