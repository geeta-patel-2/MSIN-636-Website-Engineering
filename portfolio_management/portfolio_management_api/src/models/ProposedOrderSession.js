import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const proposedOrderSessionSchema = new mongoose.Schema({
    proposed_order_session_id: {
        type: String,
        default: uuidv4,
        unique: true,
    },
    proposed_order_session_created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    proposed_order_session_created_at: {
        type: Date,
        default: () => new Date(),
        required: true,
    }
});

const ProposedOrderSession = mongoose.models.ProposedOrderSession || mongoose.model('ProposedOrderSession', proposedOrderSessionSchema);
export default ProposedOrderSession;
