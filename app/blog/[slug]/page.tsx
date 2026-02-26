import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import {
  Calendar,
  Clock,
  ChevronRight,
  Home,
  Newspaper,
} from 'lucide-react';
import {
  getAllPosts,
  getPostBySlug,
  getAdjacentPosts,
  getRelatedPosts,
} from '@/lib/posts';
import { MDXContent } from '@/components/mdx-content';
import { ShareButtons } from '@/components/share-buttons';
import { TableOfContents } from '@/components/table-of-contents';
import { AuthorCard } from '@/components/author-card';
import { AdSlot } from '@/components/ad-slot';
import { ArticleSchema, BreadcrumbSchema } from '@/components/json-ld';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const { title, description, image, tags } = post.frontmatter;
  const url = `https://menit.live/blog/${slug}`;

  return {
    title,
    description,
    keywords: tags,
    authors: [{ name: 'Anla Harpanda', url: 'https://menit.live/about' }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'menit',
      locale: 'id_ID',
      type: 'article',
      publishedTime: post.frontmatter.date,
      modifiedTime: post.frontmatter.date,
      authors: ['https://menit.live/about'],
      section: tags[0] || 'Teknologi',
      tags,
      ...(image && { images: [{ url: image, width: 1200, height: 630, alt: title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { prev, next } = getAdjacentPosts(slug);
  const related = getRelatedPosts(slug, 3);
  const image = post.frontmatter.image;
  const formattedDate = format(new Date(post.frontmatter.date), 'd MMMM yyyy', {
    locale: idLocale,
  });

  // Dynamic preconnect for featured image origin
  let imageOrigin: string | null = null;
  if (image) {
    try {
      imageOrigin = new URL(image).origin;
    } catch { /* ignore invalid URLs */ }
  }

  return (
    <>
      {imageOrigin && <link rel="preconnect" href={imageOrigin} />}
      {imageOrigin && <link rel="dns-prefetch" href={imageOrigin} />}

      <ArticleSchema
        title={post.frontmatter.title}
        description={post.frontmatter.description}
        url={`https://menit.live/blog/${slug}`}
        image={image}
        datePublished={post.frontmatter.date}
        tags={post.frontmatter.tags}
        readingTime={post.readingTime}
        authorName="Anla Harpanda"
        authorUrl="https://menit.live/about"
        siteName="menit"
        siteUrl="https://menit.live"
      />
      <BreadcrumbSchema
        items={[
          { name: 'Beranda', url: 'https://menit.live' },
          { name: 'Berita', url: 'https://menit.live/blog' },
          { name: post.frontmatter.title, url: `https://menit.live/blog/${slug}` },
        ]}
      />

    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3 text-xs text-gray-400 sm:px-6">
          <Link href="/" className="flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors">
            <Home className="h-3 w-3" />
            Beranda
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/blog" className="hover:text-[var(--color-primary)] transition-colors">
            Berita
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-600 truncate max-w-[200px] sm:max-w-none">
            {post.frontmatter.title}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* ====== Main Article Column ====== */}
          <article className="min-w-0">
            {/* Article Card */}
            <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
              {/* Featured Image */}
              {image && (
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={post.frontmatter.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Article Header */}
              <div className="px-5 pt-6 sm:px-8">
                {/* Category tags */}
                <div className="flex flex-wrap gap-2">
                  {post.frontmatter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-[var(--color-primary)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h1 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-3xl lg:text-[2.1rem] lg:leading-[1.2]">
                  {post.frontmatter.title}
                </h1>

                {/* Subtitle / description */}
                <p className="mt-3 text-base leading-relaxed text-gray-500 sm:text-lg">
                  {post.frontmatter.description}
                </p>

                {/* Meta bar */}
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-gray-200 pb-5">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readingTime} menit baca
                    </span>
                  </div>
                  <div className="ml-auto">
                    <ShareButtons title={post.frontmatter.title} slug={slug} />
                  </div>
                </div>
              </div>

              {/* Article Body */}
              <div className="px-5 py-6 sm:px-8 sm:py-8">
                <MDXContent source={post.content} />
              </div>

              {/* Article Footer */}
              <div className="border-t border-gray-200 px-5 py-5 sm:px-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {post.frontmatter.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <ShareButtons title={post.frontmatter.title} slug={slug} />
                </div>
              </div>
            </div>

            {/* Author Card */}
            <div className="mt-6">
              <AuthorCard />
            </div>

            {/* Ad: After Article */}
            <div className="mt-6">
              <AdSlot format="horizontal" className="overflow-hidden rounded-lg" />
            </div>

            {/* Prev / Next Navigation */}
            <nav className="mt-6 grid gap-4 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`/blog/${prev.slug}`}
                  className="group flex gap-3 rounded-lg bg-white p-4 ring-1 ring-gray-200 transition-all hover:ring-[var(--color-primary)]/30 hover:shadow-md"
                >
                  {prev.frontmatter.image && (
                    <div className="hidden sm:block h-16 w-24 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={prev.frontmatter.image}
                        alt={prev.frontmatter.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      ← Sebelumnya
                    </span>
                    <span className="mt-0.5 block text-sm font-semibold leading-snug text-gray-800 group-hover:text-[var(--color-primary)] line-clamp-2">
                      {prev.frontmatter.title}
                    </span>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {next ? (
                <Link
                  href={`/blog/${next.slug}`}
                  className="group flex gap-3 rounded-lg bg-white p-4 text-right ring-1 ring-gray-200 transition-all hover:ring-[var(--color-primary)]/30 hover:shadow-md justify-end"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Selanjutnya →
                    </span>
                    <span className="mt-0.5 block text-sm font-semibold leading-snug text-gray-800 group-hover:text-[var(--color-primary)] line-clamp-2">
                      {next.frontmatter.title}
                    </span>
                  </div>
                  {next.frontmatter.image && (
                    <div className="hidden sm:block h-16 w-24 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={next.frontmatter.image}
                        alt={next.frontmatter.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </Link>
              ) : (
                <div />
              )}
            </nav>

            {/* ====== Related Posts ====== */}
            {related.length > 0 && (
              <section className="mt-8">
                <div className="mb-4 border-b-2 border-[var(--color-primary)] pb-2">
                  <h2 className="text-base font-extrabold uppercase tracking-tight text-gray-900">
                    Berita yang Mungkin Anda Suka
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {related.map((rp) => (
                    <Link
                      key={rp.slug}
                      href={`/blog/${rp.slug}`}
                      className="group overflow-hidden rounded-lg bg-white ring-1 ring-gray-200 transition-all hover:shadow-md hover:ring-gray-300"
                    >
                      {rp.frontmatter.image && (
                        <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={rp.frontmatter.image}
                            alt={rp.frontmatter.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-3">
                        <div className="mb-1 flex gap-1.5">
                          {rp.frontmatter.tags.slice(0, 1).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-sm font-bold leading-snug text-gray-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                          {rp.frontmatter.title}
                        </h3>
                        <p className="mt-1 text-xs text-gray-400">
                          {format(
                            new Date(rp.frontmatter.date),
                            'd MMM yyyy',
                            { locale: idLocale }
                          )}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* ====== Sidebar ====== */}
          <aside className="hidden lg:block space-y-6">
            {/* TOC Sidebar */}
            <div className="sticky top-[7.5rem]">
              <TableOfContents />

              {/* Latest Posts Widget */}
              <div className="mt-6 rounded-lg bg-white p-4 ring-1 ring-gray-200">
                <h3 className="flex items-center gap-2 border-b border-gray-200 pb-3 text-xs font-extrabold uppercase tracking-wider text-gray-900">
                  <Newspaper className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                  Berita Terbaru
                </h3>
                <ul className="mt-3 space-y-3">
                  {getAllPosts()
                    .slice(0, 5)
                    .map((lp, i) => (
                      <li key={lp.slug}>
                        <Link
                          href={`/blog/${lp.slug}`}
                          className="group flex gap-3"
                        >
                          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-gray-100 text-xs font-bold text-gray-400 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                            {i + 1}
                          </span>
                          <span className="text-sm font-medium leading-snug text-gray-700 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                            {lp.frontmatter.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Ad: Sidebar */}
              <div className="mt-6">
                <AdSlot format="rectangle" fullWidth={false} className="overflow-hidden rounded-lg" />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile TOC — shown below breadcrumb on small screens */}
      <div className="lg:hidden mx-auto max-w-5xl px-4 sm:px-6 -mt-2 mb-4">
        {/* TOC already in article body via TableOfContents component for mobile */}
      </div>
    </div>
    </>
  );
}
