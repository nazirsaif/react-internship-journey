import Link from 'next/link';
import fs from 'fs/promises';
import path from 'path';

export default async function BlogIndex() {
  const filePath = path.join(process.cwd(), 'app', 'data', 'blog.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const posts = JSON.parse(fileContents);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Blog</h1>
      <p className="text-gray-600 mb-8">
        This page lists our latest articles. Click on a post to see its content, which is generated using SSG or ISR.
      </p>
      
      <div className="space-y-6">
        {posts.map((post: any) => (
          <div key={post.slug} className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">
              <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="text-sm text-gray-500 mb-4">{post.date}</p>
            <p className="text-gray-700">{post.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
