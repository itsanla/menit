'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowDownAZ,
  ArrowUpAZ,
  Clock,
  X,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SerializedPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  image?: string;
  readingTime: number;
}

type SortField = 'date' | 'title';
type SortOrder = 'asc' | 'desc';

interface BlogFilterProps {
  posts: SerializedPost[];
  allTags: string[];
}

export function BlogFilter({ posts, allTags }: BlogFilterProps) {
  const [query, setQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...posts];

    // Search
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Tag filter
    if (selectedTag) {
      result = result.filter((p) => p.tags.includes(selectedTag));
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') {
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        cmp = a.title.localeCompare(b.title, 'id');
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [posts, query, sortField, sortOrder, selectedTag]);

  const activeFilterCount =
    (query ? 1 : 0) + (selectedTag ? 1 : 0) + (sortField !== 'date' || sortOrder !== 'desc' ? 1 : 0);

  const clearAll = () => {
    setQuery('');
    setSelectedTag('');
    setSortField('date');
    setSortOrder('desc');
  };

  return (
    <div>
      {/* Search + Toggle Filter Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari berita..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all',
            showFilters || activeFilterCount > 0
              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filter &amp; Urutkan</span>
          <span className="sm:hidden">Filter</span>
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Expanded Filter Controls */}
      {showFilters && (
        <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Sort by */}
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Urutkan berdasarkan
              </label>
              <div className="relative">
                <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as SortField)}
                  className="w-full appearance-none rounded-md border border-gray-200 bg-white py-2 pl-9 pr-8 text-sm text-gray-700 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                >
                  <option value="date">Tanggal</option>
                  <option value="title">Nama / Judul</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Sort order */}
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Urutan
              </label>
              <div className="flex rounded-md border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setSortOrder('desc')}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-1.5 py-2 text-sm font-medium transition-colors',
                    sortOrder === 'desc'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {sortField === 'date' ? (
                    <Clock className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownAZ className="h-3.5 w-3.5" />
                  )}
                  {sortField === 'date' ? 'Terbaru' : 'Z → A'}
                </button>
                <button
                  onClick={() => setSortOrder('asc')}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-1.5 border-l border-gray-200 py-2 text-sm font-medium transition-colors',
                    sortOrder === 'asc'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {sortField === 'date' ? (
                    <Clock className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowUpAZ className="h-3.5 w-3.5" />
                  )}
                  {sortField === 'date' ? 'Terlama' : 'A → Z'}
                </button>
              </div>
            </div>

            {/* Tag filter */}
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Kategori / Tag
              </label>
              <div className="relative">
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full appearance-none rounded-md border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
                >
                  <option value="">Semua Kategori</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Active filters / Reset */}
          {activeFilterCount > 0 && (
            <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
              <span className="text-xs text-gray-400">Filter aktif:</span>
              {query && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                  &ldquo;{query}&rdquo;
                  <button onClick={() => setQuery('')} className="hover:text-[var(--color-primary)]">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedTag && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-primary)]/10 px-2.5 py-0.5 text-xs text-[var(--color-primary)]">
                  {selectedTag}
                  <button onClick={() => setSelectedTag('')} className="hover:text-[var(--color-primary)]">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearAll}
                className="ml-auto text-xs font-medium text-[var(--color-primary)] hover:underline"
              >
                Reset semua
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="mt-4 mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Menampilkan <span className="font-semibold text-gray-700">{filtered.length}</span> dari{' '}
          <span className="font-semibold text-gray-700">{posts.length}</span> berita
        </p>
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((post, i) => (
            <PostCardClient key={post.slug} post={post} featured={i === 0 && !query && !selectedTag} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
          <Search className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-gray-500">
            Tidak ada berita yang cocok dengan pencarian Anda.
          </p>
          <button
            onClick={clearAll}
            className="mt-3 text-sm font-medium text-[var(--color-primary)] hover:underline"
          >
            Reset filter
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- Inline Post Card (client-side, no server Post type) ---------- */

function PostCardClient({
  post,
  featured = false,
}: {
  post: SerializedPost;
  featured?: boolean;
}) {
  if (featured && post.image) {
    return (
      <Link href={`/blog/${post.slug}`} className="group block sm:col-span-2">
        <article className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md">
          <div className="relative aspect-[2/1] w-full overflow-hidden bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
              <div className="mb-2 flex flex-wrap gap-2">
                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-[var(--color-primary)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-xl font-bold leading-tight text-white sm:text-2xl lg:text-3xl">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-gray-200 sm:text-base">
                {post.description}
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs text-gray-300">
                <span>
                  {format(new Date(post.date), 'd MMM yyyy', { locale: idLocale })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readingTime} min
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Standard horizontal card
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="flex gap-4 overflow-hidden rounded-lg bg-white p-4 ring-1 ring-gray-200 transition-all hover:shadow-md hover:ring-gray-300">
        {post.image && (
          <div className="hidden sm:block flex-shrink-0 w-32 h-24 overflow-hidden rounded-md bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col justify-between min-w-0">
          <div>
            <div className="mb-1.5 flex flex-wrap gap-1.5">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-sm font-bold leading-snug text-gray-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">
              {post.description}
            </p>
          </div>
          <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-400">
            <span>{format(new Date(post.date), 'd MMM yyyy', { locale: idLocale })}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readingTime} min
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
