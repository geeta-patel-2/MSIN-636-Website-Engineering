import mongoose from 'mongoose';

const proposedOrderSessionAccountHoldingsSchema = new mongoose.Schema({
    proposed_order_session_accounts_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProposedOrderSessionAccounts',
        required: true,
    },
    proposed_order_session_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProposedOrderSession',
        required: true,
    },
    holding_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AccountHoldings',
        required: false,
    },
    current_quantity: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.0000,
    },
    current_market_value: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.00,
    },
    order_quantity: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.0000,
    },
    order_market_value: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.00,
    },
    projected_quantity: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.0000,
    },
    projected_market_value: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.00,
    },
    gain_loss_value: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.00,
    },
    average_purchase_price: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.0000,
    }
});

const ProposedOrderSessionAccountHoldings =  mongoose.models.ProposedOrderSessionAccountHoldings || mongoose.model('ProposedOrderSessionAccountHoldings', proposedOrderSessionAccountHoldingsSchema);
export default ProposedOrderSessionAccountHoldings;
