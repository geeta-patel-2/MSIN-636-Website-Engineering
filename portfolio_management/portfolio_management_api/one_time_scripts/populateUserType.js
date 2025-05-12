import mongoose from 'mongoose';
import User from "../src/models/user.js";
import connectDB from "../src/config/db.js";
//import User from './models/User.js';  // adjust the path as needed

async function populateUserType() {
    try {
        //Connect with Database
        await connectDB();

        // Fetch all users
        const users = await User.find();
        const totalUsers = users.length;

        console.log(`Total users: ${totalUsers}`);

        const numStrategicAdvisors = Math.floor(totalUsers * 0.05);
        console.log(`Will assign ${numStrategicAdvisors} Strategic Advisors.`);

        // Shuffle users randomly
        const shuffledUsers = users.sort(() => 0.5 - Math.random());

        // First N get "Strategic Advisor", rest get "Individual Trader"
        const promises = shuffledUsers.map((user, index) => {
            user.user_type = index < numStrategicAdvisors ? 'Strategic Advisor' : 'Individual Trader';
            return user.save();
        });

        await Promise.all(promises);

        console.log(`Successfully updated all users with user_type.`);
        mongoose.disconnect();
    } catch (err) {
        console.error(err);
        mongoose.disconnect();
    }
}

populateUserType();
