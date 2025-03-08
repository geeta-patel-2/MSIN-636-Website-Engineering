# Movie Review API

This is a simple RESTful API for managing movie reviews. You can retrieve all movies, retrieve a single movie, add new reviews, update movie ratings, and delete reviews.

## How to Install and Run

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the server using Nodemon (auto-restarts on file changes).

API Endpoints:
- **GET /movies**: Retrieve all movie reviews.
- **GET /movie/:id**: Retrieve a single movie review by its ID.
- **POST /movies**: Submit a new movie review (requires title and rating).
- **PUT /movie/:id**: Update the rating of a movie.
- **DELETE /movie/:id**: Delete a movie review.

## Technologies Used
- Express.js
- Nodemon (for auto-restarting the server)
- Morgan (for logging HTTP requests)
- dotenv (for managing environment variables)
