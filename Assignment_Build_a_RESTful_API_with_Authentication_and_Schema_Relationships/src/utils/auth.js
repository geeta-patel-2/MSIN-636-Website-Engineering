import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

// Middleware for verifying JWT token
export const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];  // Bearer token format
    if (!token) return res.status(401).json({ message: 'Access denied, no token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.user = decoded;
        next();
    });
};

// Generate JWT token
export const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
