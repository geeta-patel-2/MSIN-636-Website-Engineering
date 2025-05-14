import mongoose from 'mongoose';
import User from './user.js'; // Adjust the path to your User model

const userAccountSchema = new mongoose.Schema({
    individual_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
        unique: true // Enforce uniqueness at DB level too
    },
    account_id: {
        type: String,
        required: true,
        unique: true
    },
    projected_market_value: {
        type: Number,
        required: true
    },
    un_realized_gain_loss: {
        type: Number,
        required: true
    },
    liquid_cash_amount: {
        type: Number,
        required: true
    }
});

// ✅ Pre-save validation hook
userAccountSchema.pre('save', async function (next) {
    try {
        // Check if individual_id refers to a valid 'Individual Trader'
        const user = await User.findOne({
            _id: this.individual_id,
            user_type: 'Individual Trader'
        });

        if (!user) {
            return next(new Error('Provided individual_id is not a valid Individual Trader user.'));
        }

        // Check for duplicate individual_id (unless updating same doc)
        const existingAccount = await mongoose.models.UserAccounts.findOne({
            individual_id: this.individual_id
        });

        if (existingAccount && existingAccount._id.toString() !== this._id.toString()) {
            return next(new Error('An account already exists for this individual_id.'));
        }

        next();
    } catch (err) {
        next(err);
    }
});

// ✅ Optional: Add a similar pre('findOneAndUpdate') hook if you allow updates via findOneAndUpdate
userAccountSchema.pre('findOneAndUpdate', async function (next) {
    try {
        const update = this.getUpdate();

        if (update.individual_id) {
            const user = await User.findOne({
                _id: update.individual_id,
                user_type: 'Individual Trader'
            });

            if (!user) {
                return next(new Error('Provided individual_id is not a valid Individual Trader user.'));
            }

            const existingAccount = await mongoose.models.UserAccounts.findOne({
                individual_id: update.individual_id
            });

            const updatingId = this.getQuery()._id?.toString();

            if (existingAccount && existingAccount._id.toString() !== updatingId) {
                return next(new Error('An account already exists for this individual_id.'));
            }
        }

        next();
    } catch (err) {
        next(err);
    }
});

const UserAccount = mongoose.models.UserAccounts || mongoose.model('UserAccounts', userAccountSchema);


export default UserAccount;
