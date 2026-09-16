const express = require('express');
const router = express.Router();

const {
    getAllOrdersOfAllUsers,
    getAllOrderDetailsForAdmin,
    updateOrderStatus
} = require('../../controllers/admin/order-controller');

const { authMidleware, adminMiddleware } = require('../../controllers/auth/auth-controller');

// All admin order routes are protected
router.get('/get', authMidleware, adminMiddleware, getAllOrdersOfAllUsers);
router.get('/details/:id', authMidleware, adminMiddleware, getAllOrderDetailsForAdmin);
router.put('/update/:id', authMidleware, adminMiddleware, updateOrderStatus);

module.exports = router;
