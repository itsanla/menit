import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { PostCard } from '@/components/post-card';
import { HeroSlider } from '@/components/hero-slider';
import { WebSiteSchema } from '@/components/json-ld';
import { ArrowRight } from 'lucide-react';

function getImageOrigin(url: string): string | null {
  try {
    const u = new URL(url);
    return u.origin;
  } catch {
    return null;
  }
}

export default function HomePage() {
  const posts = getAllPosts();
  const sliderPosts = posts.slice(0, 3);
  const gridPosts = posts.slice(3);

  // Serialize slider data for client component
  const sliderData = sliderPosts.map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    description: p.frontmatter.description,
    date: p.frontmatter.date,
    image: p.frontmatter.image,
    tags: p.frontmatter.tags,
    readingTime: p.readingTime,
  }));

  // Dynamic preconnect + preload for the LCP image (first post)
  const lcpImage = sliderData[0]?.image;
  const lcpOrigin = lcpImage ? getImageOrigin(lcpImage) : null;

  return (
    <>
      {/* Dynamic preconnect & preload for LCP image — links are hoisted to <head> by Next.js */}
      {lcpOrigin && <link rel="preconnect" href={lcpOrigin} />}
      {lcpOrigin && <link rel="dns-prefetch" href={lcpOrigin} />}
      {lcpImage && <link rel="preload" href={lcpImage} as="image" />}

      <WebSiteSchema
        name="menit — Portal Berita & Teknologi"
        url="https://menit.live"
        description="Portal berita teknologi, web development, Next.js, Cloudflare, dan inovasi digital terkini."
      />

      <div className="bg-gray-50 min-h-screen">
      {/* Hero Slider — 3 berita terbaru */}
      {sliderPosts.length > 0 && (
        <section>
          <HeroSlider posts={sliderData}>
            {/* Server-rendered first slide for instant LCP */}
            {sliderData[0]?.image && (
              <div className="opacity-100 relative transition-opacity duration-700 ease-in-out">
                <Link href={`/blog/${sliderData[0].slug}`} className="group block">
                  <div className="relative aspect-[21/9] sm:aspect-[2.5/1] w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sliderData[0].image}
                      alt={sliderData[0].title}
                      width={1200}
                      height={514}
                      fetchPriority="high"
                      loading="eager"
                      decoding="sync"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 lg:p-12">
                      <div className="mx-auto max-w-5xl">
                        <div className="mb-2 flex flex-wrap gap-2">
                          {sliderData[0].tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="rounded bg-[var(--color-primary)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h2 className="text-xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl max-w-3xl">
                          {sliderData[0].title}
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm text-gray-300 line-clamp-2 sm:text-base">
                          {sliderData[0].description}
                        </p>
                        <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                          <span>{new Date(sliderData[0].date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                            {sliderData[0].readingTime} min
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </HeroSlider>
        </section>
      )}

      {/* Berita Terkini Grid — post ke-4 dst */}
      {gridPosts.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <div className="mb-5 flex items-end justify-between border-b-2 border-[var(--color-primary)] pb-2">
            <h2 className="text-lg font-extrabold uppercase tracking-tight text-gray-900">
              Berita Terkini
            </h2>
            <Link
              href="/blog"
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] hover:underline"
            >
              Lihat Semua
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {gridPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {posts.length === 0 && (
        <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
          <p className="text-gray-500">
            Belum ada berita. Tambahkan file{' '}
            <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm">.mdx</code>{' '}
            di folder{' '}
            <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm">/blog</code>{' '}
            untuk mulai menulis.
          </p>
        </section>
      )}
    </div>
    </>
  );
}
