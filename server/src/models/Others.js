import mongoose from 'mongoose';

// ─── Notification ────────────────────────────────────────────────────────────

const notificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
    index: true
  },
  type: {
    type: String,
    enum: [
      'info',
      'success',
      'warning',
      'scheme_alert',
      'grievance_update',
      'system',
      'deadline_reminder'
    ],
    default: 'info'
  },
  title: {
    type: String,
    required: [true, 'Notification title is required.'],
    trim: true
  },
  title_hi: {
    type: String,
    default: '',
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Notification message is required.'],
    trim: true
  },
  message_hi: {
    type: String,
    default: '',
    trim: true
  },
  link: {
    type: String,
    default: ''
  },
  read_status: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

notificationSchema.index({ user_id: 1, read_status: 1 });
notificationSchema.index({ created_at: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);

// ─── Feedback ────────────────────────────────────────────────────────────────

const feedbackSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.Mixed,
    default: 'anonymous',
    index: true
  },
  user_name: {
    type: String,
    default: 'Anonymous Citizen',
    trim: true
  },
  service_id: {
    type: String,
    default: null,
    index: true
  },
  service_name: {
    type: String,
    default: 'Platform Feedback',
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required.'],
    min: [1, 'Rating must be at least 1.'],
    max: [5, 'Rating cannot exceed 5.']
  },
  comment: {
    type: String,
    default: '',
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters.']
  },
  is_approved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

feedbackSchema.index({ service_id: 1, created_at: -1 });
feedbackSchema.index({ rating: 1 });

export const Feedback = mongoose.model('Feedback', feedbackSchema);

// ─── Saved Service (bookmarks) ───────────────────────────────────────────────

const savedServiceSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    index: true
  },
  service_id: {
    type: String,
    required: true,
    index: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

savedServiceSchema.index({ user_id: 1, service_id: 1 }, { unique: true });

export const SavedService = mongoose.model('SavedService', savedServiceSchema);

// ─── Audit Log ───────────────────────────────────────────────────────────────

const auditLogSchema = new mongoose.Schema({
  admin_id: { type: String, default: '', index: true },
  admin_name: { type: String, default: 'Admin', trim: true },
  action: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true
  },
  entity: { type: String, default: '', trim: true, index: true },
  entity_id: { type: String, default: '' },
  details: { type: String, default: '', trim: true },
  ip: { type: String, default: '127.0.0.1' },
  user_agent: { type: String, default: '' }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

auditLogSchema.index({ created_at: -1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);

// ─── OTP Verification ────────────────────────────────────────────────────────

const otpVerificationSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  code: {
    type: String,
    required: true,
    trim: true
  },
  expires_at: {
    type: Date,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

otpVerificationSchema.index({ identifier: 1, verified: 1, expires_at: 1 });
otpVerificationSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

export const OtpVerification = mongoose.model('OtpVerification', otpVerificationSchema);
