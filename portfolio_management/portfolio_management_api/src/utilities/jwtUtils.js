import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY || 'your-secret-key'; // Replace with a strong, secret key
const expiresIn = process.env.JWT_EXPIRES_IN || '1h';


export class JwtUtils {

    // Verify JWT middleware
    static verifyToken = (req, res, next) => {

        // Fetching authorization from request header and token from authorization
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        // HTTP Unauthorized if token is not found
        if (!token) return res.sendStatus(401);

        jwt.verify(token, secretKey, (err, user) => {
            // HTTP Forbidden if unable to verify token
            if (err) return res.sendStatus(403);

            // Adding extracted user to the request
            req.user = user;

            // Generating new token
            JwtUtils.getNewToken(user, (err, newToken) => {
                // Terminating request if error.
                if (err) return res.sendStatus(403);

                // Adding new token in the response
                res.setHeader('Authorization', `Bearer ${newToken}`);

                // As authorization and new token generation is successful letting request go further
                next();
            })
        });
    }

    // Static method to generate new token
    static getNewToken = (user, callback) => {
        jwt.sign({ user }, secretKey, { expiresIn: expiresIn }, callback);
    }

}