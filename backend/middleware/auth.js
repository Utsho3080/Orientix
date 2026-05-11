const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ error: 'No token provided. Access denied.' });
  }

  try {
    // Expect format: "Bearer <token>"
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded; // Contains id, email, role, 2faVerified
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }
};

const requireTwoFactor = (req, res, next) => {
  if (!req.user.twoFactorVerified) {
    return res.status(403).json({ error: 'Two-factor authentication required for this action.' });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  // Both ADMIN and SUPER_ADMIN have basic admin rights
  if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Requires Admin priviledges.' });
  }
  next();
};

const requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Security Walled Garden: Requires Super Admin priviledges.' });
  }
  next();
};

module.exports = {
  verifyToken,
  requireTwoFactor,
  requireAdmin,
  requireSuperAdmin
};
