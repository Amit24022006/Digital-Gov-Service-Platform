import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Full name is required.'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters.'],
    maxlength: [100, 'Name cannot exceed 100 characters.']
  },
  email: {
    type: String,
    required: [true, 'Email address is required.'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address.']
  },
  phone: {
    type: String,
    default: '',
    trim: true
  },
  password_hash: {
    type: String,
    required: [true, 'Password is required.']
  },
  state: {
    type: String,
    default: 'All India',
    trim: true
  },
  city: {
    type: String,
    default: '',
    trim: true
  },
  role: {
    type: String,
    enum: {
      values: ['citizen', 'admin', 'superadmin'],
      message: 'Role must be one of: citizen, admin, superadmin.'
    },
    default: 'citizen'
  },
  preferences: [{ type: String }],
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

userSchema.index({ role: 1 });
userSchema.index({ created_at: -1 });
userSchema.index({ phone: 1 });

export const User = mongoose.model('User', userSchema);
