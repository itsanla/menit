import Link from 'next/link';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import type { Post } from '@/lib/posts';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  const image = post.frontmatter.image;

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} className="group block sm:col-span-2">
        <article className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md">
          {/* Large hero image */}
          {image && (
            <div className="relative aspect-[2/1] w-full overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={post.frontmatter.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                {/* Tags */}
                <div className="mb-2 flex flex-wrap gap-2">
                  {post.frontmatter.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-[var(--color-primary)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold leading-tight text-white sm:text-2xl lg:text-3xl">
                  {post.frontmatter.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-gray-200 sm:text-base">
                  {post.frontmatter.description}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs text-gray-300">
                  <span>
                    {format(new Date(post.frontmatter.date), 'd MMM yyyy', {
                      locale: id,
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readingTime} min
                  </span>
                </div>
              </div>
            </div>
          )}
          {/* Fallback if no image for featured */}
          {!image && (
            <div className="p-5 sm:p-8">
              <div className="mb-2 flex flex-wrap gap-2">
                {post.frontmatter.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-[var(--color-primary)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-xl font-bold leading-tight text-gray-900 group-hover:text-[var(--color-primary)] transition-colors sm:text-2xl">
                {post.frontmatter.title}
              </h3>
              <p className="mt-2 text-gray-600">{post.frontmatter.description}</p>
            </div>
          )}
        </article>
      </Link>
    );
  }

  // Standard card with side image
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article
        className={cn(
          'flex gap-4 overflow-hidden rounded-lg bg-white p-4',
          'ring-1 ring-gray-200 transition-all',
          'hover:shadow-md hover:ring-gray-300'
        )}
      >
        {/* Thumbnail */}
        {image && (
          <div className="hidden sm:block flex-shrink-0 w-32 h-24 overflow-hidden rounded-md bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={post.frontmatter.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col justify-between min-w-0">
          {/* Tag */}
          <div>
            <div className="mb-1.5 flex flex-wrap gap-1.5">
              {post.frontmatter.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="font-bold leading-snug text-gray-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
              {post.frontmatter.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2 hidden sm:block">
              {post.frontmatter.description}
            </p>
          </div>

          {/* Meta */}
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
            <span>
              {format(new Date(post.frontmatter.date), 'd MMM yyyy', {
                locale: id,
              })}
            </span>
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
