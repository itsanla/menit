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
          <BlogFilter posts={serialized} allTags={allTags} />
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
