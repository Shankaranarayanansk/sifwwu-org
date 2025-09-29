import mongoose, { Schema, Document } from 'mongoose';

export interface IUpdate extends Document {
  title: string;
  content: string;
  type: 'news' | 'job' | 'announcement';
  isActive: boolean;
  isFeatured: boolean;
  publishDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UpdateSchema = new Schema<IUpdate>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['news', 'job', 'announcement'],
    default: 'news',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Update || mongoose.model<IUpdate>('Update', UpdateSchema);