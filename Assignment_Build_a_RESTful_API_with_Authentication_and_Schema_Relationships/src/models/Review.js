import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model('Review', reviewSchema);
