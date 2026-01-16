import jwt from 'jsonwebtoken';

// Read the password from DevCode.json
const devConfig = require('../../../DevCode.json');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;

  // Compare the provided password with the one in DevCode.json
  if (password === devConfig.password) {
    // Generate a JWT token
    const token = jwt.sign(
      { authenticated: true },
      process.env.JWT_SECRET || 'your_strong_jwt_secret_key_for_guard_dashboard_that_is_at_least_32_characters_long',
      { expiresIn: '24h' }
    );

    return res.status(200).json({ 
      success: true, 
      token,
      message: 'Giriş başarılı'
    });
  } else {
    return res.status(401).json({ 
      success: false, 
      error: 'Geçersiz şifre' 
    });
  }
}