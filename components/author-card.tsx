import Link from 'next/link';

export function AuthorCard() {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-gray-200 bg-gray-50 p-5">
      <div className="flex h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-[var(--color-primary)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://anla.my.id/pfp.webp"
          alt="Anla Harpanda"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Ditulis oleh
        </p>
        <Link
          href="/about"
          className="mt-0.5 block text-base font-bold text-gray-900 hover:text-[var(--color-primary)] transition-colors"
        >
          Anla Harpanda
        </Link>
        <p className="mt-1 text-sm leading-relaxed text-gray-500">
          Full Stack Web Developer &amp; UI/UX Designer. Berpengalaman dalam
          Next.js, Express.js, Laravel, dan React.
        </p>
      </div>
    </div>
  );
}
