import mongoose from 'mongoose';

const accountHoldingsSchema = new mongoose.Schema({
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAccounts',  // Reference to UserAccount schema
        required: true
    },
    ticker_symbol: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TickerSymbol',  // Reference to TickerDetail schema
        required: true
    },
    current_quantity: {
        type: mongoose.Decimal128,
        default: 0.0,
        get: v => v ? parseFloat(v.toString()).toFixed(4) : 0.0000
    },
    current_market_value: {
        type: mongoose.Decimal128,
        default: 0.0,
        get: v => v ? parseFloat(v.toString()).toFixed(2) : 0.0000
    },
    order_quantity: {
        type: mongoose.Decimal128,
        default: 0.0,
        get: v => v ? parseFloat(v.toString()).toFixed(4) : 0.0000
    },
    order_market_value: {
        type: mongoose.Decimal128,
        default: 0.0,
        get: v => v ? parseFloat(v.toString()).toFixed(2) : 0.0000
    },
    projected_quantity: {
        type: mongoose.Decimal128,
        default: 0.0,
        get: v => v ? parseFloat(v.toString()).toFixed(4) : 0.0000
    },
    projected_market_value: {
        type: mongoose.Decimal128,
        default: 0.0,
        get: v => v ? parseFloat(v.toString()).toFixed(2) : 0.0000
    },
    gain_loss_value: {
        type: mongoose.Decimal128,
        default: 0.0,
        get: v => v ? parseFloat(v.toString()).toFixed(2) : 0.00
    },
    average_purchase_price: {
        type: mongoose.Decimal128,
        default: 0.0,
        get: v => v ? parseFloat(v.toString()).toFixed(4) : 0.0000
    }
}, {
    timestamps: true,  // Optional: adds createdAt and updatedAt
    toJSON: { getters: true },
    toObject: { getters: true }
});

// Compile the model (avoid OverwriteModelError)
const AccountHoldings = mongoose.models.AccountHoldings || mongoose.model('AccountHoldings', accountHoldingsSchema);

export default AccountHoldings;
