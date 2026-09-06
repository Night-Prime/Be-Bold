const { verify } = require('../utils/jwt');
exports.auth = (req, res, next) => {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: 'No token' });
  try { req.user = verify(h.split(' ')[1]); next(); } catch { res.status(401).json({ error: 'Invalid token' }); }
};
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  next();
};
