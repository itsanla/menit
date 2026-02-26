import { MDXRemote } from 'next-mdx-remote/rsc';
import type { MDXRemoteProps } from 'next-mdx-remote/rsc';

const components: MDXRemoteProps['components'] = {
  h2: (props) => {
    const id =
      typeof props.children === 'string'
        ? props.children
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        : '';
    return <h2 id={id} {...props} />;
  },
  h3: (props) => {
    const id =
      typeof props.children === 'string'
        ? props.children
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        : '';
    return <h3 id={id} {...props} />;
  },
  a: (props) => (
    <a {...props} target="_blank" rel="noopener noreferrer" />
  ),
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      className="rounded-lg border border-gray-200"
      loading="lazy"
      alt={props.alt ?? ''}
    />
  ),
};

interface MDXContentProps {
  source: string;
}

export function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="prose prose-gray max-w-none prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[var(--color-accent)] prose-a:underline-offset-2 hover:prose-a:text-[var(--color-accent-hover)] prose-img:rounded-lg">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
