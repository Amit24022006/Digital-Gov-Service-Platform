import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'govdesk_super_secret_jwt_key_2026_change_in_prod';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate a signed JWT token for a user
 */
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Format a user document for API responses (no password hash)
 */
export const formatUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  phone: user.phone || '',
  state: user.state,
  city: user.city || '',
  role: user.role,
  preferences: user.preferences || [],
  is_active: user.is_active !== false,
  created_at: user.created_at || user.createdAt
});

/**
 * Middleware: Require valid JWT token in Authorization header
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr) {
      const msg = jwtErr.name === 'TokenExpiredError'
        ? 'Authentication token has expired. Please login again.'
        : 'Invalid authentication token.';
      return res.status(401).json({ success: false, message: msg });
    }

    const user = await User.findById(decoded.id).select('-password_hash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User associated with this token no longer exists.'
      });
    }

    if (user.is_active === false) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.'
      });
    }

    req.user = formatUser(user);
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(500).json({ success: false, message: 'Authentication failed due to server error.' });
  }
};

/**
 * Middleware: Attach user if valid token present, but don't block if missing
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password_hash');
        if (user) {
          req.user = formatUser(user);
        }
      } catch {
        // Silently ignore invalid token in optionalAuth
      }
    }
  } catch {
    // Ignore errors
  }
  next();
};

/**
 * Middleware: Require specific roles to access a route
 * @param {string[]} roles - Array of allowed roles e.g. ['admin', 'superadmin']
 */
export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    const roleList = Array.isArray(roles) ? roles : [roles];
    if (!roleList.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${roleList.join(', ')}. Your role: ${req.user.role}.`
      });
    }
    next();
  };
};
