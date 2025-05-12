// Import required modules
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from "../src/config/db.js";
import User from "../src/models/user.js";
import UserAssociation from "../src/models/UserAssociation.js";

// Load environment variables
dotenv.config();

// Immediately-invoked async function to allow await at top-level
(async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        console.log('✅ Connected to MongoDB.');

        // Fetch all strategic advisors
        const advisors = await User.find({ user_type: 'Strategic Advisor' });
        if (advisors.length === 0) {
            console.log('⚠️ No Strategic Advisors found.');
            return;
        }
        console.log(`✅ Found ${advisors.length} Strategic Advisors.`);

        // Fetch all individual traders
        const traders = await User.find({ user_type: 'Individual Trader' });
        if (traders.length === 0) {
            console.log('⚠️ No Individual Traders found.');
            return;
        }
        console.log(`✅ Found ${traders.length} Individual Traders.`);

        // Shuffle traders array randomly
        const shuffledTraders = traders.sort(() => 0.5 - Math.random());

        // Distribute traders among advisors (round-robin style)
        const associations = [];

        for (let i = 0; i < shuffledTraders.length; i++) {
            const advisorIndex = i % advisors.length; // rotate advisors
            const advisor = advisors[advisorIndex];
            const trader = shuffledTraders[i];

            associations.push({
                strategic_advisor_id: advisor._id,
                individual_id: trader._id
            });
        }

        // Bulk insert associations
        const result = await UserAssociation.insertMany(associations, { ordered: false });
        console.log(`✅ Successfully created ${result.length} UserAssociations.`);

    } catch (err) {
        console.error('❌ Error occurred during user association population:', err);
    } finally {
        // Close DB connection
        await mongoose.connection.close();
        console.log('🔌 Disconnected from MongoDB.');
    }
})();
