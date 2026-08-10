"use client";

import { useState, useEffect } from "react";

interface Comment {
  _id: string;
  blogSlug: string;
  author: string;
  content: string;
  createdAt: string;
}

export default function Comments({ blogSlug }: { blogSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [blogSlug]);

  const fetchComments = async () => {
    setIsFetching(true);
    try {
      const res = await fetch(`/api/posts?blogSlug=${blogSlug}`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong fetching comments.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !content) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blogSlug, author, content }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit comment");
      }

      const newComment = await res.json();
      setComments([newComment, ...comments]);
      setAuthor("");
      setContent("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong submitting your comment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Comment
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            required
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !author || !content}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? "Submitting..." : "Submit Comment"}
        </button>
      </form>

      <div className="space-y-6">
        {isFetching ? (
          <p className="text-gray-500">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <h3 className="font-semibold text-gray-900 mr-2">{comment.author}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-line">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
