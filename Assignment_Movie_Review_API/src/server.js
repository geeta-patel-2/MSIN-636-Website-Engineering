import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import moviesRoute from './routes/moviesRoutes.js';

dotenv.config(); // Configuring dotenv to load environment variables from the .env file

// Initialize an Express application and get port from .env file
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
/**
 *  Logging HTTP requests using Morgan (shows in the console) <br/>
 *  Middleware to parse incoming JSON payloads into JavaScript objects
* */
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/movies', moviesRoute); //Use the moviesRoute for all routes starting with /movies


// Start the server

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
