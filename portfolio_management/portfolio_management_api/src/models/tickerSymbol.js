// models/TickerDetail.js
import mongoose from 'mongoose';

// Define the schema for the 'ticker_details' collection
const tickerDetailSchema = new mongoose.Schema({
    ticker_id: {
        type: Number, // MongoDB doesn't natively support BigInt, but Mongoose allows it
        required: true,
        unique: true,  // This is the primary key (unique constraint)
    },
    isin: {
        type: String,
        maxlength: 15,
        default: null,
    },
    cusip: {
        type: String,
        maxlength: 15,
        default: null,
    },
    ticker_symbol: {
        type: String,
        required: true,
        unique: true,  // Unique constraint for ticker_symbol
    },
    current_price: {
        type: mongoose.Schema.Types.Decimal128, // Use Decimal128 to store high-precision numeric values
        default: 0.000000,
        required: true,
    },
    last_day_closing_price: {
        type: mongoose.Schema.Types.Decimal128, // Use Decimal128 to store high-precision numeric values
        default: 0.000000,
        required: true,
    },
    company_name: {
        type: String,
        maxlength: 300,
        default: null,
    },
    company_description: {
        type: String,
        maxlength: 1000,
        default: null,
    },
    is_deleted: {
        type: Boolean,
        maxlength: 1000,
        default: false,
    }
}, {
    timestamps: false,  // We are manually managing the timestamps
});

// Create a model for the 'ticker_details' collection using the schema
const TickerSymbol = mongoose.model('ticker_symbols', tickerDetailSchema);

export default TickerSymbol;
