'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface SlidePost {
  slug: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  tags: string[];
  readingTime: number;
}

interface HeroSliderProps {
  posts: SlidePost[];
  /** Server-rendered first slide for instant LCP */
  children?: ReactNode;
}

export function HeroSlider({ posts, children }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const total = posts.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Mark hydrated so we can swap the server-rendered slide with interactive version
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Auto rotate every 6 seconds
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  if (total === 0) return null;

  return (
    <div className="relative w-full overflow-hidden bg-gray-900">
      {/* Slides */}
      <div className="relative">
        {posts.map((p, i) => {
          const isActive = i === current;

          // For the first slide before hydration, use server-rendered children for instant LCP
          if (i === 0 && !hydrated && children) {
            return (
              <div key={p.slug} className="opacity-100 relative">
                {children}
              </div>
            );
          }

          return (
            <div
              key={p.slug}
              className={`${
                isActive ? 'opacity-100 relative z-10' : 'opacity-0 absolute inset-0 pointer-events-none'
              } transition-opacity duration-700 ease-in-out`}
            >
              <Link href={`/blog/${p.slug}`} className="group block">
                <div className="relative aspect-[21/9] sm:aspect-[2.5/1] w-full overflow-hidden">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
                      alt={p.title}
                      width={1200}
                      height={514}
                      fetchPriority={i === 0 ? 'high' : 'low'}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      decoding={i === 0 ? 'sync' : 'async'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900" />
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

                  {/* Content on image */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 lg:p-12">
                    <div className="mx-auto max-w-5xl">
                      {/* Tags */}
                      <div className="mb-2 flex flex-wrap gap-2">
                        {p.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-[var(--color-primary)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl max-w-3xl">
                        {p.title}
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm text-gray-300 line-clamp-2 sm:text-base">
                        {p.description}
                      </p>
                      <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                        <span>{new Date(p.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {p.readingTime} min
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Navigation arrows */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-opacity hover:bg-black/60 cursor-pointer"
            aria-label="Slide sebelumnya"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-opacity hover:bg-black/60 cursor-pointer"
            aria-label="Slide selanjutnya"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {total > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1">
          {posts.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="flex h-7 w-7 items-center justify-center cursor-pointer"
              aria-label={`Slide ${i + 1}`}
            >
              <span
                className={`block rounded-full transition-all ${
                  i === current
                    ? 'h-2.5 w-6 bg-[var(--color-primary)]'
                    : 'h-2 w-2 bg-white/50'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
