const User = require('../../models/User');
const Product = require('../../models/product.js');
const Order = require('../../models/Order');

// ─── USERS ────────────────────────────────────────────────────────────────────

// Get all regular users (role = 'user')
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        res.status(200).json({ success: true, data: users });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Error occured" });
    }
};

// Get all sellers (role = 'seller')
const getAllSellers = async (req, res) => {
    try {
        const sellers = await User.find({ role: 'seller' }).select('-password');
        res.status(200).json({ success: true, data: sellers });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Error occured" });
    }
};

// Delete any user or seller by ID (admin cannot delete another admin)
const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.role === 'admin') {
            return res.status(403).json({ success: false, message: "Cannot delete an admin account" });
        }

        await User.findByIdAndDelete(id);

        // Also delete all products that belong to this seller
        if (user.role === 'seller') {
            await Product.deleteMany({ sellerId: id });
        }

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Error occured" });
    }
};

// Approve or reject a seller account
const updateSellerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'approved' | 'rejected'

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status. Use 'approved' or 'rejected'" });
        }

        const seller = await User.findOne({ _id: id, role: 'seller' });
        if (!seller) {
            return res.status(404).json({ success: false, message: "Seller not found" });
        }

        seller.sellerStatus = status;
        seller.isApprovedSeller = status === 'approved';
        await seller.save();

        res.status(200).json({
            success: true,
            message: `Seller account ${status}`,
            data: {
                id: seller._id,
                userName: seller.userName,
                email: seller.email,
                sellerStatus: seller.sellerStatus,
                isApprovedSeller: seller.isApprovedSeller,
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Error occured" });
    }
};

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

// Get all products pending approval (from sellers)
const getPendingProducts = async (req, res) => {
    try {
        const products = await Product.find({ approvalStatus: 'pending' }).populate('sellerId', 'userName email storeName');
        res.status(200).json({ success: true, data: products });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Error occured" });
    }
};

// Approve or reject a seller product
const updateProductApproval = async (req, res) => {
    try {
        const { id } = req.params;
        const { approvalStatus, adminNote } = req.body; // 'approved' | 'rejected'

        if (!['approved', 'rejected'].includes(approvalStatus)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        product.approvalStatus = approvalStatus;
        product.adminNote = adminNote || null;
        await product.save();

        res.status(200).json({
            success: true,
            message: `Product ${approvalStatus}`,
            data: product,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Error occured" });
    }
};

// Admin deletes any product
const adminDeleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Error occured" });
    }
};

// ─── ORDERS ───────────────────────────────────────────────────────────────────

// Get all orders enriched with user info
const getAllOrdersWithUserInfo = async (req, res) => {
    try {
        const orders = await Order.find({});

        if (!orders.length) {
            return res.status(200).json({ success: true, data: [] });
        }

        // Attach user info to each order
        const enriched = await Promise.all(
            orders.map(async (order) => {
                const user = await User.findById(order.userId).select('userName email role');
                return {
                    ...order.toObject(),
                    userInfo: user || { userName: 'Deleted User', email: '-', role: '-' },
                };
            })
        );

        res.status(200).json({ success: true, data: enriched });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Error occured" });
    }
};

// Get orders for a specific user (admin view)
const getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const orders = await Order.find({ userId });
        res.status(200).json({
            success: true,
            data: { user, orders }
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Error occured" });
    }
};

// Get all products listed by a specific seller (admin view)
const getProductsBySeller = async (req, res) => {
    try {
        const { sellerId } = req.params;
        const seller = await User.findOne({ _id: sellerId, role: 'seller' }).select('-password');
        if (!seller) {
            return res.status(404).json({ success: false, message: "Seller not found" });
        }

        const products = await Product.find({ sellerId });
        res.status(200).json({
            success: true,
            data: { seller, products }
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Error occured" });
    }
};

module.exports = {
    getAllUsers,
    getAllSellers,
    deleteUserById,
    updateSellerStatus,
    getPendingProducts,
    updateProductApproval,
    adminDeleteProduct,
    getAllOrdersWithUserInfo,
    getOrdersByUser,
    getProductsBySeller,
};
