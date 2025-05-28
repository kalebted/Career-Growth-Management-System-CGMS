// controllers/authController.js
import axios from 'axios';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// --- Google Login Handler ---
export const googleLogin = async (req, res) => {
  const { access_token } = req.body;
  if (!access_token) return res.status(400).json({ message: 'Access token missing' });

  try {
    // 1. Get user info from Google
    const { data: googleUser } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { email, name, sub: googleId } = googleUser;
    if (!email || !name) return res.status(400).json({ message: 'Invalid Google token data' });

    // 2. Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        isGoogleAuth: true,
        password: googleId, // not used, placeholder
        role: null, // user needs to set role first time
        username: email.split('@')[0],
      });
    }

    if (!user.role) {
      return res.status(200).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        needsRole: true,
      });
    }

    // 3. Issue token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const userData = { ...user._doc };
    delete userData.password;

    res.json({ token, user: userData });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ message: 'Google login failed', error: err.message });
  }
};

// --- Set Role After First-Time Google Login ---
export const setGoogleUserRole = async (req, res) => {
  const { userId, role } = req.body;

  if (!['job_seeker', 'recruiter'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const userData = { ...user._doc };
    delete userData.password;

    res.json({ token, user: userData });
  } catch (err) {
    console.error('Set role error:', err);
    res.status(500).json({ message: 'Failed to set role', error: err.message });
  }
};
