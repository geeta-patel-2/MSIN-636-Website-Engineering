/**
 * Mock data for movies
 */
let movies = [
    { movie_id: 1, movie_name: 'Love Aaj Kal', imdb_rating: 8.8 },
    { movie_id: 2, movie_name: 'Me Hoon Na', imdb_rating: 7.8 },
];

/**
 * Input validation helper
 */
const isValidMovie = ({ movie_name, imdb_rating }) => {
    return !(typeof movie_name !== 'string' ||
        movie_name.trim() === '' ||
        typeof imdb_rating !== 'number' ||
        imdb_rating < 0 ||
        imdb_rating > 10);
};

/**
 * Get all movies
 */
export const getMovies = (req, res) => {
    try {
        res.status(200).json(movies);
    } catch (err) {
        res.status(500).send('Server error while fetching movies');
    }
};

/**
 * Get a single movie by ID
 */
export const getMovieById = (req, res) => {
    try {
        const movie = movies.find(m => m.movie_id === parseInt(req.params.id));
        if (!movie) return res.status(404).send('Movie not found');
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).send('Server error while fetching the movie');
    }
};

/**
 * Add a new movie
 */
export const createMovie = (req, res) => {
    try {
        const { movie_name, imdb_rating } = req.body;

        if (!isValidMovie({ movie_name, imdb_rating })) {
            return res.status(400).send('Invalid input. movie_name must be a non-empty string and imdb_rating must be a number between 0 and 10.');
        }

        const maxId = movies.length ? Math.max(...movies.map(m => m.movie_id)) : 0;
        const newMovie = { movie_id: maxId + 1, movie_name, imdb_rating };
        movies.push(newMovie);

        res.status(201).json(newMovie);
    } catch (err) {
        res.status(500).send('Server error while adding the movie');
    }
};

/**
 * Update a movie's IMDb rating
 */
export const updateMovie = (req, res) => {
    try {
        const movie = movies.find(m => m.movie_id === parseInt(req.params.id));
        if (!movie) return res.status(404).send('Movie not found');

        const { imdb_rating } = req.body;
        if (typeof imdb_rating !== 'number' || imdb_rating < 0 || imdb_rating > 10) {
            return res.status(400).send('Invalid imdb_rating. It must be a number between 0 and 10.');
        }

        movie.imdb_rating = imdb_rating;
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).send('Server error while updating the movie');
    }
};

/**
 * Delete a movie
 */
export const deleteMovie = (req, res) => {
    try {
        const index = movies.findIndex(m => m.movie_id === parseInt(req.params.id));
        if (index === -1) return res.status(404).send('Movie not found');

        movies.splice(index, 1);
        res.status(204).send();
    } catch (err) {
        res.status(500).send('Server error while deleting the movie');
    }
};
