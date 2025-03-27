import express from "express";
import {verifyToken} from '../utils/auth.js'
import Movie from "../models/Movie.js";

const moviesRoutes = express.Router();

// Create a Movie (protected)
moviesRoutes.post('/', verifyToken, async (req, res) => {
    const { title, description } = req.body;
    const movie = new Movie({ title, description, user: req.user.id });
    await movie.save();
    res.status(201).json(movie);
});

// Get Movies (Only user's movies)
moviesRoutes.get('/', verifyToken, async (req, res) => {
    const movies = await Movie.find({ user: req.user.id });
    res.json(movies);
});

// Update a Movie (protected, user can only modify own movies)
moviesRoutes.put('/:id', verifyToken, async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie || movie.user.toString() !== req.user.id)
        return res.status(403).json({ message: 'Forbidden' });

    movie.title = req.body.title || movie.title;
    movie.description = req.body.description || movie.description;
    await movie.save();
    res.json(movie);
});

// Delete a Movie (protected, user can only delete own movies)
moviesRoutes.delete('/:id', verifyToken, async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie || movie.user.toString() !== req.user.id)
        return res.status(403).json({ message: 'Forbidden' });

    await movie.remove();
    res.json({ message: 'Movie deleted' });
});

export default moviesRoutes;
