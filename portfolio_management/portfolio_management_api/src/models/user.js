// models/User.js
import mongoose from 'mongoose';

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
    }
}, {
    timestamps: false  // We manually handle `joining_date`, so no need for default timestamps
});

// Create the model from the schema
const User = mongoose.model('Users', userSchema);

export default User;
