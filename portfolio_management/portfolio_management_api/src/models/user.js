// models/User.js
import mongoose from 'mongoose';
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    user_id: {
        type: Number,  // We use BigInt for large integers like user_id
        required: true,
        unique: true,  // Corresponds to the primary key in SQL
    },
    first_name: {
        type: String,
        required: true,
        maxlength: 50,  // Corresponds to the character varying(50) constraint in SQL
    },
    last_name: {
        type: String,
        required: true,
        maxlength: 50,  // Corresponds to the character varying(50) constraint in SQL
    },
    email_id: {
        type: String,
        required: true,
        unique: true,  // Corresponds to the uniqueness of the email field
    },
    joining_date: {
        type: Date,
        default: Date.now,  // Default is CURRENT_TIMESTAMP in SQL
        required: true,  // Corresponds to NOT NULL constraint
    },
    password: { type: String, required: true, select: false },
    user_type: {
        type: String,
        enum: ['Strategic Advisor', 'Individual Trader'],
        required: true,
        default: 'Individual Trader'
    }
}, {
    timestamps: false  // We manually handle `joining_date`, so no need for default timestamps
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Compare password method
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Create the model from the schema
const User = mongoose.models.Users || mongoose.model('Users', userSchema);

export default User;
