import { Notification } from '../models/Others.js';

// ─── Get Notifications ────────────────────────────────────────────────────────
export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 30, unread_only } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const userId = req.user ? req.user.id : null;

    // Build query: broadcast (user_id: null) always included
    // If logged in: also include user-specific notifications
    let query = {};
    if (userId) {
      query.$or = [{ user_id: null }, { user_id: userId }];
    } else {
      query.user_id = null;
    }

    // Optionally filter unread only
    if (unread_only === 'true') {
      query.read_status = false;
    }

    const [total, notifications] = await Promise.all([
      Notification.countDocuments(query),
      Notification.find(query)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean()
    ]);

    const unreadCount = await Notification.countDocuments({
      ...query,
      read_status: false
    });

    return res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      unread_count: unreadCount,
      notifications
    });
  } catch (err) {
    console.error('getNotifications error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch notifications.' });
  }
};


// ─── Mark Notification(s) as Read ────────────────────────────────────────────
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Mark ALL as read (covers PUT /notifications/all/read and /:id/read with id=all)
    if (!id || id === 'all') {
      const filter = userId
        ? { $or: [{ user_id: null }, { user_id: userId }] }
        : { user_id: null };

      const result = await Notification.updateMany(filter, { $set: { read_status: true } });
      return res.json({
        success: true,
        message: `${result.modifiedCount} notification(s) marked as read.`
      });
    }

    // Mark single by ID
    const notification = await Notification.findByIdAndUpdate(
      id,
      { $set: { read_status: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    return res.json({ success: true, notification });
  } catch (err) {
    console.error('markAsRead error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update notification status.' });
  }
};


// ─── Delete a Notification ─────────────────────────────────────────────────────
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    // Only allow deleting own or broadcast notifications
    if (notification.user_id && notification.user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Cannot delete another user\'s notification.' });
    }

    await Notification.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Notification deleted.' });
  } catch (err) {
    console.error('deleteNotification error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete notification.' });
  }
};
