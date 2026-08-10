import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const post = await Post.findById(params.id);
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    const updatedPost = await Post.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!updatedPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const deletedPost = await Post.findByIdAndDelete(params.id);
    
    if (!deletedPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
