import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-extrabold tracking-tighter text-white">
              menit
            </Link>
            <p className="mt-2 text-sm leading-relaxed">
              Portal berita teknologi, web development, dan inovasi digital terkini.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Navigasi</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white">Beranda</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white">Semua Berita</Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Ikuti Kami</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://github.com/itsanla" target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub</a>
              </li>
              <li>
                <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white">X / Twitter</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-6 text-center text-xs">
          <p>© {new Date().getFullYear()} menit.live — All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
