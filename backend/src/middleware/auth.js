import jwt from 'jsonwebtoken';
import { USER_ROLES } from '../config/constants.js';
import { User } from '../models/User.js';

// Verify JWT and attach user to request
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload.sub).lean();
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      status: user.status,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized', details: err.message });
  }
};

// Role-based access control
export const requireRole = (role) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (req.user.role !== role) {
    return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
  }
  next();
};

// Helpers to check admin quickly
export const requireAdmin = requireRole(USER_ROLES.ADMIN);
