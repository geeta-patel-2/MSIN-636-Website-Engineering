// Import required modules
import express from 'express';
import {JwtUtils} from "../utilities/jwtUtils.js";
import UserAssociation from "../models/UserAssociation.js";
import User from "../models/user.js";
import UserAccount from "../models/UserAccounts.js"; // adjust path

const accountDashboardRoutes = express.Router();

// Apply middleware to all routes
accountDashboardRoutes.use(JwtUtils.verifyToken);

// Route: GET /account_dashboard/:user_id
accountDashboardRoutes.get('/account_dashboard/:user_id', async (req, res) => {
    try {
        const userId = req.params.user_id;

        // 1️⃣ Fetch the user by user_id
        const user = await User.findOne({user_id: userId});
        if (!user) {
            return res.status(404).json({
                status: false,
                message: 'User not found.',
                data: null
            });
        }

        // 2️⃣ Check if user_type is 'Strategic Advisor'
        if (user.user_type !== 'Strategic Advisor') {
            return res.status(403).json({
                status: false,
                message: 'Access denied: User is not a Strategic Advisor.',
                data: null
            });
        }

        // 3️⃣ Fetch UserAssociation entries for this advisor
        const associations = await UserAssociation.find({ strategic_advisor_id: user._id });

        if (!associations || associations.length === 0) {
            return res.status(200).json({
                status: true,
                message: 'No individual traders associated with this advisor.',
                data: []
            });
        }

        // Extract individual_ids from associations
        const individualIds = associations.map(a => a.individual_id);

        // 4️⃣ Fetch UserAccount for those individual_ids
        const userAccounts = await UserAccount.find({ individual_id: { $in: individualIds } });

        return res.status(200).json({
            status: true,
            message: 'Accounts retrieved successfully.',
            data: userAccounts
        });

    } catch (error) {
        console.error('❌ Error in /account_dashboard route:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error.',
            data: null
        });
    }
});

export default accountDashboardRoutes;
