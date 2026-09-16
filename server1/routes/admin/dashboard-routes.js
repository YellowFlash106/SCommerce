const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../../controllers/admin/dashboard-controller');
const { authMidleware, adminMiddleware } = require('../../controllers/auth/auth-controller');

router.get('/stats', authMidleware, adminMiddleware, getDashboardStats);

module.exports = router;
