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

// ✅ Mark a single account as checked
accountDashboardRoutes.post('/mark_account_checked', async (req, res) => {
    try {
        const userId = req.user.user.id; // Logged-in user ID
        const { account_id } = req.body;

        // Validate account_id
        if (!account_id) {
            return res.status(400).json({
                status: false,
                message: 'account_id is required.',
                data: null
            });
        }

        // Find the account by account_id
        const account = await UserAccount.findOne({ account_id });

        if (!account) {
            return res.status(404).json({
                status: false,
                message: 'Account not found.',
                data: null
            });
        }

        // Check if this account belongs to the logged-in user (Individual Trader)
        if (account.individual_id.toString() !== userId) {
            return res.status(403).json({
                status: false,
                message: 'You are not authorized to check this account.',
                data: null
            });
        }

        // Mark the corresponding UserAssociation as checked
        const association = await UserAssociation.findOneAndUpdate(
            { individual_id: account.individual_id },
            { check_box: 'checked' },
            { new: true }
        );

        if (!association) {
            return res.status(404).json({
                status: false,
                message: 'User association not found.',
                data: null
            });
        }

        return res.status(200).json({
            status: true,
            message: 'Account marked as checked successfully.',
            data: association
        });

    } catch (error) {
        console.error('❌ Error in /mark_account_checked:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error.',
            data: null
        });
    }
});

// ✅ Mark ALL accounts belonging to the logged-in user as checked
accountDashboardRoutes.post('/mark_all_accounts_checked', async (req, res) => {
    try {
        const userId = req.user.userid; // Logged-in user ID

        // Mark all associations for this user as checked
        const result = await UserAssociation.updateMany(
            { individual_id: userId },
            { check_box: 'checked' }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({
                status: false,
                message: 'No user associations found to update.',
                data: null
            });
        }

        return res.status(200).json({
            status: true,
            message: 'All accounts marked as checked successfully.',
            data: { modifiedCount: result.modifiedCount }
        });

    } catch (error) {
        console.error('❌ Error in /mark_all_accounts_checked:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error.',
            data: null
        });
    }
});

// ✅ Fetch all accounts marked as checked by the logged-in user
accountDashboardRoutes.get('/checked_accounts', async (req, res) => {
    try {
        const userId = req.user.userid; // Logged-in user ID

        // Find all UserAssociations where individual_id is this user and checked
        const associations = await UserAssociation.find({
            individual_id: userId,
            check_box: 'checked'
        });

        if (!associations || associations.length === 0) {
            return res.status(200).json({
                status: true,
                message: 'No accounts marked as checked.',
                data: []
            });
        }

        // Get the account details for those checked associations
        const individualIds = associations.map(a => a.individual_id);
        const accounts = await UserAccount.find({ individual_id: { $in: individualIds } });

        return res.status(200).json({
            status: true,
            message: 'Checked accounts retrieved successfully.',
            data: accounts
        });

    } catch (error) {
        console.error('❌ Error in /checked_accounts:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error.',
            data: null
        });
    }
});

export default accountDashboardRoutes;
