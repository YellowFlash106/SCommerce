const express = require('express');
const router = express.Router();

const {
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
} = require('../../controllers/admin/management-controller');

const { authMidleware, adminMiddleware } = require('../../controllers/auth/auth-controller');

// All routes protected — must be logged in AND be admin
router.use(authMidleware, adminMiddleware);

// Users
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUserById);

// Sellers
router.get('/sellers', getAllSellers);
router.delete('/sellers/:id', deleteUserById); // reuses same controller
router.put('/sellers/:id/status', updateSellerStatus);
router.get('/sellers/:sellerId/products', getProductsBySeller);

// Product approvals
router.get('/products/pending', getPendingProducts);
router.put('/products/:id/approval', updateProductApproval);
router.delete('/products/:id', adminDeleteProduct);

// Orders with user info
router.get('/orders', getAllOrdersWithUserInfo);
router.get('/orders/user/:userId', getOrdersByUser);

module.exports = router;
