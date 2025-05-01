// routes/userRoutes.js
import express from 'express';
import User from '../models/User.js';
import {JwtUtils} from "../utilities/jwtUtils.js";

const loginRouter = express.Router();

// POST route to create a new user
loginRouter.post('/login', async (req, res) => {
    const { email_id, password } = req.body;
    try {
        let user = await User.findOne({ email_id }).select('+password'); // Explicitly include password

        if (!user) return res.status(401).json({ message: 'User not found' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        user = await User.findOne({ email_id });

        JwtUtils.getNewToken(user, (err, token) => {
            console.log('Test ', token);
            if (err) {
                return res.status(500).json({ message: 'Something went wrong while generating token.' });
            } else {
                return res.json({ message: 'Login successful',token });
            }
        });

        // Generate token, send response, etc.
        //res.json({ message: 'Login successful' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// POST route to create a new user
loginRouter.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email_id, password } = req.body;
        const highestUserIdUser = await User.findOne().sort({ user_id: -1 });
        console.log(highestUserIdUser);
        console.log(highestUserIdUser.user_id+1);

        const newUser = new User({
            user_id: highestUserIdUser.user_id + 1,
            first_name,
            last_name,
            email_id,
            password,
            joining_date: Date.now(),
        });

        await newUser.save();
        res.status(201).json({ message: 'User Registered successfully.', user_id: newUser.user_id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default loginRouter;
