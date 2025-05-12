// Import dependencies
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import connectDB from "../src/config/db.js";
import User from "../src/models/user.js";
import UserAccount from "../src/models/UserAccounts.js"; // For generating unique account IDs

// Load env variables
dotenv.config();

(async () => {
    try {
        // Connect to database
        await connectDB();
        console.log('✅ Connected to MongoDB.');

        // Fetch all Individual Traders
        const traders = await User.find({ user_type: 'Individual Trader' });

        if (traders.length === 0) {
            console.log('⚠️ No Individual Traders found.');
            return;
        }

        console.log(`✅ Found ${traders.length} Individual Traders.`);

        const accountsToInsert = [];

        for (const trader of traders) {
            // Generate projected market value: 250,000 – 20,000,000
            const projectedMarketValue = Math.floor(Math.random() * (20000000 - 250000 + 1)) + 250000;

            // Generate un_realized_gain_loss: -5% to +20% of projectedMarketValue
            const percentChange = (Math.random() * (0.20 + 0.05)) - 0.05; // random between -0.05 and +0.20
            const unrealizedGainLoss = Math.floor(projectedMarketValue * percentChange);

            // Generate liquid cash: 0 – 500,000
            const liquidCash = Math.floor(Math.random() * (500000 + 1));

            accountsToInsert.push({
                individual_id: trader._id,
                account_id: uuidv4(), // Generate unique account id
                projected_market_value: projectedMarketValue,
                un_realized_gain_loss: unrealizedGainLoss,
                liquid_cash_amount: liquidCash
            });
        }

        // Bulk insert accounts
        const result = await UserAccount.insertMany(accountsToInsert, { ordered: false });
        console.log(`✅ Successfully created ${result.length} UserAccounts.`);

    } catch (err) {
        console.error('❌ Error while populating user accounts:', err);
    } finally {
        // Close DB connection
        await mongoose.connection.close();
        console.log('🔌 Disconnected from MongoDB.');
    }
})();
