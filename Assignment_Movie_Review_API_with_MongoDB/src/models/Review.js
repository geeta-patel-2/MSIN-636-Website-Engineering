// models/Review.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    title: { type: String, required: true },
    reviewer: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 10 },
    review: { type: String, required: true },
    movie: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);