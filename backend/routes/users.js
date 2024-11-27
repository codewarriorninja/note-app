import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.put('/profile', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findById(req.user._id);

    if (username) user.username = username;
    if (password) user.password = password;

    await user.save();

    res.json({ message: 'Profile updated successfully', user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

