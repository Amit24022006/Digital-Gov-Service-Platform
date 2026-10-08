import { Service } from '../models/Service.js';
import { Category } from '../models/Category.js';
import { SavedService, Feedback } from '../models/Others.js';

// ─── Keyword synonym dictionary for robust search ──────────────────────────────
const KEYWORD_SYNONYMS = {
  'driving': ['driving', 'license', 'licence', 'dl', 'parivahan', 'sarathi', 'rto'],
  'license': ['driving license', 'driving licence', 'dl', 'sarathi', 'rto', 'parivahan'],
  'licence': ['driving license', 'driving licence', 'dl', 'sarathi', 'rto'],
  'dl': ['driving license', 'driving licence', 'sarathi', 'rto', 'license'],
  'kisan': ['pm kisan', 'farmer', 'krishi', 'kheti', 'agriculture', 'fasal', 'kcc', 'samman nidhi'],
  'farmer': ['pm kisan', 'agriculture', 'fasal bima', 'kcc', 'krishi', 'kisan'],
  'agriculture': ['pm kisan', 'farmer', 'fasal bima', 'kcc', 'kisan'],
  'ration': ['ration card', 'rashan', 'nfsa', 'onorc', 'food grain', 'pds'],
  'rashan': ['ration card', 'ration', 'nfsa', 'food grain', 'pds'],
  'ayushman': ['ayushman bharat', 'pmjay', 'golden card', 'hospital', 'cashless', 'health card'],
  'pmjay': ['ayushman bharat', 'health card', 'cashless hospital'],
  'scholarship': ['national scholarship portal', 'nsp', 'student', 'matric', 'education', 'chhatravrti'],
  'student': ['scholarship', 'nsp', 'education loan', 'vidyalakshmi', 'pragati', 'chhatravrti'],
  'mudra': ['mudra loan', 'pmmy', 'business loan', 'shishu', 'kishore', 'tarun', 'udyami'],
  'business': ['mudra', 'udyam', 'msme', 'pmegp', 'startup', 'loan'],
  'aadhaar': ['aadhaar', 'uidai', 'myaadhaar', 'pvc card', 'identity', 'adhar'],
  'aadhar': ['aadhaar', 'uidai', 'identity', 'adhar'],
  'adhar': ['aadhaar', 'uidai', 'identity'],
  'pan': ['pan card', 'tax', 'nsdl', 'income tax', 'permanent account number'],
  'pension': ['old age pension', 'widow pension', 'nsap', 'senior citizen', 'vridha', 'maandhan'],
  'housing': ['pmay', 'awas', 'pucca house', 'makan', 'grih'],
  'awas': ['pmay', 'housing', 'pucca house', 'grih'],
  'passport': ['passport seva', 'psk', 'tatkaal', 'travel', 'visa'],
  'police': ['police clearance', 'pcc', 'fir', 'complaint', 'verification'],
  'water': ['jal jeevan', 'tap connection', 'drinking water', 'har ghar jal'],
  'electricity': ['solar', 'pm surya ghar', 'bijli', 'connection', 'power'],
  'msme': ['udyam', 'msme', 'mudra', 'business', 'small enterprise'],
  'udyam': ['msme', 'udyam registration', 'small business', 'medium enterprise'],
  'voter': ['voter id', 'election card', 'epic', 'eci'],
  'caste': ['caste certificate', 'sc', 'st', 'obc', 'community certificate'],
  'income': ['income certificate', 'income proof', 'ews'],
};

// ─── Get All Categories with Service Counts ────────────────────────────────────
export const getCategories = async (req, res) => {
  try {
    const [categories, serviceCounts] = await Promise.all([
      Category.find().sort({ sort_order: 1, name: 1 }),
      Service.aggregate([
        { $group: { _id: '$category_id', count: { $sum: 1 } } }
      ])
    ]);

    const countMap = {};
    serviceCounts.forEach(item => { countMap[item._id] = item.count; });

    const enriched = categories.map(cat => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      name_hi: cat.name_hi,
      icon: cat.icon,
      description: cat.description,
      description_hi: cat.description_hi,
      color: cat.color,
      services_count: countMap[cat.id] || 0
    }));

    return res.json({ success: true, categories: enriched });
  } catch (err) {
    console.error('getCategories error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
};


// ─── Get Services (with search, filter, pagination) ───────────────────────────
export const getServices = async (req, res) => {
  try {
    const {
      search,
      category,
      state,
      scheme_type,
      mode,
      popular,
      recommended,
      page = 1,
      limit = 50,
      sort = 'default'
    } = req.query;

    let query = {};

    // Filter: Category
    if (category && category !== 'all') {
      query.category_id = category;
    }

    // Filter: State (always include "All India" services)
    if (state && state !== 'all' && state !== 'All India') {
      query.$or = [
        { state: 'All India' },
        { state: 'All States' },
        { state: new RegExp(`^${state.trim()}$`, 'i') }
      ];
    }

    // Filter: Scheme Type
    if (scheme_type && scheme_type !== 'all') {
      query.scheme_type = new RegExp(`^${scheme_type.trim()}$`, 'i');
    }

    // Filter: Mode
    if (mode && mode !== 'all') {
      query.mode = new RegExp(`^${mode.trim()}$`, 'i');
    }

    // Filter: Popular Only
    if (popular === 'true') {
      query.is_popular = true;
    }

    let services;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // ── Advanced keyword search with relevance scoring ──────────────────────
    if (search && search.trim()) {
      const rawSearch = search.trim().toLowerCase();
      const tokens = rawSearch.split(/\s+/).filter(Boolean);

      // Expand with synonyms
      const expandedTokens = new Set(tokens);
      for (const token of tokens) {
        if (KEYWORD_SYNONYMS[token]) {
          KEYWORD_SYNONYMS[token].forEach(syn => expandedTokens.add(syn.toLowerCase()));
        }
      }

      // Fetch all matching docs for scoring (no pagination at DB level since we score in JS)
      const allServices = await Service.find(query).lean();

      const scored = [];
      for (const srv of allServices) {
        let score = 0;
        const title = (srv.title || '').toLowerCase();
        const titleHi = (srv.title_hi || '').toLowerCase();
        const desc = (srv.description || '').toLowerCase();
        const dept = (srv.department || '').toLowerCase();
        const benefits = (srv.benefits || '').toLowerCase();
        const tags = (srv.tags || []).map(t => t.toLowerCase());
        const keywords = (srv.keywords || []).map(k => k.toLowerCase());

        // Exact full-phrase match (highest priority)
        if (title.includes(rawSearch)) score += 200;
        if (keywords.some(k => k === rawSearch)) score += 180;
        if (titleHi.includes(rawSearch)) score += 160;
        if (keywords.some(k => k.includes(rawSearch))) score += 140;
        if (tags.some(t => t.includes(rawSearch))) score += 120;
        if (dept.includes(rawSearch)) score += 80;
        if (benefits.includes(rawSearch)) score += 60;
        if (desc.includes(rawSearch)) score += 40;

        // Token-by-token matching
        for (const token of expandedTokens) {
          if (token.length < 2) continue;
          if (title.includes(token)) score += 50;
          if (keywords.some(k => k.includes(token))) score += 45;
          if (titleHi.includes(token)) score += 40;
          if (tags.some(t => t.includes(token))) score += 30;
          if (dept.includes(token)) score += 20;
          if (benefits.includes(token)) score += 15;
          if (desc.includes(token)) score += 8;
        }

        // Boost popular services slightly in search results
        if (srv.is_popular) score += 10;

        if (score > 0) scored.push({ srv, score });
      }

      scored.sort((a, b) => b.score - a.score);

      const allResults = scored.map(item => item.srv);
      const total = allResults.length;
      services = allResults.slice(skip, skip + limitNum);

      return res.json({
        success: true,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        services
      });
    }

    // ── Personal Recommendations (if logged in with preferences) ─────────────
    if (recommended === 'true' && req.user?.preferences?.length) {
      query.category_id = { $in: req.user.preferences };
    }

    // ── Sorting ──────────────────────────────────────────────────────────────
    let sortQuery = {};
    switch (sort) {
      case 'popular':
        sortQuery = { is_popular: -1, view_count: -1 };
        break;
      case 'title_asc':
        sortQuery = { title: 1 };
        break;
      case 'title_desc':
        sortQuery = { title: -1 };
        break;
      case 'newest':
        sortQuery = { createdAt: -1 };
        break;
      default:
        sortQuery = { is_popular: -1, title: 1 };
    }

    const total = await Service.countDocuments(query);
    services = await Service.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum)
      .lean();

    return res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      services
    });
  } catch (err) {
    console.error('getServices error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch services.' });
  }
};


// ─── Get Single Service by ID ─────────────────────────────────────────────────
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findOneAndUpdate(
      { id },
      { $inc: { view_count: 1 } }, // Increment view count
      { new: true }
    ).lean();

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    // Fetch related data in parallel
    const [category, feedbackList] = await Promise.all([
      Category.findOne({ id: service.category_id }).lean(),
      Feedback.find({ service_id: id, is_approved: true }).sort({ created_at: -1 }).limit(20).lean()
    ]);

    const avgRating = feedbackList.length
      ? (feedbackList.reduce((acc, curr) => acc + curr.rating, 0) / feedbackList.length).toFixed(1)
      : null;

    let isSaved = false;
    if (req.user) {
      const saved = await SavedService.findOne({ user_id: req.user.id, service_id: id });
      isSaved = !!saved;
    }

    // Get 3 related services from same category
    const relatedServices = await Service.find({
      category_id: service.category_id,
      id: { $ne: id }
    }).limit(3).lean();

    return res.json({
      success: true,
      service: {
        ...service,
        category,
        rating: avgRating || '4.8',
        reviews_count: feedbackList.length,
        recent_feedback: feedbackList,
        is_saved: isSaved,
        related_services: relatedServices
      }
    });
  } catch (err) {
    console.error('getServiceById error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch service details.' });
  }
};


// ─── Check Eligibility ────────────────────────────────────────────────────────
export const checkEligibility = async (req, res) => {
  try {
    const {
      service_id,
      age,
      gender,
      occupation,
      annual_income,
      state,
      owns_pucca_house
    } = req.body;

    const parsedAge = age !== undefined && age !== '' ? parseInt(age, 10) : null;
    const parsedIncome = annual_income !== undefined && annual_income !== '' ? parseFloat(annual_income) : null;

    if (parsedAge !== null && (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 120)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid age between 0 and 120.' });
    }

    // ── Single Service Eligibility ─────────────────────────────────────────
    if (service_id) {
      const service = await Service.findOne({ id: service_id }).lean();
      if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found.' });
      }

      const rules = service.eligibility_rules || {};
      const checks = [];
      let isEligible = true;

      // Age check
      if (parsedAge !== null) {
        if (rules.min_age !== undefined && parsedAge < rules.min_age) {
          isEligible = false;
          checks.push({
            param: 'Age',
            status: 'failed',
            message: `Minimum age required is ${rules.min_age} years. You entered: ${parsedAge}.`
          });
        } else if (rules.max_age !== undefined && parsedAge > rules.max_age) {
          isEligible = false;
          checks.push({
            param: 'Age',
            status: 'failed',
            message: `Maximum age allowed is ${rules.max_age} years. You entered: ${parsedAge}.`
          });
        } else {
          checks.push({
            param: 'Age',
            status: 'passed',
            message: `Age criterion satisfied (${parsedAge} years).`
          });
        }
      }

      // Income check
      if (parsedIncome !== null && rules.max_annual_income) {
        if (parsedIncome > rules.max_annual_income) {
          isEligible = false;
          checks.push({
            param: 'Annual Income',
            status: 'failed',
            message: `Annual household income must not exceed ₹${rules.max_annual_income.toLocaleString('en-IN')}. You entered: ₹${parsedIncome.toLocaleString('en-IN')}.`
          });
        } else {
          checks.push({
            param: 'Annual Income',
            status: 'passed',
            message: `Income criterion satisfied (under ₹${rules.max_annual_income.toLocaleString('en-IN')}).`
          });
        }
      }

      // Occupation check
      if (occupation && rules.occupations?.length > 0) {
        const normOcc = occupation.toLowerCase();
        const matches = rules.occupations.some(
          o => o.toLowerCase().includes(normOcc) || normOcc.includes(o.toLowerCase())
        );
        if (!matches) {
          isEligible = false;
          checks.push({
            param: 'Occupation',
            status: 'failed',
            message: `This scheme targets: ${rules.occupations.join(', ')}. Your occupation: ${occupation}.`
          });
        } else {
          checks.push({ param: 'Occupation', status: 'passed', message: 'Occupation matches scheme criteria.' });
        }
      }

      // Gender check
      if (gender && rules.gender && rules.gender !== 'any') {
        if (gender.toLowerCase() !== rules.gender.toLowerCase()) {
          isEligible = false;
          checks.push({
            param: 'Gender',
            status: 'failed',
            message: `This scheme is available for ${rules.gender} applicants only.`
          });
        } else {
          checks.push({ param: 'Gender', status: 'passed', message: 'Gender criterion satisfied.' });
        }
      }

      // PMAY-specific: no pucca house
      if (service.id === 'srv_pmay' && owns_pucca_house === true) {
        isEligible = false;
        checks.push({
          param: 'Housing',
          status: 'failed',
          message: 'Applicants owning an existing pucca house anywhere in India are not eligible for PMAY.'
        });
      }

      let alternatives = [];
      if (!isEligible) {
        alternatives = await Service.find({
          id: { $ne: service.id },
          category_id: service.category_id
        }).limit(3).lean();
        if (alternatives.length === 0) {
          alternatives = await Service.find({ id: { $ne: service.id } }).limit(3).lean();
        }
      }

      return res.json({
        success: true,
        service_id: service.id,
        service_title: service.title,
        is_eligible: isEligible,
        checks,
        alternatives: alternatives.map(a => ({
          id: a.id,
          title: a.title,
          category_id: a.category_id,
          benefits: a.benefits,
          mode: a.mode
        }))
      });
    }

    // ── Universal Eligibility Check across all services ──────────────────────
    const allServices = await Service.find().lean();

    const results = allServices.map(srv => {
      const rules = srv.eligibility_rules || {};
      let eligible = true;
      const reasons = [];

      if (parsedAge !== null) {
        if (rules.min_age !== undefined && parsedAge < rules.min_age) {
          eligible = false;
          reasons.push(`Minimum age required: ${rules.min_age} years`);
        }
        if (rules.max_age !== undefined && parsedAge > rules.max_age) {
          eligible = false;
          reasons.push(`Maximum age allowed: ${rules.max_age} years`);
        }
      }

      if (parsedIncome !== null && rules.max_annual_income) {
        if (parsedIncome > rules.max_annual_income) {
          eligible = false;
          reasons.push(`Income exceeds limit of ₹${rules.max_annual_income.toLocaleString('en-IN')}`);
        }
      }

      if (occupation && rules.occupations?.length) {
        const normOcc = occupation.toLowerCase();
        const matches = rules.occupations.some(
          o => o.toLowerCase().includes(normOcc) || normOcc.includes(o.toLowerCase())
        );
        if (!matches) {
          eligible = false;
          reasons.push(`Required occupation: ${rules.occupations.join(', ')}`);
        }
      }

      if (gender && rules.gender && rules.gender !== 'any') {
        if (gender.toLowerCase() !== rules.gender.toLowerCase()) {
          eligible = false;
          reasons.push(`Scheme for ${rules.gender} applicants only`);
        }
      }

      return {
        id: srv.id,
        title: srv.title,
        category_id: srv.category_id,
        benefits: srv.benefits,
        scheme_type: srv.scheme_type,
        mode: srv.mode,
        official_url: srv.official_url,
        is_eligible: eligible,
        reasons
      };
    });

    const eligible = results.filter(r => r.is_eligible);
    const nonEligible = results.filter(r => !r.is_eligible);

    return res.json({
      success: true,
      evaluated_count: results.length,
      eligible_count: eligible.length,
      eligible,
      non_eligible: nonEligible
    });
  } catch (err) {
    console.error('checkEligibility error:', err);
    return res.status(500).json({ success: false, message: 'Eligibility check failed.' });
  }
};


// ─── Compare Services ─────────────────────────────────────────────────────────
export const compareServices = async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) {
      return res.status(400).json({
        success: false,
        message: 'Provide comma-separated service IDs to compare (e.g. ?ids=srv_a,srv_b).'
      });
    }

    const idList = ids.split(',').map(id => id.trim()).filter(Boolean);

    if (idList.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'At least 2 service IDs are required for comparison.'
      });
    }

    if (idList.length > 5) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 5 services can be compared at once.'
      });
    }

    const services = await Service.find({ id: { $in: idList } }).lean();

    return res.json({ success: true, services });
  } catch (err) {
    console.error('compareServices error:', err);
    return res.status(500).json({ success: false, message: 'Failed to compare services.' });
  }
};


// ─── Toggle Save/Bookmark Service ────────────────────────────────────────────
export const toggleSaveService = async (req, res) => {
  try {
    const { service_id } = req.body;
    if (!service_id) {
      return res.status(400).json({ success: false, message: 'service_id is required.' });
    }

    // Verify service exists
    const service = await Service.findOne({ id: service_id }).lean();
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    const existing = await SavedService.findOne({ user_id: req.user.id, service_id });

    if (existing) {
      await SavedService.findByIdAndDelete(existing._id);
      return res.json({
        success: true,
        is_saved: false,
        message: `"${service.title}" removed from your saved services.`
      });
    }

    await SavedService.create({ user_id: req.user.id, service_id });

    return res.json({
      success: true,
      is_saved: true,
      message: `"${service.title}" bookmarked to your profile.`
    });
  } catch (err) {
    console.error('toggleSaveService error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update bookmark.' });
  }
};


// ─── Get Saved Services ───────────────────────────────────────────────────────
export const getSavedServices = async (req, res) => {
  try {
    const saved = await SavedService.find({ user_id: req.user.id })
      .sort({ created_at: -1 })
      .lean();

    if (saved.length === 0) {
      return res.json({ success: true, saved_services: [] });
    }

    const serviceIds = saved.map(s => s.service_id);
    const services = await Service.find({ id: { $in: serviceIds } }).lean();

    // Maintain bookmark order (most recently saved first)
    const serviceMap = {};
    services.forEach(s => { serviceMap[s.id] = s; });
    const orderedServices = saved
      .map(s => serviceMap[s.service_id])
      .filter(Boolean);

    return res.json({ success: true, saved_services: orderedServices });
  } catch (err) {
    console.error('getSavedServices error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch saved services.' });
  }
};
