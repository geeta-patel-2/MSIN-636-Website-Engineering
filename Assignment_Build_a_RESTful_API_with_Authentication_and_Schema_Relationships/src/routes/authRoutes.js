import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import {generateToken} from '../utils/auth.js'

const authRoutes = express.Router();

// User Registration Route
authRoutes.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ username, email, password });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({ message: 'User registered successfully', token });
});

// User Login Route
authRoutes.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = generateToken(user._id);
    res.json({ message: 'Login successful', token });
});

export default authRoutes;
