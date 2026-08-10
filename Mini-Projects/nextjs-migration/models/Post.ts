import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPost extends Document {
  blogSlug: string;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    blogSlug: { type: String, required: true, index: true },
    author: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from compiling the model multiple times in Next.js development
const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
