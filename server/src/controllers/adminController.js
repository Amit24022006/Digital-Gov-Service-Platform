import { Service } from '../models/Service.js';
import { Category } from '../models/Category.js';
import { User } from '../models/User.js';
import { Grievance } from '../models/Grievance.js';
import { Notification, Feedback, AuditLog, SavedService } from '../models/Others.js';
import { OfficeLocation } from '../models/OfficeLocation.js';
import { categoriesData, servicesData, officeLocationsData } from '../seed/seedData.js';

/**
 * Helper: Create audit log entry
 */
const logAction = async (req, action, entity, entityId = '', details = '') => {
  try {
    await AuditLog.create({
      admin_id: req.user?.id || '',
      admin_name: req.user?.name || 'Admin',
      action: action.toUpperCase(),
      entity,
      entity_id: entityId,
      details,
      ip: req.ip || req.connection?.remoteAddress || '127.0.0.1',
      user_agent: req.headers['user-agent'] || ''
    });
  } catch (err) {
    console.warn('Failed to create audit log:', err.message);
  }
};


// ─── Admin Dashboard Statistics ────────────────────────────────────────────────
export const getStats = async (req, res) => {
  try {
    const [
      totalServices,
      totalCategories,
      totalUsers,
      totalOffices,
      grievanceStats,
      feedbackStats,
      recentUsers,
      grievanceByStatus
    ] = await Promise.all([
      Service.countDocuments(),
      Category.countDocuments(),
      User.countDocuments({ role: 'citizen' }),
      OfficeLocation.countDocuments({ is_active: true }),
      Grievance.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      Feedback.aggregate([
        {
          $group: {
            _id: null,
            avg_rating: { $avg: '$rating' },
            count: { $sum: 1 }
          }
        }
      ]),
      User.find({ role: 'citizen' })
        .sort({ created_at: -1 })
        .limit(5)
        .select('name email state created_at')
        .lean(),
      Grievance.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);

    // Compute grievance counts by status
    const statusMap = {};
    grievanceStats.forEach(g => { statusMap[g._id] = g.count; });
    const totalGrievances = Object.values(statusMap).reduce((a, b) => a + b, 0);
    const pendingGrievances = totalGrievances - (statusMap['Resolved'] || 0) - (statusMap['Closed'] || 0);

    const avgRating = feedbackStats.length
      ? feedbackStats[0].avg_rating.toFixed(1)
      : '4.8';
    const totalFeedback = feedbackStats.length ? feedbackStats[0].count : 0;

    return res.json({
      success: true,
      stats: {
        total_services: totalServices,
        total_categories: totalCategories,
        total_users: totalUsers,
        total_offices: totalOffices,
        total_grievances: totalGrievances,
        pending_grievances: pendingGrievances,
        resolved_grievances: statusMap['Resolved'] || 0,
        avg_rating: avgRating,
        total_feedback: totalFeedback,
        grievance_by_status: statusMap,
        top_grievance_categories: grievanceByStatus,
        recent_users: recentUsers
      }
    });
  } catch (err) {
    console.error('getStats error:', err);
    return res.status(500).json({ success: false, message: 'Failed to compute statistics.' });
  }
};


// ─── Create Service / Scheme ──────────────────────────────────────────────────
export const createService = async (req, res) => {
  try {
    const data = req.body;

    if (!data.title || !data.category_id || !data.department || !data.benefits || !data.official_url) {
      return res.status(400).json({
        success: false,
        message: 'Title, category_id, department, benefits, and official_url are required.'
      });
    }

    // Verify category exists
    const category = await Category.findOne({ id: data.category_id });
    if (!category) {
      return res.status(400).json({
        success: false,
        message: `Category "${data.category_id}" does not exist.`
      });
    }

    const id = data.id || `srv_${Date.now()}`;

    // Check for duplicate ID
    const existing = await Service.findOne({ id });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A service with ID "${id}" already exists.`
      });
    }

    const created = await Service.create({
      ...data,
      id,
      documents: data.documents || [],
      guidance_steps: data.guidance_steps || [],
      faqs: data.faqs || [],
      tags: data.tags || [],
      keywords: data.keywords || []
    });

    await logAction(req, 'CREATE_SERVICE', 'services', created.id,
      `Created scheme: "${created.title}" (ID: ${created.id}) in category: ${category.name}`);

    return res.status(201).json({
      success: true,
      message: `Service "${created.title}" published successfully.`,
      service: created
    });
  } catch (err) {
    console.error('createService error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message).join(' ');
      return res.status(400).json({ success: false, message: messages });
    }
    return res.status(500).json({ success: false, message: 'Failed to create service.' });
  }
};


// ─── Update Service ───────────────────────────────────────────────────────────
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent changing the service ID
    delete updates.id;

    const updated = await Service.findOneAndUpdate(
      { id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: `Service "${id}" not found.` });
    }

    await logAction(req, 'UPDATE_SERVICE', 'services', id,
      `Updated service "${updated.title}" (ID: ${id}). Fields: ${Object.keys(updates).join(', ')}`);

    return res.json({
      success: true,
      message: 'Service updated successfully.',
      service: updated
    });
  } catch (err) {
    console.error('updateService error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message).join(' ');
      return res.status(400).json({ success: false, message: messages });
    }
    return res.status(500).json({ success: false, message: 'Failed to update service.' });
  }
};


// ─── Delete Service ────────────────────────────────────────────────────────────
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findOneAndDelete({ id });

    if (!service) {
      return res.status(404).json({ success: false, message: `Service "${id}" not found.` });
    }

    // Clean up related saved services
    await SavedService.deleteMany({ service_id: id });

    await logAction(req, 'DELETE_SERVICE', 'services', id,
      `Deleted service "${service.title}" (ID: ${id})`);

    return res.json({
      success: true,
      message: `Service "${service.title}" deleted successfully.`
    });
  } catch (err) {
    console.error('deleteService error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete service.' });
  }
};


// ─── Get All Grievances (Admin) ───────────────────────────────────────────────
export const getAllGrievances = async (req, res) => {
  try {
    const {
      status,
      category,
      priority,
      search,
      page = 1,
      limit = 20,
      sort = 'newest'
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    let query = {};
    if (status && status !== 'all') query.status = status;
    if (category && category !== 'all') query.category = new RegExp(category, 'i');
    if (priority && priority !== 'all') query.priority = priority;
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { tracking_number: searchRegex },
        { user_name: searchRegex },
        { user_email: searchRegex },
        { subject: searchRegex }
      ];
    }

    let sortQuery = {};
    switch (sort) {
      case 'oldest': sortQuery = { created_at: 1 }; break;
      case 'priority': sortQuery = { priority: -1, created_at: -1 }; break;
      default: sortQuery = { created_at: -1 };
    }

    const [total, grievances] = await Promise.all([
      Grievance.countDocuments(query),
      Grievance.find(query).sort(sortQuery).skip(skip).limit(limitNum).lean()
    ]);

    return res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      grievances
    });
  } catch (err) {
    console.error('getAllGrievances error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch grievances.' });
  }
};


// ─── Update Grievance (Admin) ─────────────────────────────────────────────────
export const updateGrievance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_response, priority } = req.body;

    const updates = {};
    if (status) {
      const validStatuses = ['Submitted', 'Under Review', 'Escalated', 'Resolved', 'Closed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }
      updates.status = status;
      if (status === 'Resolved' || status === 'Closed') {
        updates.resolved_at = new Date();
      }
    }
    if (admin_response !== undefined) updates.admin_response = admin_response.trim();
    if (priority) updates.priority = priority;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No update fields provided.' });
    }

    const updated = await Grievance.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Grievance not found.' });
    }

    // Notify the citizen if they are a registered user
    if (updated.user_id) {
      const statusMessages = {
        'Under Review': 'is now under active review by our team.',
        'Escalated': 'has been escalated to a senior officer.',
        'Resolved': 'has been marked as resolved.',
        'Closed': 'has been closed.'
      };
      const statusMsg = statusMessages[updated.status] || `status updated to "${updated.status}".`;

      await Notification.create({
        user_id: updated.user_id,
        type: 'grievance_update',
        title: `Grievance Update: ${updated.tracking_number}`,
        title_hi: `शिकायत अपडेट: ${updated.tracking_number}`,
        message: `Your grievance "${updated.subject}" ${statusMsg}${admin_response ? ` Response: ${admin_response}` : ''}`,
        message_hi: `आपकी शिकायत "${updated.subject}" की स्थिति: ${updated.status}`,
        link: `/grievance?track=${updated.tracking_number}`,
        read_status: false
      });
    }

    await logAction(req, 'UPDATE_GRIEVANCE', 'grievances', updated._id.toString(),
      `Updated grievance ${updated.tracking_number} → Status: ${updated.status}`);

    return res.json({
      success: true,
      message: 'Grievance updated and citizen notified.',
      grievance: updated
    });
  } catch (err) {
    console.error('updateGrievance error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update grievance.' });
  }
};


// ─── Get All Users (Admin) ────────────────────────────────────────────────────
export const getUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20, sort = 'newest' } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    let query = {};
    if (role && role !== 'all') query.role = role;
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex }
      ];
    }

    const sortQuery = sort === 'oldest' ? { created_at: 1 } : { created_at: -1 };

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .select('-password_hash')
        .sort(sortQuery)
        .skip(skip)
        .limit(limitNum)
        .lean()
    ]);

    return res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      users: users.map((u) => ({
        ...u,
        id: u._id.toString()
      }))
    });
  } catch (err) {
    console.error('getUsers error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
};


// ─── Update User Role (SuperAdmin Only) ───────────────────────────────────────
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['citizen', 'admin', 'superadmin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}`
      });
    }

    // Prevent self-demotion
    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role.'
      });
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: { role } },
      { new: true }
    ).select('-password_hash');

    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    await logAction(req, 'UPDATE_USER_ROLE', 'users', id,
      `Changed role of ${updated.email} to "${role}"`);

    return res.json({
      success: true,
      message: `User role updated to "${role}".`,
      user: updated
    });
  } catch (err) {
    console.error('updateUserRole error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update user role.' });
  }
};


// ─── Toggle User Active Status (SuperAdmin Only) ───────────────────────────────
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account.'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const newStatus = !user.is_active;
    await User.findByIdAndUpdate(id, { $set: { is_active: newStatus } });

    await logAction(req, newStatus ? 'ACTIVATE_USER' : 'SUSPEND_USER', 'users', id,
      `${newStatus ? 'Activated' : 'Suspended'} user account: ${user.email}`);

    return res.json({
      success: true,
      message: `User account ${newStatus ? 'activated' : 'suspended'} successfully.`,
      is_active: newStatus
    });
  } catch (err) {
    console.error('toggleUserStatus error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update user status.' });
  }
};


// ─── Bulk Import Schemes ───────────────────────────────────────────────────────
export const bulkImport = async (req, res) => {
  try {
    const { schemes } = req.body;

    if (!Array.isArray(schemes) || schemes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'A non-empty array of schemes is required.'
      });
    }

    if (schemes.length > 200) {
      return res.status(400).json({
        success: false,
        message: 'Cannot import more than 200 schemes at once.'
      });
    }

    const errors = [];
    let imported = 0;
    let updated = 0;

    for (const s of schemes) {
      if (!s.title || !s.category_id) {
        errors.push(`Skipped: ${s.id || 'unknown'} — missing title or category_id`);
        continue;
      }

      const id = s.id || `srv_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      const result = await Service.updateOne(
        { id },
        { $set: { ...s, id } },
        { upsert: true, runValidators: false }
      );

      if (result.upsertedCount > 0) imported++;
      else if (result.modifiedCount > 0) updated++;
    }

    await logAction(req, 'BULK_IMPORT', 'services', '', 
      `Bulk import: ${imported} new + ${updated} updated schemes. ${errors.length} skipped.`);

    return res.json({
      success: true,
      message: `Import complete: ${imported} new schemes, ${updated} updated.`,
      imported,
      updated,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) {
    console.error('bulkImport error:', err);
    return res.status(500).json({ success: false, message: 'Bulk import failed.' });
  }
};


// ─── Reset / Reseed Database ───────────────────────────────────────────────────
export const resetSeed = async (req, res) => {
  try {
    let categoriesUpdated = 0;
    let servicesUpdated = 0;
    let officesUpdated = 0;

    for (const c of categoriesData) {
      const result = await Category.updateOne({ id: c.id }, { $set: c }, { upsert: true });
      if (result.upsertedCount > 0 || result.modifiedCount > 0) categoriesUpdated++;
    }

    for (const s of servicesData) {
      const result = await Service.updateOne({ id: s.id }, { $set: s }, { upsert: true });
      if (result.upsertedCount > 0 || result.modifiedCount > 0) servicesUpdated++;
    }

    for (const o of officeLocationsData) {
      const result = await OfficeLocation.updateOne({ id: o.id }, { $set: o }, { upsert: true });
      if (result.upsertedCount > 0 || result.modifiedCount > 0) officesUpdated++;
    }

    await logAction(req, 'RESET_SEED', 'system', '',
      `Database reseeded: ${categoriesUpdated} categories, ${servicesUpdated} services, ${officesUpdated} offices.`);

    return res.json({
      success: true,
      message: 'Database reseeded successfully.',
      stats: {
        categories: categoriesUpdated,
        services: servicesUpdated,
        offices: officesUpdated
      }
    });
  } catch (err) {
    console.error('resetSeed error:', err);
    return res.status(500).json({ success: false, message: 'Failed to reseed database.' });
  }
};


// ─── Get Audit Logs ────────────────────────────────────────────────────────────
export const getAuditLogs = async (req, res) => {
  try {
    const { action, admin_id, entity, page = 1, limit = 50 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (action) query.action = new RegExp(action, 'i');
    if (admin_id) query.admin_id = admin_id;
    if (entity) query.entity = new RegExp(entity, 'i');

    const [total, logs] = await Promise.all([
      AuditLog.countDocuments(query),
      AuditLog.find(query)
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
      logs
    });
  } catch (err) {
    console.error('getAuditLogs error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch audit logs.' });
  }
};


// ─── Broadcast Notification (Admin) ───────────────────────────────────────────
export const broadcastNotification = async (req, res) => {
  try {
    const { title, title_hi, message, message_hi, link, type } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required for broadcast notification.'
      });
    }

    const notification = await Notification.create({
      user_id: null, // broadcast to all
      type: type || 'scheme_alert',
      title: title.trim(),
      title_hi: (title_hi || '').trim(),
      message: message.trim(),
      message_hi: (message_hi || '').trim(),
      link: link || '',
      read_status: false
    });

    await logAction(req, 'BROADCAST_NOTIFICATION', 'notifications', notification._id.toString(),
      `Broadcast: "${title}"`);

    return res.status(201).json({
      success: true,
      message: 'Broadcast notification sent to all citizens.',
      notification
    });
  } catch (err) {
    console.error('broadcastNotification error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send broadcast notification.' });
  }
};


// ─── Delete User (SuperAdmin Only) ────────────────────────────────────────────
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account.'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Don't allow deleting other superadmins
    if (user.role === 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete a superadmin account.'
      });
    }

    await Promise.all([
      User.findByIdAndDelete(id),
      SavedService.deleteMany({ user_id: id }),
      Notification.deleteMany({ user_id: id })
    ]);

    await logAction(req, 'DELETE_USER', 'users', id,
      `Deleted user account: ${user.email} (${user.role})`);

    return res.json({
      success: true,
      message: `User "${user.email}" deleted successfully.`
    });
  } catch (err) {
    console.error('deleteUser error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete user.' });
  }
};
