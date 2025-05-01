import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY || 'your-secret-key'; // Replace with a strong, secret key
const expiresIn = process.env.JWT_EXPIRES_IN || '1h';


export class JwtUtils {

    // Verify JWT middleware
    static verifyToken = (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.sendStatus(401);

        jwt.verify(token, secretKey, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            JwtUtils.getNewToken(user, (err, newToken) => {
                if (err) return res.sendStatus(403);

                res.setHeader('Authorization', `Bearer ${newToken}`);
                next();
            })
        });
    }

    static getNewToken = (user, callback) => {
        jwt.sign({ user }, secretKey, { expiresIn: expiresIn }, callback);
    }

}