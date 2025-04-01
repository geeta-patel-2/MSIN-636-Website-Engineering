// routes/userRoutes.js
import express from 'express';
import User from '../models/User.js';

const userRouter = express.Router();

// POST route to create a new user
userRouter.post('/users', async (req, res) => {
    try {
        const { user_id, first_name, last_name, email_id, joining_date } = req.body;

        const newUser = new User({
            user_id,
            first_name,
            last_name,
            email_id,
            joining_date: joining_date || Date.now(),
        });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// GET route to search users by a given string in first_name, last_name, or email_id
userRouter.get('/users/search', async (req, res) => {
    try {
        // Extract the search string and pagination parameters from query parameters
        const { search_string, is_paginated = false, page = 1, rows_per_page = 10 } = req.query;

        // Checking if search String is not null
        if (!search_string) {
            return res.status(400).json({ message: 'Please provide a search string.' });
        }

        // Checking if search String is not blank
        if (search_string.trim().length === 0) {
            return res.status(400).json({ message: 'Search string can not be empty.' });
        }

        // Build the search query to look for the string in first_name, last_name, or email_id
        const searchQuery = {
            $or: [
                { first_name: { $regex: search_string, $options: 'i' } },  // Case-insensitive search for first name
                { last_name: { $regex: search_string, $options: 'i' } },   // Case-insensitive search for last name
                { email_id: { $regex: search_string, $options: 'i' } }      // Case-insensitive search for email
            ]
        };

        // If pagination is enabled
        if (is_paginated) {
            // Skip the appropriate number of documents based on the page number
            const skip = (page - 1) * rows_per_page;

            // Fetch paginated results
            const users = await User.find(searchQuery)
                .skip(skip)
                .limit(Number(rows_per_page));

            // Get the total count of matching records (without pagination)
            const total = await User.countDocuments(searchQuery);

            return res.json({
                page,
                rows_per_page,
                total,
                users
            });
        } else {
            // If pagination is not requested, return all matching users
            const users = await User.find(searchQuery);
            return res.json({
                page: 1,
                rows_per_page: users.length,
                total : users.length,
                users
            });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});


// DELETE route to delete a user by user_id
userRouter.delete('/users/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;

        // Attempt to delete the user by user_id
        const user = await User.findOneAndDelete({ user_id }, null);

        // Checking if found the delete user or not.
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return a success message
        res.status(200).json({ message: `User with ID ${user_id} has been deleted successfully.` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default userRouter;
