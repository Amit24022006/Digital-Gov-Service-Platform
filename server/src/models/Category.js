import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Category ID is required.'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Category slug is required.'],
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: [true, 'Category name is required.'],
    trim: true
  },
  name_hi: { type: String, default: '', trim: true },
  icon: { type: String, default: 'Layers' },
  description: { type: String, default: '', trim: true },
  description_hi: { type: String, default: '', trim: true },
  color: { type: String, default: 'blue' },
  sort_order: { type: Number, default: 0 }
}, {
  timestamps: true
});

categorySchema.index({ slug: 1 });

export const Category = mongoose.model('Category', categorySchema);
