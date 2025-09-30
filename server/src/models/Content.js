const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['page', 'post', 'news', 'announcement', 'service', 'leader', 'achievement'],
    index: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'pending_review'],
    default: 'draft',
    index: true
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  featuredImage: {
    type: String
  },
  gallery: [{
    url: String,
    caption: String,
    alt: String
  }],
  metadata: {
    seoTitle: String,
    seoDescription: String,
    seoKeywords: [String],
    customFields: mongoose.Schema.Types.Mixed
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publishedAt: {
    type: Date,
    index: true
  },
  scheduledAt: {
    type: Date,
    index: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  version: {
    type: Number,
    default: 1
  },
  versions: [{
    version: Number,
    content: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedAt: Date,
    changeLog: String
  }],
  workflow: {
    currentStep: {
      type: String,
      enum: ['draft', 'review', 'approved', 'published'],
      default: 'draft'
    },
    reviewers: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected']
      },
      comments: String,
      reviewedAt: Date
    }],
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date
  }
}, {
  timestamps: true
});

// Indexes
contentSchema.index({ type: 1, status: 1 });
contentSchema.index({ publishedAt: -1 });
contentSchema.index({ featured: 1, publishedAt: -1 });
contentSchema.index({ tags: 1 });
contentSchema.index({ 'workflow.currentStep': 1 });

// Text search index
contentSchema.index({
  title: 'text',
  content: 'text',
  excerpt: 'text',
  tags: 'text'
});

// Pre-save middleware to generate slug
contentSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Pre-save middleware to handle versioning
contentSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.isNew) {
    this.versions.push({
      version: this.version,
      content: this.content,
      updatedBy: this.author,
      updatedAt: new Date(),
      changeLog: 'Content updated'
    });
    this.version += 1;
  }
  next();
});

// Static method to find published content
contentSchema.statics.findPublished = function(filter = {}) {
  return this.find({
    ...filter,
    status: 'published',
    publishedAt: { $lte: new Date() }
  }).populate('author', 'firstName lastName email');
};

// Method to publish content
contentSchema.methods.publish = function(publishedBy) {
  this.status = 'published';
  this.publishedAt = new Date();
  this.workflow.currentStep = 'published';
  this.workflow.approvedBy = publishedBy;
  this.workflow.approvedAt = new Date();
  return this.save();
};

// Method to increment views
contentSchema.methods.incrementViews = function() {
  return this.updateOne({ $inc: { views: 1 } });
};

module.exports = mongoose.model('Content', contentSchema);