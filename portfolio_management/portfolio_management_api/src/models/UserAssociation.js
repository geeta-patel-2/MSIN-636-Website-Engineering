import mongoose from 'mongoose';
import User from "./user.js";

const userAssociationSchema = new mongoose.Schema({
    strategic_advisor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', // reference to Users collection
        required: true
    },
    individual_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', // reference to Users collection
        required: true
    },
    check_box: {
        type: String,
        enum: ['checked', 'not checked'],
        default: 'not checked'
    }
});

// Add pre-save hook
userAssociationSchema.pre('save', async function (next) {
    try {
        // Check strategic advisor exists and is of correct type
        const advisor = await User.findOne({
            _id: this.strategic_advisor_id,
            user_type: 'Strategic Advisor'
        });
        if (!advisor) {
            return next(new Error('Provided strategic_advisor_id is not a valid Strategic Advisor user.'));
        }

        // Check individual exists and is of correct type
        const individual = await User.findOne({
            _id: this.individual_id,
            user_type: 'Individual Trader'
        });
        if (!individual) {
            return next(new Error('Provided individual_id is not a valid Individual Trader user.'));
        }

        // Check for duplicate association
        const existingAssociation = await mongoose.models.UserAssociations.findOne({
            individual_id: this.individual_id
        });

        if (existingAssociation && existingAssociation._id.toString() !== this._id.toString()) {
            return next(new Error('An association already exists for this individual_id.'));
        }

        next();
    } catch (err) {
        next(err);
    }
});

userAssociationSchema.pre('findOneAndUpdate', async function (next) {
    try {
        const update = this.getUpdate();

        if (update.strategic_advisor_id) {
            const advisor = await User.findOne({
                _id: update.strategic_advisor_id,
                user_type: 'Strategic Advisor'
            });
            if (!advisor) {
                return next(new Error('Provided strategic_advisor_id is not a valid Strategic Advisor user.'));
            }
        }

        if (update.individual_id) {
            const individual = await User.findOne({
                _id: update.individual_id,
                user_type: 'Individual Trader'
            });
            if (!individual) {
                return next(new Error('Provided individual_id is not a valid Individual Trader user.'));
            }

            const existingAssociation = await mongoose.models.UserAssociations.findOne({
                individual_id: update.individual_id
            });

            if (existingAssociation && existingAssociation._id.toString() !== this.getQuery()._id.toString()) {
                return next(new Error('An association already exists for this individual_id.'));
            }
        }

        next();
    } catch (err) {
        next(err);
    }
});

const UserAssociation = mongoose.models.UserAssociations || mongoose.model('UserAssociations', userAssociationSchema);

export default UserAssociation;
