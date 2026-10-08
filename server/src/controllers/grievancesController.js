import { Grievance } from '../models/Grievance.js';
import { Notification } from '../models/Others.js';

// Allowed grievance categories
const GRIEVANCE_CATEGORIES = [
  'Farmer & Agriculture',
  'Education & Student',
  'Health & Family',
  'Employment & Business',
  'Housing & Urban',
  'Identity & Certificates',
  'Transport & Vehicles',
  'Social Welfare',
  'Legal & Citizen Services',
  'Others & Utilities',
  'Technical Issue',
  'General Inquiry'
];

/**
 * Generate unique tracking number like GOV-GRV-2026-XXXX
 */
const generateTrackingNumber = () => {
  const year = new Date().getFullYear();
  const suffix = Math.floor(1000 + Math.random() * 9000);
  const alpha = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `GOV-GRV-${year}-${suffix}${alpha}`;
};


// ─── Create / Submit Grievance ─────────────────────────────────────────────────
export const createGrievance = async (req, res) => {
  try {
    const {
      category,
      service_name,
      subject,
      description,
      user_name,
      user_email,
      phone,
      priority
    } = req.body;

    // Validate required fields
    if (!category || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Category, subject, and description are required.'
      });
    }

    if (subject.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Subject must be at least 5 characters long.'
      });
    }

    if (description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Description must be at least 10 characters long.'
      });
    }

    // For anonymous submissions, email is required
    if (!req.user && !user_email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required for anonymous grievance submissions.'
      });
    }

    // Ensure tracking number is unique (retry on collision)
    let tracking_number;
    let attempts = 0;
    do {
      tracking_number = generateTrackingNumber();
      const exists = await Grievance.findOne({ tracking_number });
      if (!exists) break;
      attempts++;
    } while (attempts < 5);

    const grievanceData = {
      tracking_number,
      user_id: req.user ? req.user.id : null,
      user_name: req.user ? req.user.name : (user_name || 'Citizen'),
      user_email: req.user ? req.user.email : (user_email || ''),
      phone: phone || (req.user ? req.user.phone : ''),
      category: category.trim(),
      service_name: (service_name || 'General Service').trim(),
      subject: subject.trim(),
      description: description.trim(),
      status: 'Submitted',
      priority: priority || 'Medium',
      admin_response: 'Your grievance has been received and registered. Our nodal officer will review it shortly.'
    };

    const grievance = await Grievance.create(grievanceData);

    // Send in-app notification to the registered user
    if (req.user) {
      await Notification.create({
        user_id: req.user.id,
        type: 'grievance_update',
        title: `Grievance Submitted: ${tracking_number}`,
        title_hi: `शिकायत दर्ज: ${tracking_number}`,
        message: `Your grievance on "${subject.trim()}" has been registered with tracking number ${tracking_number}. Expected resolution: 7–14 working days.`,
        message_hi: `आपकी शिकायत "${subject.trim()}" को ट्रैकिंग नंबर ${tracking_number} के साथ दर्ज किया गया है।`,
        link: `/grievance?track=${tracking_number}`,
        read_status: false
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Grievance submitted successfully.',
      tracking_number,
      grievance
    });
  } catch (err) {
    console.error('createGrievance error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message).join(' ');
      return res.status(400).json({ success: false, message: messages });
    }
    return res.status(500).json({ success: false, message: 'Failed to submit grievance. Please try again.' });
  }
};


// ─── Get Grievances for Current User ─────────────────────────────────────────
export const getMyGrievances = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const query = { user_id: req.user.id };
    if (status && status !== 'all') {
      query.status = status;
    }

    const [total, grievances] = await Promise.all([
      Grievance.countDocuments(query),
      Grievance.find(query)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean()
    ]);

    return res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      grievances
    });
  } catch (err) {
    console.error('getMyGrievances error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch your grievances.' });
  }
};


// ─── Track Grievance by Token ─────────────────────────────────────────────────
export const trackGrievance = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token || token.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'A valid tracking token is required. Example: GOV-GRV-2026-1234AB'
      });
    }

    const grievance = await Grievance.findOne({
      tracking_number: token.trim().toUpperCase()
    }).lean();

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: `No grievance found with tracking number "${token.trim().toUpperCase()}". Please check and try again.`
      });
    }

    // Mask email for privacy (show only first char + domain)
    const maskedEmail = grievance.user_email
      ? grievance.user_email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
      : '';

    return res.json({
      success: true,
      grievance: {
        tracking_number: grievance.tracking_number,
        category: grievance.category,
        service_name: grievance.service_name,
        subject: grievance.subject,
        status: grievance.status,
        priority: grievance.priority,
        admin_response: grievance.admin_response,
        created_at: grievance.created_at,
        updated_at: grievance.updated_at,
        resolved_at: grievance.resolved_at,
        user_name: grievance.user_name,
        user_email: maskedEmail
      }
    });
  } catch (err) {
    console.error('trackGrievance error:', err);
    return res.status(500).json({ success: false, message: 'Tracking lookup failed.' });
  }
};


// ─── Get Grievance Categories (for dropdown) ──────────────────────────────────
export const getGrievanceCategories = async (req, res) => {
  return res.json({ success: true, categories: GRIEVANCE_CATEGORIES });
};
