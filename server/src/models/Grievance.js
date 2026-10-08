import mongoose from 'mongoose';

const grievanceSchema = new mongoose.Schema({
  tracking_number: {
    type: String,
    required: [true, 'Tracking number is required.'],
    unique: true,
    uppercase: true,
    trim: true
  },
  user_id: {
    type: mongoose.Schema.Types.Mixed, // String (MongoDB ObjectId) or null for anonymous
    default: null
  },
  user_name: {
    type: String,
    required: [true, 'User name is required.'],
    trim: true
  },
  user_email: {
    type: String,
    required: [true, 'User email is required.'],
    lowercase: true,
    trim: true
  },
  phone: { type: String, default: '', trim: true },
  category: {
    type: String,
    required: [true, 'Grievance category is required.'],
    trim: true
  },
  service_name: {
    type: String,
    default: 'General Service',
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required.'],
    trim: true,
    minlength: [5, 'Subject must be at least 5 characters.'],
    maxlength: [200, 'Subject cannot exceed 200 characters.']
  },
  description: {
    type: String,
    required: [true, 'Description is required.'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters.'],
    maxlength: [2000, 'Description cannot exceed 2000 characters.']
  },
  status: {
    type: String,
    enum: {
      values: ['Submitted', 'Under Review', 'Escalated', 'Resolved', 'Closed'],
      message: 'Invalid grievance status.'
    },
    default: 'Submitted'
  },
  admin_response: { type: String, default: '', trim: true },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  resolved_at: { type: Date, default: null }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

grievanceSchema.index({ user_id: 1 });
grievanceSchema.index({ status: 1 });
grievanceSchema.index({ created_at: -1 });
grievanceSchema.index({ category: 1 });

export const Grievance = mongoose.model('Grievance', grievanceSchema);
