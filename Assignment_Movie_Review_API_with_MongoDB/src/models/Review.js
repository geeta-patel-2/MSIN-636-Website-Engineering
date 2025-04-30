// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    title: { type: String, required: true },
    reviewer: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 10 },
    review: { type: String, required: true },
    movie: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
