import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const proposedOrderSessionAccountsSchema = new mongoose.Schema({
    proposed_order_session_accounts_id: {
        type: String,
        default: uuidv4,
        unique: true,
    },
    proposed_order_session_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProposedOrderSession',
        required: true,
    },
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAccount',
        required: true,
    },
    current_market_value: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.00,
    },
    projected_market_value: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.00,
    },
    total_gain_loss_value: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.00,
    }
});

const ProposedOrderSessionAccounts = mongoose.models.ProposedOrderSessionAccounts ||  mongoose.model('ProposedOrderSessionAccounts', proposedOrderSessionAccountsSchema);
export default ProposedOrderSessionAccounts;
