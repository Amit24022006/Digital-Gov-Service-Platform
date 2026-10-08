import { OfficeLocation } from '../models/OfficeLocation.js';

// ─── Get Office Locations (with search, filter, pagination) ───────────────────
export const getOffices = async (req, res) => {
  try {
    const { city, state, type, search, page = 1, limit = 50 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    let query = { is_active: true };

    // Filter by city (case-insensitive exact match)
    if (city && city !== 'all') {
      query.city = new RegExp(`^${city.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    }

    // Filter by state (case-insensitive exact match)
    if (state && state !== 'all') {
      query.state = new RegExp(`^${state.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    }

    // Filter by office type (partial match)
    if (type && type !== 'all') {
      query.type = new RegExp(type.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    }

    // Text search across name, address, services_handled
    if (search && search.trim()) {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escapedSearch, 'i');
      query.$and = [
        // Existing filters are already in query
        {
          $or: [
            { name: searchRegex },
            { address: searchRegex },
            { city: searchRegex },
            { state: searchRegex },
            { pincode: { $regex: escapedSearch } },
            { type: searchRegex },
            { services_handled: searchRegex }
          ]
        }
      ];
    }

    // Run all queries in parallel
    const [total, offices, allStates, allTypes] = await Promise.all([
      OfficeLocation.countDocuments(query),
      OfficeLocation.find(query)
        .sort({ state: 1, city: 1, name: 1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      OfficeLocation.distinct('state', { is_active: true }),
      OfficeLocation.distinct('type', { is_active: true })
    ]);

    // Fetch cities filtered by selected state
    let cityQuery = { is_active: true };
    if (state && state !== 'all') {
      cityQuery.state = new RegExp(`^${state.trim()}$`, 'i');
    }
    const availableCities = await OfficeLocation.distinct('city', cityQuery);

    return res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      available_states: allStates.sort(),
      available_cities: availableCities.sort(),
      available_types: allTypes.sort(),
      offices
    });
  } catch (err) {
    console.error('getOffices error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch office locations.' });
  }
};


// ─── Get Single Office by ID ───────────────────────────────────────────────────
export const getOfficeById = async (req, res) => {
  try {
    const { id } = req.params;
    const office = await OfficeLocation.findOne({ id, is_active: true }).lean();

    if (!office) {
      return res.status(404).json({ success: false, message: 'Office location not found.' });
    }

    // Get nearby offices in same city (same type preferred)
    const nearbyOffices = await OfficeLocation.find({
      id: { $ne: id },
      city: new RegExp(`^${office.city}$`, 'i'),
      is_active: true
    }).limit(5).lean();

    return res.json({
      success: true,
      office,
      nearby_offices: nearbyOffices
    });
  } catch (err) {
    console.error('getOfficeById error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve office details.' });
  }
};


// ─── Get Office Stats (Admin) ─────────────────────────────────────────────────
export const getOfficeStats = async (req, res) => {
  try {
    const [totalOffices, byState, byType] = await Promise.all([
      OfficeLocation.countDocuments({ is_active: true }),
      OfficeLocation.aggregate([
        { $match: { is_active: true } },
        { $group: { _id: '$state', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      OfficeLocation.aggregate([
        { $match: { is_active: true } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    return res.json({
      success: true,
      stats: {
        total: totalOffices,
        by_state: byState,
        by_type: byType
      }
    });
  } catch (err) {
    console.error('getOfficeStats error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch office statistics.' });
  }
};
