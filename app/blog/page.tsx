import { Suspense } from 'react';
import { getAllPosts } from '@/lib/posts';
import { BlogFilter } from '@/components/blog-filter';
import { CollectionPageSchema } from '@/components/json-ld';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Semua Berita',
  description:
    'Semua berita dan artikel tentang web development, Next.js, Cloudflare, dan teknologi modern.',
  alternates: {
    canonical: 'https://menit.live/blog',
  },
  openGraph: {
    title: 'Semua Berita — menit',
    description:
      'Semua berita dan artikel tentang web development, Next.js, Cloudflare, dan teknologi modern.',
    url: 'https://menit.live/blog',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Semua Berita — menit',
    description:
      'Semua berita dan artikel tentang web development, Next.js, Cloudflare, dan teknologi modern.',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  // Serialize for client component
  const serialized = posts.map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    description: p.frontmatter.description,
    date: p.frontmatter.date,
    time: p.frontmatter.time,
    tags: p.frontmatter.tags,
    image: p.frontmatter.image,
    readingTime: p.readingTime,
  }));

  // Collect all unique tags, sorted
  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.frontmatter.tags))
  ).sort();

  return (
    <>
      <CollectionPageSchema
        name="Semua Berita"
        description="Semua berita dan artikel tentang web development, Next.js, Cloudflare, dan teknologi modern."
        url="https://menit.live/blog"
        siteUrl="https://menit.live"
      />
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Page Title */}
        <div className="mb-6 border-b-2 border-[var(--color-primary)] pb-2">
          <h1 className="text-lg font-extrabold uppercase tracking-tight text-gray-900">
            Semua Berita
          </h1>
        </div>

        {posts.length > 0 ? (
          <Suspense fallback={
            <div className="space-y-4">
              {/* Search + Filter Skeleton */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex-1 h-11 bg-gray-200 rounded-lg animate-pulse" />
                <div className="w-32 h-11 bg-gray-200 rounded-lg animate-pulse" />
              </div>
              
              {/* Results Count Skeleton */}
              <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
              
              {/* Posts Grid Skeleton */}
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-lg bg-white p-4 ring-1 ring-gray-200">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-20 h-16 sm:w-32 sm:h-24 rounded-md bg-gray-200" />
                      <div className="flex-1 space-y-3">
                        <div className="h-3 w-16 rounded bg-gray-200" />
                        <div className="h-4 w-full rounded bg-gray-200" />
                        <div className="h-4 w-4/5 rounded bg-gray-200" />
                        <div className="h-3 w-2/3 rounded bg-gray-200" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }>
            <BlogFilter posts={serialized} allTags={allTags} />
          </Suspense>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-gray-500">
              Belum ada berita. Tambahkan file{' '}
              <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm">.mdx</code> di folder{' '}
              <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm">/blog</code> untuk mulai.
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
