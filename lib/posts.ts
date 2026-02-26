import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'blog');

export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  tags: string[];
  image?: string;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: number;
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '');
    const filePath = path.join(BLOG_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      slug,
      frontmatter: data as PostFrontmatter,
      content,
      readingTime: calculateReadingTime(content),
    };
  });

  // Sort by date descending
  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    slug,
    frontmatter: data as PostFrontmatter,
    content,
    readingTime: calculateReadingTime(content),
  };
}

export function getAdjacentPosts(
  slug: string
): { prev: Post | null; next: Post | null } {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);

  return {
    prev: index < posts.length - 1 ? posts[index + 1] : null,
    next: index > 0 ? posts[index - 1] : null,
  };
}

export function getRelatedPosts(slug: string, limit = 3): Post[] {
  const current = getPostBySlug(slug);
  if (!current) return [];

  const allPosts = getAllPosts().filter((p) => p.slug !== slug);
  const currentTags = current.frontmatter.tags;

  // Score by number of overlapping tags
  const scored = allPosts.map((post) => {
    const overlap = post.frontmatter.tags.filter((t) =>
      currentTags.includes(t)
    ).length;
    return { post, score: overlap };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.post);
}

export function getPostsByTag(tag: string, limit = 4): Post[] {
  const allPosts = getAllPosts();
  const filtered = allPosts.filter((p) =>
    p.frontmatter.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
  return filtered.slice(0, limit);
}
