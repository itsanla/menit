'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { List } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const article = document.querySelector('article');
    if (!article) return;

    const elements = article.querySelectorAll('h2, h3');
    const items: TocItem[] = Array.from(elements).map((el) => {
      // Ensure IDs exist
      if (!el.id) {
        el.id = el.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') ?? '';
      }
      return {
        id: el.id,
        text: el.textContent ?? '',
        level: el.tagName === 'H2' ? 2 : 3,
      };
    });
    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center gap-2 text-sm font-bold text-gray-900"
      >
        <List className="h-4 w-4" />
        Daftar Isi
        <span className="ml-auto text-xs text-gray-400">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>
      {isOpen && (
        <ul className="mt-3 space-y-1.5">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={cn(heading.level === 3 && 'ml-4')}
            >
              <a
                href={`#${heading.id}`}
                onClick={() => setActiveId(heading.id)}
                className={cn(
                  'block rounded-md px-2 py-1 text-sm transition-colors',
                  activeId === heading.id
                    ? 'bg-red-50 font-medium text-[var(--color-primary)]'
                    : 'text-gray-500 hover:text-gray-900'
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
