import Link from 'next/link';

// Force dynamic rendering (SSR) on every request
export const dynamic = 'force-dynamic';

export default function LatestActivity() {
  const timestamp = new Date().toISOString();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/blog" className="text-blue-600 hover:underline mb-8 inline-block">
        &larr; Back to Blog
      </Link>
      
      <h1 className="text-4xl font-bold mb-4 text-gray-900">Latest Activity (SSR)</h1>
      <p className="text-gray-600 mb-8">
        This page is rendered dynamically on the server for <strong>every single request</strong> (Server-Side Rendering).
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Live Timestamp</h2>
        <p className="text-gray-800 font-mono text-lg">{timestamp}</p>
        <p className="text-sm text-gray-500 mt-4">
          Refresh the page. You will see this timestamp update immediately every time you refresh. 
          Compare this to the ISR blog posts which only update every 10 seconds.
        </p>
      </div>
    </div>
  );
}
