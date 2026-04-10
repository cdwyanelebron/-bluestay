const jwt = require('jsonwebtoken');

// Verify JWT Token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Verify Host (Listing Owner)
const hostMiddleware = (req, res, next) => {
  if (req.user.role !== 'host' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Host privileges required' });
  }
  next();
};

// Verify Admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }
  next();
};

module.exports = { authMiddleware, hostMiddleware, adminMiddleware };
