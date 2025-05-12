// Import required modules
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from "../src/config/db.js";
import UserAssociation from "../src/models/UserAssociation.js";

// Load environment variables
dotenv.config();

const updateCheckbox = async () => {
    try {
        await connectDB();

        const strategicAdvisorId = new mongoose.Types.ObjectId('67ea06556adec9d56f52bdde');

        const result = await UserAssociation.updateMany(
            { strategic_advisor_id: strategicAdvisorId },
            { $set: { check_box: 'checked' } }
        );

        console.log(`✅ Updated ${result.modifiedCount} UserAssociation document(s).`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during update:', error.message);
        process.exit(1);
    }
};

updateCheckbox();
