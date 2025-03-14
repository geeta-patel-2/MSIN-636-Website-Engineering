// routes/reviewRoutes.js
const express = require('express');
const Review = require('../models/Review');

const router = express.Router();

// GET all reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching reviews' });
    }
});

// POST a new review
router.post('/', async (req, res) => {
    try {
        const { title, reviewer, rating, review, movie } = req.body;

        const newReview = new Review({
            title,
            reviewer,
            rating,
            review,
            movie
        });

        await newReview.save();
        res.status(201).json(newReview);
    } catch (err) {
        res.status(400).json({ message: 'Error creating review' });
    }
});

// PUT (update) a review
router.put('/:id', async (req, res) => {
    try {
        const { title, reviewer, rating, review, movie } = req.body;
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            { title, reviewer, rating, review, movie },
            { new: true }
        );
        res.status(200).json(updatedReview);
    } catch (err) {
        res.status(400).json({ message: 'Error updating review' });
    }
});

// DELETE a review
router.delete('/:id', async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Review deleted' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting review' });
    }
});

module.exports = router;
