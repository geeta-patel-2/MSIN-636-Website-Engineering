import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import reviewRoutes from "./routes/reviewRoutes.js";

// server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const reviewRoutes = require('./routes/reviewRoutes');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    dbName: "test",
    appName: "Movie-Management",
    //Put name of your application
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error: ', err));

// Use routes
app.use('/api/reviews', reviewRoutes);
app.get("/", (req, res) => res.send("Express on Vercel"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));