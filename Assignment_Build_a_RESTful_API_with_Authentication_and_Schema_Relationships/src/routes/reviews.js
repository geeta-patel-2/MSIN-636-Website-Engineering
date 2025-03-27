import express from 'express';
import {verifyToken} from '../utils/auth.js'
import Review from "../models/Review.js";
import Movie from "../models/Movie.js";

const reviewsRoutes = express.Router();

// Create a Review
reviewsRoutes.post('/', verifyToken, async (req, res) => {
    const { content, rating, movieId } = req.body;
    const movie = await Movie.findById(movieId);

    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    const review = new Review({
        content,
        rating,
        movie: movieId,
        user: req.user.id
    });
    await review.save();
    res.status(201).json(review);
});

// Get Reviews for a Movie
reviewsRoutes.get('/:movieId', async (req, res) => {
    const reviews = await Review.find({ movie: req.params.movieId });
    res.json(reviews);
});

export default reviewsRoutes;
