import fs from 'fs/promises';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// Read data once for both generating params and rendering
async function getPosts() {
  const filePath = path.join(process.cwd(), 'app', 'data', 'blog.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
}

// 1. generateStaticParams: SSG at build time
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}

// 2. revalidate: Enable ISR
export const revalidate = 10;

// Page component
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const posts = await getPosts();
  const post = posts.find((p: any) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/blog" className="text-blue-600 hover:underline mb-8 inline-block">
        &larr; Back to Blog
      </Link>
      
      <article className="prose lg:prose-xl">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{post.title}</h1>
        <p className="text-gray-500 mb-8">Published on: {post.date}</p>
        
        <div className="text-gray-800 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
      </article>
      
      <div className="mt-12 p-4 bg-gray-50 border-l-4 border-gray-300 text-sm text-gray-700">
        <p><strong>Note for verification:</strong> This page was rendered at {new Date().toISOString()}</p>
      </div>
    </div>
  );
}
