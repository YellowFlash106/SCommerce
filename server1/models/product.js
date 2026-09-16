const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    image: String,
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    // Seller ownership
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    sellerName: {
        type: String,
        default: null,
    },
    // Approval workflow: pending | approved | rejected
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved', // admin-created products are auto-approved
    },
    adminNote: {
        type: String,
        default: null,
    },
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
