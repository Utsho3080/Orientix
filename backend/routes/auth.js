const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
// const db = require('../db'); // Commented out until Neon URI is provided to avoid crashes

// 1. Initial Login Route (Requires Email/Password)
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  
  // MOCK DB LOGIC: In production, query the Neon Database
  // const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  // const user = result.rows[0];

  // For testing our API connection:
  let assumedRole = role || 'ADMIN'; // Frontend passes this strictly for mock testing

  // Generate a partial JWT that does NOT have 2FA verified yet
  const token = jwt.sign(
    { email: email, role: assumedRole, twoFactorVerified: false },
    process.env.JWT_SECRET,
    { expiresIn: '5m' } // Only valid for 5 mins to force 2FA
  );

  res.json({
    message: 'Credentials valid. Proceed to 2FA.',
    token: token
  });
});

// 2. 2FA Verification Route
router.post('/verify-2fa', async (req, res) => {
  const { code, tempToken } = req.body;

  try {
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    
    // MOCK 2FA LOGIC: In production, verify `code` against `user.totp_secret` in Neon DB
    // const isValid = authenticator.check(code, userSecretFromDB);
    const isValid = code.length === 6; // Mock success

    if (isValid) {
      // Issue the final, fully authorized 24-hour token
      const finalToken = jwt.sign(
        { email: decoded.email, role: decoded.role, twoFactorVerified: true },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        message: '2FA Successful',
        token: finalToken,
        role: decoded.role
      });
    } else {
      return res.status(401).json({ error: 'Invalid 2FA Code' });
    }

  } catch (error) {
    res.status(401).json({ error: 'Session expired or invalid token' });
  }
});

module.exports = router;
