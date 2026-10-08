import { Feedback } from '../models/Others.js';
import { Service } from '../models/Service.js';

// ─── Submit Feedback / Rating ──────────────────────────────────────────────────
export const submitFeedback = async (req, res) => {
  try {
    const { service_id, rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({ success: false, message: 'Rating is required.' });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a number between 1 and 5.'
      });
    }

    let serviceName = 'Platform Feedback';
    if (service_id) {
      const srv = await Service.findOne({ id: service_id }).lean();
      if (srv) {
        serviceName = srv.title;
      } else {
        return res.status(404).json({ success: false, message: 'Service not found.' });
      }
    }

    // Check for duplicate feedback from same user for same service
    if (service_id && req.user) {
      const existing = await Feedback.findOne({
        service_id,
        user_id: req.user.id,
        created_at: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // within last 24h
      });
      if (existing) {
        return res.status(429).json({
          success: false,
          message: 'You have already submitted feedback for this service in the last 24 hours.'
        });
      }
    }

    const feedback = await Feedback.create({
      user_id: req.user ? req.user.id : 'anonymous',
      user_name: req.user ? req.user.name : 'Anonymous Citizen',
      service_id: service_id || null,
      service_name: serviceName,
      rating: numRating,
      comment: (comment || '').trim(),
      is_approved: true
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for your valuable feedback!',
      feedback
    });
  } catch (err) {
    console.error('submitFeedback error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message).join(' ');
      return res.status(400).json({ success: false, message: messages });
    }
    return res.status(500).json({ success: false, message: 'Failed to submit feedback.' });
  }
};


// ─── Get Feedback for a Service ────────────────────────────────────────────────
export const getServiceFeedback = async (req, res) => {
  try {
    const { service_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const query = { service_id, is_approved: true };

    const [total, feedbackList, stats] = await Promise.all([
      Feedback.countDocuments(query),
      Feedback.find(query)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Feedback.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            avg_rating: { $avg: '$rating' },
            count: { $sum: 1 },
            rating_dist: {
              $push: '$rating'
            }
          }
        }
      ])
    ]);

    const avgRating = stats.length ? stats[0].avg_rating.toFixed(1) : null;

    // Build rating distribution (1-5 stars)
    let ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (stats.length && stats[0].rating_dist) {
      stats[0].rating_dist.forEach(r => {
        ratingDistribution[Math.round(r)] = (ratingDistribution[Math.round(r)] || 0) + 1;
      });
    }

    return res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      avg_rating: avgRating || '4.8',
      rating_distribution: ratingDistribution,
      feedback: feedbackList
    });
  } catch (err) {
    console.error('getServiceFeedback error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch feedback.' });
  }
};


// ─── Get All Platform Feedback (Admin) ────────────────────────────────────────
export const getAllFeedback = async (req, res) => {
  try {
    const { page = 1, limit = 20, min_rating, max_rating, service_id } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (service_id) query.service_id = service_id;
    if (min_rating) query.rating = { ...query.rating, $gte: parseInt(min_rating) };
    if (max_rating) query.rating = { ...query.rating, $lte: parseInt(max_rating) };

    const [total, feedbackList] = await Promise.all([
      Feedback.countDocuments(query),
      Feedback.find(query)
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
      feedback: feedbackList
    });
  } catch (err) {
    console.error('getAllFeedback error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch feedback.' });
  }
};
