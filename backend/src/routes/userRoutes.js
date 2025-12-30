import express from 'express';
import { User } from '../models/User.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { USER_STATUS, DEFAULT_PAGE_SIZE } from '../config/constants.js';
import { isValidEmail, isValidName, isStrongPassword } from '../utils/validators.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Admin: list users with pagination
router.get('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || DEFAULT_PAGE_SIZE, 1);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find({}, '-passwordHash').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(),
    ]);

    return res.json({
      data: users,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
});

// Admin: activate user
router.patch('/:id/activate', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: USER_STATUS.ACTIVE },
      { new: true, projection: '-passwordHash' }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ message: 'User activated', user });
  } catch (err) {
    next(err);
  }
});

// Admin: deactivate user
router.patch('/:id/deactivate', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: USER_STATUS.INACTIVE },
      { new: true, projection: '-passwordHash' }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ message: 'User deactivated', user });
  } catch (err) {
    next(err);
  }
});

// User: get own profile
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id, '-passwordHash').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user });
  } catch (err) {
    next(err);
  }
});

// User: update profile (name/email)
router.patch('/me', authenticate, async (req, res, next) => {
  try {
    const { fullName, email } = req.body;

    if (fullName && !isValidName(fullName)) {
      return res.status(400).json({ message: 'Full name must be 2-100 characters' });
    }
    if (email && !isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const update = {};
    if (fullName) update.fullName = fullName.trim();
    if (email) update.email = email.toLowerCase();

    if (update.email) {
      const exists = await User.findOne({ email: update.email, _id: { $ne: req.user.id } });
      if (exists) return res.status(409).json({ message: 'Email already in use' });
    }

    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true, projection: '-passwordHash' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ message: 'Profile updated', user });
  } catch (err) {
    next(err);
  }
});

// User: change password
router.patch('/me/password', authenticate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }
    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const matches = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: 'Password updated' });
  } catch (err) {
    next(err);
  }
});

export default router;
