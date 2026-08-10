import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Allow filtering by blogSlug if provided
    const searchParams = request.nextUrl.searchParams;
    const blogSlug = searchParams.get('blogSlug');
    
    const query = blogSlug ? { blogSlug } : {};
    
    const posts = await Post.find(query).sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    if (!body.blogSlug || !body.author || !body.content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const newPost = await Post.create({
      blogSlug: body.blogSlug,
      author: body.author,
      content: body.content,
    });
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
