import express from 'express';
import moviesRoute from "routes/moviesRoutes.js";

const app = express();
app.use(express.json());

// Movie Routes
app.use('/movies', moviesRoute);

export default app;
