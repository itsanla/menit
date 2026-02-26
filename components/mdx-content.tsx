import { MDXRemote } from 'next-mdx-remote/rsc';
import type { MDXRemoteProps } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';

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
  table: (props) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border-collapse border border-gray-300" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-gray-100" {...props} />,
  tbody: (props) => <tbody {...props} />,
  tr: (props) => <tr className="border-b border-gray-300" {...props} />,
  th: (props) => <th className="border border-gray-300 px-4 py-2 text-left font-semibold" {...props} />,
  td: (props) => <td className="border border-gray-300 px-4 py-2" {...props} />,
};

interface MDXContentProps {
  source: string;
}

export function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="prose prose-gray max-w-none prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[var(--color-accent)] prose-a:underline-offset-2 hover:prose-a:text-[var(--color-accent-hover)] prose-img:rounded-lg">
      <MDXRemote source={source} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
    </div>
  );
}
