import express from 'express';
import * as movieController from '../controllers/movieController.js';

const router = express.Router();

router
    .route('/')
    .get(movieController.getMovies)
    .post(movieController.createMovie);

router
    .route('/:id')
    .get(movieController.getMovieById)
    .put(movieController.updateMovie)
    .delete(movieController.deleteMovie);

export default router;