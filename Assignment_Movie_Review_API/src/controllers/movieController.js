
/**
 * Mock data for movies
 *
 * */
let movies = [
    { id: 1, title: 'Love Aaj Kal', rating: 8.8 },
    { id: 2, title: 'Me Hoon Na', rating: 7.8 },
];


/**
 * Method for getting all movie reviews
 * */
export const getMovies = (req, res) => {
    // Return the movies array as JSON response with status 200
    res.status(200).json(movies);
};

/**
 * Method for getting a single movie review by ID
 * */
export const getMovieById = (req, res) => {
    const movie = movies.find((m) => m.id === parseInt(req.params.id));
    if (!movie) return res.status(404).send('Movie not found');
    res.status(200).json(movie);
};

/**
 * Method for adding a new movie review
 * */
export const createMovie = (req, res) => {
    const { title, rating } = req.body;
    if (!title || !rating) {
        return res.status(400).send('Title and rating are required');
    }

    const maxId = Math.max(...movies.map(obj => obj.id));
    const newMovie = { id: maxId + 1, title, rating };
    movies.push(newMovie);

    res.status(201).json(newMovie);
};


/**
 * Method for updating a movie review's rating
 * */
export const updateMovie = (req, res) => {
    const movie = movies.find((m) => m.id === parseInt(req.params.id));
    if (!movie) {
        return res.status(404).send('Movie not found');
    }
    movie.rating = req.body.rating;
    res.status(200).json(movie);
};


/**
 * Method for deleting a movie review
 * */
export const deleteMovie = (req, res) => {
    const movieIndex = movies.findIndex((m) => m.id === parseInt(req.params.id));
    if (movieIndex === -1){
        return res.status(404).send('Movie not found');
    }
    movies.splice(movieIndex, 1);
    res.status(204).send();
};
