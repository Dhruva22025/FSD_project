// src/middleware/auth.js
import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not set');
    const payload = jwt.verify(token, secret);
    // payload should contain user id (e.g. { sub: 'userId', ... } or { id: 'userId' })
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token', details: err.message });
  }
}