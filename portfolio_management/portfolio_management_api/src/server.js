// index.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from "./routes/userRoutes.js";
import tickerSymbolRoutes from "./routes/tickerSymbolRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));

// Routes
app.use('/api', userRoutes); // Prefix user routes with /api
app.use('/api', tickerSymbolRoutes); // Prefix ticker routes with /api

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
