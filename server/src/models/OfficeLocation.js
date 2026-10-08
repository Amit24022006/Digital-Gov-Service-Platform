import mongoose from 'mongoose';

const officeLocationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Office ID is required.'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Office name is required.'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Office type is required.'],
    trim: true
    // e.g. 'RTO', 'CSC', 'Aadhaar Centre', 'District Collector Office', etc.
  },
  address: {
    type: String,
    required: [true, 'Office address is required.'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required.'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required.'],
    trim: true
  },
  pincode: {
    type: String,
    required: [true, 'Pincode is required.'],
    trim: true,
    match: [/^\d{6}$/, 'Pincode must be exactly 6 digits.']
  },
  lat: {
    type: Number,
    required: [true, 'Latitude is required.'],
    min: [6, 'Latitude out of India range.'],
    max: [38, 'Latitude out of India range.']
  },
  lng: {
    type: Number,
    required: [true, 'Longitude is required.'],
    min: [68, 'Longitude out of India range.'],
    max: [98, 'Longitude out of India range.']
  },
  phone: { type: String, default: '', trim: true },
  email: { type: String, default: '', trim: true },
  contact_hours: {
    type: String,
    default: 'Mon – Fri: 09:30 AM – 05:30 PM',
    trim: true
  },
  services_handled: [{ type: String, trim: true }],
  is_active: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Geo-index for location-based queries, composite indexes for filter lookups
officeLocationSchema.index({ city: 1, state: 1 });
officeLocationSchema.index({ state: 1 });
officeLocationSchema.index({ type: 1 });
officeLocationSchema.index({ lat: 1, lng: 1 });

export const OfficeLocation = mongoose.model('OfficeLocation', officeLocationSchema);
