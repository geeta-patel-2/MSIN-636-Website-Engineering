// models/OpenOrder.js
import mongoose from 'mongoose';

const openOrderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAccount',
        required: true
    },
    holding_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AccountHoldings',
        default: null
    },
    order_quantity: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.0
    },
    order_market_value: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.0
    }
}, {
    timestamps: true
});

const OpenOrder = mongoose.models.OpenOrder || mongoose.model('OpenOrder', openOrderSchema);
export default OpenOrder;
