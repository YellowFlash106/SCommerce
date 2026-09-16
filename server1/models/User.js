const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'seller'],
        default: 'user'
    },
    // Seller-specific fields
    isApprovedSeller: {
        type: Boolean,
        default: false,
    },
    sellerStatus: {
        // pending | approved | rejected
        type: String,
        default: null,
    },
    storeName: {
        type: String,
        default: null,
    },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
module.exports = User;
