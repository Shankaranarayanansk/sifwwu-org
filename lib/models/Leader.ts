import mongoose, { Schema, Document } from 'mongoose';

export interface ILeader extends Document {
  name: string;
  position: string;
  bio?: string;
  image?: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const LeaderSchema = new Schema<ILeader>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Leader || mongoose.model<ILeader>('Leader', LeaderSchema);