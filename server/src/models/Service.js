import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String, required: true, trim: true },
  mandatory: { type: Boolean, default: true },
  sample: { type: String, default: '' }
}, { _id: false });

const stepSchema = new mongoose.Schema({
  step_no: { type: Number, required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true }
}, { _id: false });

const faqSchema = new mongoose.Schema({
  q: { type: String, required: true, trim: true },
  a: { type: String, required: true, trim: true }
}, { _id: false });

const eligibilityRulesSchema = new mongoose.Schema({
  min_age: { type: Number, default: 0, min: 0 },
  max_age: { type: Number, default: 100, max: 150 },
  occupations: [{ type: String, trim: true }],
  max_annual_income: { type: Number, default: null },
  gender: { type: String, enum: ['any', 'male', 'female'], default: 'any' },
  exclusions: [{ type: String, trim: true }]
}, { _id: false });

const serviceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Service ID is required.'],
    unique: true,
    trim: true
  },
  category_id: {
    type: String,
    required: [true, 'Category ID is required.'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Service title is required.'],
    trim: true
  },
  title_hi: { type: String, default: '', trim: true },
  department: {
    type: String,
    required: [true, 'Department name is required.'],
    trim: true
  },
  scheme_type: {
    type: String,
    enum: { values: ['Central', 'State'], message: 'Scheme type must be Central or State.' },
    default: 'Central'
  },
  mode: {
    type: String,
    enum: { values: ['Online', 'Offline', 'Hybrid'], message: 'Mode must be Online, Offline, or Hybrid.' },
    default: 'Online'
  },
  state: { type: String, default: 'All India', trim: true },
  benefits: { type: String, required: [true, 'Benefits description is required.'], trim: true },
  benefits_hi: { type: String, default: '', trim: true },
  processing_time: { type: String, default: '15 to 30 Days', trim: true },
  fee: { type: String, default: 'Free of cost', trim: true },
  official_url: {
    type: String,
    required: [true, 'Official URL is required.'],
    trim: true
  },
  is_popular: { type: Boolean, default: false },
  description: { type: String, default: '', trim: true },
  description_hi: { type: String, default: '', trim: true },
  tags: [{ type: String, trim: true, lowercase: true }],
  // Real-world keywords for robust search (e.g., ['driving license', 'dl', 'sarathi', 'rto'])
  keywords: [{ type: String, trim: true, lowercase: true }],
  eligibility_rules: { type: eligibilityRulesSchema, default: () => ({}) },
  documents: [documentSchema],
  guidance_steps: [stepSchema],
  faqs: [faqSchema],
  view_count: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Compound text index for full-text search
serviceSchema.index({
  title: 'text',
  title_hi: 'text',
  description: 'text',
  department: 'text',
  tags: 'text',
  keywords: 'text',
  benefits: 'text'
}, {
  weights: {
    title: 10,
    keywords: 8,
    tags: 6,
    department: 4,
    benefits: 3,
    description: 2,
    title_hi: 5
  },
  name: 'service_text_search'
});

serviceSchema.index({ category_id: 1 });
serviceSchema.index({ is_popular: 1 });
serviceSchema.index({ scheme_type: 1 });
serviceSchema.index({ state: 1 });
serviceSchema.index({ mode: 1 });

export const Service = mongoose.model('Service', serviceSchema);
