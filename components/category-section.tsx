import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PostCard } from '@/components/post-card';
import type { Post } from '@/lib/posts';

interface CategorySectionProps {
  title: string;
  tag: string;
  posts: Post[];
}

export function CategorySection({ title, tag, posts }: CategorySectionProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-5 flex items-end justify-between border-b-2 border-[var(--color-primary)] pb-2">
        <h2 className="text-lg font-extrabold uppercase tracking-tight text-gray-900">
          {title}
        </h2>
        <Link
          href={`/blog?tag=${encodeURIComponent(tag)}`}
          className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] hover:underline"
        >
          Lihat Semua
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
