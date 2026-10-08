import express from 'express';

// Auth Controller
import {
  register,
  login,
  sendOtp,
  verifyOtp,
  getMe,
  updateProfile,
  changePassword
} from '../controllers/authController.js';

// Services Controller
import {
  getCategories,
  getServices,
  getServiceById,
  checkEligibility,
  compareServices,
  toggleSaveService,
  getSavedServices
} from '../controllers/servicesController.js';

// Offices Controller
import {
  getOffices,
  getOfficeById,
  getOfficeStats
} from '../controllers/officesController.js';

// Notifications Controller
import {
  getNotifications,
  markAsRead,
  deleteNotification
} from '../controllers/notificationsController.js';

// Grievances Controller
import {
  createGrievance,
  getMyGrievances,
  trackGrievance,
  getGrievanceCategories
} from '../controllers/grievancesController.js';

// Feedback Controller
import {
  submitFeedback,
  getServiceFeedback,
  getAllFeedback
} from '../controllers/feedbackController.js';

// Admin Controller
import {
  getStats,
  createService,
  updateService,
  deleteService,
  getAllGrievances,
  updateGrievance,
  getUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  bulkImport,
  resetSeed,
  getAuditLogs,
  broadcastNotification
} from '../controllers/adminController.js';

// Middleware
import { authenticate, optionalAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// ─── Auth Routes ──────────────────────────────────────────────────────────────
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/send-otp', sendOtp);
router.post('/auth/verify-otp', verifyOtp);
router.get('/auth/me', authenticate, getMe);
router.put('/auth/profile', authenticate, updateProfile);
router.put('/auth/change-password', authenticate, changePassword);

// ─── Categories ────────────────────────────────────────────────────────────────
router.get('/categories', getCategories);

// ─── Services ─────────────────────────────────────────────────────────────────
// IMPORTANT: Specific routes MUST come before :id parameter routes
router.get('/services/compare/items', optionalAuth, compareServices);
router.get('/services/saved/my', authenticate, getSavedServices);
router.post('/services/save', authenticate, toggleSaveService);
router.get('/services', optionalAuth, getServices);
router.get('/services/:id', optionalAuth, getServiceById);

// ─── Eligibility ───────────────────────────────────────────────────────────────
router.post('/eligibility/check', optionalAuth, checkEligibility);

// ─── Office Locations ─────────────────────────────────────────────────────────
router.get('/offices', getOffices);
router.get('/offices/:id', getOfficeById);

// ─── Notifications ─────────────────────────────────────────────────────────────
router.get('/notifications', optionalAuth, getNotifications);
router.put('/notifications/all/read', optionalAuth, markAsRead);    // Mark all read
router.put('/notifications/:id/read', optionalAuth, markAsRead);    // Mark one read
router.delete('/notifications/:id', optionalAuth, deleteNotification);

// ─── Grievances / Helpdesk ────────────────────────────────────────────────────
router.get('/grievances/categories', getGrievanceCategories);
router.post('/grievances', optionalAuth, createGrievance);
router.get('/grievances/my', authenticate, getMyGrievances);
router.get('/grievances/track/:token', trackGrievance);

// ─── Feedback & Ratings ───────────────────────────────────────────────────────
router.post('/feedback', optionalAuth, submitFeedback);
router.get('/feedback/service/:service_id', getServiceFeedback);

// ─── Admin: Dashboard ──────────────────────────────────────────────────────────
router.get(
  '/admin/stats',
  authenticate, requireRole(['admin', 'superadmin']),
  getStats
);

// ─── Admin: Services ──────────────────────────────────────────────────────────
router.post(
  '/admin/services',
  authenticate, requireRole(['admin', 'superadmin']),
  createService
);
router.put(
  '/admin/services/:id',
  authenticate, requireRole(['admin', 'superadmin']),
  updateService
);
router.delete(
  '/admin/services/:id',
  authenticate, requireRole(['admin', 'superadmin']),
  deleteService
);

// ─── Admin: Grievances ─────────────────────────────────────────────────────────
router.get(
  '/admin/grievances',
  authenticate, requireRole(['admin', 'superadmin']),
  getAllGrievances
);
router.put(
  '/admin/grievances/:id',
  authenticate, requireRole(['admin', 'superadmin']),
  updateGrievance
);

// ─── Admin: Users ──────────────────────────────────────────────────────────────
router.get(
  '/admin/users',
  authenticate, requireRole(['admin', 'superadmin']),
  getUsers
);
router.put(
  '/admin/users/:id/role',
  authenticate, requireRole(['superadmin']),
  updateUserRole
);
router.put(
  '/admin/users/:id/status',
  authenticate, requireRole(['superadmin']),
  toggleUserStatus
);
router.delete(
  '/admin/users/:id',
  authenticate, requireRole(['superadmin']),
  deleteUser
);

// ─── Admin: Feedback ───────────────────────────────────────────────────────────
router.get(
  '/admin/feedback',
  authenticate, requireRole(['admin', 'superadmin']),
  getAllFeedback
);

// ─── Admin: Notifications ──────────────────────────────────────────────────────
router.post(
  '/admin/notifications/broadcast',
  authenticate, requireRole(['admin', 'superadmin']),
  broadcastNotification
);

// ─── Admin: Offices (Stats) ────────────────────────────────────────────────────
router.get(
  '/admin/offices/stats',
  authenticate, requireRole(['admin', 'superadmin']),
  getOfficeStats
);

// ─── Admin: Seeding & Data Management ─────────────────────────────────────────
router.post(
  '/admin/seed/bulk',
  authenticate, requireRole(['admin', 'superadmin']),
  bulkImport
);
router.post(
  '/admin/seed/reset',
  authenticate, requireRole(['admin', 'superadmin']),
  resetSeed
);

// ─── Admin: Audit Logs ────────────────────────────────────────────────────────
router.get(
  '/admin/audit-logs',
  authenticate, requireRole(['admin', 'superadmin']),
  getAuditLogs
);

export default router;
