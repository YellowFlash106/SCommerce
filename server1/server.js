require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRouter = require('./routes/auth/auth-routes');

// Admin routes
const adminProductsRouter = require('./routes/admin/products-routes');
const adminOrderRouter = require('./routes/admin/order-routes');
const adminManagementRouter = require('./routes/admin/management-routes');
const adminDashboardRouter = require('./routes/admin/dashboard-routes');

// Seller routes
const sellerProductsRouter = require('./routes/seller/products-routes');

// Shop routes
const shopProductsRouter = require('./routes/shop/product-routes');
const shopCartRouter = require('./routes/shop/cart-routes');
const shopAddressRouter = require('./routes/shop/address-routes');
const shopOrderRouter = require('./routes/shop/order-routes');
const shopSearchRouter = require('./routes/shop/search-routes');
const shopReviewRouter = require('./routes/shop/review-routes');

// Common
// const commonFeatureRouter = require('./routes/common/feature-routes');

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(error => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (e.g. mobile apps, curl)
            if (!origin) return callback(null, true);
            // If no allowlist configured, allow all
            if (allowedOrigins.length === 0) return callback(null, true);
            // Only return the specific matched origin, never the full list
            if (allowedOrigins.includes(origin)) return callback(null, origin);
            return callback(new Error("Not allowed by CORS"));
        },
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders: [
            "Content-Type",
            'Authorization',
            'Cache-Control',
            'Express',
            'Pragma'
        ],
        credentials: true
    })
);

app.use(cookieParser());
app.use(express.json());

// Auth
app.use('/api/auth', authRouter);

// Admin
app.use('/api/admin/products', adminProductsRouter);
app.use('/api/admin/orders', adminOrderRouter);
app.use('/api/admin/management', adminManagementRouter);
app.use('/api/admin/dashboard', adminDashboardRouter);

// Seller
app.use('/api/seller/products', sellerProductsRouter);

// Shop
app.use('/api/shop/products', shopProductsRouter);
app.use('/api/shop/cart', shopCartRouter);
app.use('/api/shop/address', shopAddressRouter);
app.use('/api/shop/order', shopOrderRouter);
app.use('/api/shop/search', shopSearchRouter);
app.use('/api/shop/review', shopReviewRouter);

// Common
// app.use('/api/common/feature', commonFeatureRouter);

app.get('/health', (_req, res) => res.status(200).json({ ok: true }));

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
