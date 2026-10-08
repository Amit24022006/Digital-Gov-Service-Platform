import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { OtpVerification, Notification } from '../models/Others.js';
import { generateToken, formatUser } from '../middleware/auth.js';

// ─── Register ─────────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, phone, state, city, preferences, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    if (phone && phone.trim() && !/^[0-9+\-\s]{8,15}$/.test(phone.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid phone number.'
      });
    }

    // Check for duplicate email
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please login.'
      });
    }

    // Hash password with bcrypt (10 salt rounds)
    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : '',
      state: state || 'All India',
      city: city ? city.trim() : '',
      preferences: Array.isArray(preferences) ? preferences : [],
      role: 'citizen', // All public registrations are citizens
      is_active: true,
      password_hash
    });

    const token = generateToken(newUser);

    try {
      await Notification.create({
        user_id: newUser._id.toString(),
        type: 'scheme_alert',
        title: 'Welcome to GovDesk! 🇮🇳',
        title_hi: 'गोवडेस्क में आपका स्वागत है! 🇮🇳',
        message: 'Explore government schemes, check your eligibility, and track your applications easily.',
        message_hi: 'सरकारी योजनाओं को खोजें, अपनी पात्रता जांचें और सेवाओं को ट्रैक करें।',
        link: '/services',
        read_status: false
      });
    } catch (notifErr) {
      console.warn('Welcome notification skipped:', notifErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Account created successfully. Welcome to GovDesk!',
      token,
      user: formatUser(newUser)
    });
  } catch (err) {
    console.error('Register error:', err);
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please login.'
      });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message).join(' ');
      return res.status(400).json({ success: false, message: messages });
    }
    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
};


// ─── Login ────────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: formatUser(user)
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
};


// ─── Send OTP ─────────────────────────────────────────────────────────────────
export const sendOtp = async (req, res) => {
  try {
    const { phone, email } = req.body;
    const identifier = (phone || email || '').trim();

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Phone number or email is required to send OTP.'
      });
    }

    // Check if there is already a valid non-expired OTP (rate limiting)
    const recentOtp = await OtpVerification.findOne({
      identifier,
      verified: false,
      expires_at: { $gt: new Date() },
      created_at: { $gt: new Date(Date.now() - 60 * 1000) } // within last 1 min
    });

    if (recentOtp) {
      return res.status(429).json({
        success: false,
        message: 'An OTP was already sent recently. Please wait 1 minute before requesting again.'
      });
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await OtpVerification.create({
      identifier,
      code,
      expires_at,
      verified: false,
      attempts: 0
    });

    // In a real system, this would call an SMS/email gateway (Twilio, MSG91, etc.)
    // For development: return OTP in response (remove in production!)
    return res.json({
      success: true,
      message: `OTP sent to ${identifier}. Valid for 10 minutes.`,
      // ⚠️ REMOVE otp_code in production — for development testing only
      ...(process.env.NODE_ENV !== 'production' && { otp_code: code })
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send OTP. Please try again.' });
  }
};


// ─── Verify OTP ───────────────────────────────────────────────────────────────
export const verifyOtp = async (req, res) => {
  try {
    const { identifier, code } = req.body;

    if (!identifier || !code) {
      return res.status(400).json({
        success: false,
        message: 'Identifier and OTP code are both required.'
      });
    }

    const record = await OtpVerification.findOne({
      identifier: identifier.trim(),
      verified: false,
      expires_at: { $gt: new Date() }
    }).sort({ created_at: -1 }); // most recent first

    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'No valid OTP found. Please request a new OTP.'
      });
    }

    // Check for too many attempts
    if (record.attempts >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    if (record.code !== code.trim()) {
      // Increment attempt counter
      await OtpVerification.findByIdAndUpdate(record._id, { $inc: { attempts: 1 } });
      return res.status(400).json({
        success: false,
        message: `Incorrect OTP. ${4 - record.attempts} attempts remaining.`
      });
    }

    // Mark OTP as verified
    record.verified = true;
    await record.save();

    // Check if a user exists with this identifier
    const user = await User.findOne({
      $or: [
        { email: identifier.trim().toLowerCase() },
        { phone: identifier.trim() }
      ]
    });

    if (user) {
      const token = generateToken(user);
      return res.json({
        success: true,
        message: 'OTP verified successfully. Login complete.',
        token,
        user: formatUser(user)
      });
    }

    return res.json({
      success: true,
      message: 'OTP verified. Please complete registration.',
      identifier: identifier.trim(),
      verified: true
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return res.status(500).json({ success: false, message: 'OTP verification failed. Please try again.' });
  }
};


// ─── Get Current User Profile ─────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password_hash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }
    return res.json({ success: true, user: formatUser(user) });
  } catch (err) {
    console.error('GetMe error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
};


// ─── Update Profile ───────────────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, state, city, preferences } = req.body;
    const updates = {};

    if (name !== undefined) {
      if (name.trim().length < 2) {
        return res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' });
      }
      updates.name = name.trim();
    }
    if (phone !== undefined) updates.phone = phone.trim();
    if (state !== undefined) updates.state = state.trim();
    if (city !== undefined) updates.city = city.trim();
    if (preferences !== undefined) {
      updates.preferences = Array.isArray(preferences) ? preferences : [];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields provided for update.' });
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password_hash');

    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: formatUser(updated)
    });
  } catch (err) {
    console.error('Update profile error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message).join(' ');
      return res.status(400).json({ success: false, message: messages });
    }
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};


// ─── Change Password ──────────────────────────────────────────────────────────
export const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.'
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(current_password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }

    if (current_password === new_password) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password.'
      });
    }

    const newHash = await bcrypt.hash(new_password, 10);
    await User.findByIdAndUpdate(req.user.id, { $set: { password_hash: newHash } });

    return res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ success: false, message: 'Failed to change password.' });
  }
};
