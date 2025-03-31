// routes/userRoutes.js
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// POST route to create a new user
router.post('/users', async (req, res) => {
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
router.get('/users/search', async (req, res) => {
    try {
        // Extract the search string from query parameters
        const { search_string } = req.query;

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

        // Perform the search in the MongoDB database using the constructed query
        const users = await User.find(searchQuery);

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found matching the search criteria.' });
        }

        // Return the matching users
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE route to delete a user by user_id
router.delete('/users/:user_id', async (req, res) => {
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

export default router;
