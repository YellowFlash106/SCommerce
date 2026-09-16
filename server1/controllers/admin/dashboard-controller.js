const User = require('../../models/User');
const Product = require('../../models/product.js');
const Order = require('../../models/Order');

const getDashboardStats = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        // Counts
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalSellers = await User.countDocuments({ role: 'seller' });
        const approvedSellers = await User.countDocuments({ role: 'seller', isApprovedSeller: true });
        const pendingSellers = await User.countDocuments({ role: 'seller', sellerStatus: 'pending' });
        const totalProducts = await Product.countDocuments({ approvalStatus: 'approved' });
        const pendingProducts = await Product.countDocuments({ approvalStatus: 'pending' });

        // Revenue — this month (only paid orders)
        const thisMonthOrders = await Order.find({
            orderDate: { $gte: startOfMonth },
            paymentStatus: 'paid',
        });
        const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        // Revenue — last month
        const lastMonthOrders = await Order.find({
            orderDate: { $gte: startOfLastMonth, $lte: endOfLastMonth },
            paymentStatus: 'paid',
        });
        const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        // Revenue change %
        const revenueChange = lastMonthRevenue === 0
            ? 100
            : (((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1);

        // Total all-time revenue
        const allOrders = await Order.find({ paymentStatus: 'paid' });
        const totalRevenue = allOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        // Total orders counts
        const totalOrders = await Order.countDocuments();
        const thisMonthOrderCount = thisMonthOrders.length;

        // Recent 5 orders
        const recentOrders = await Order.find()
            .sort({ orderDate: -1 })
            .limit(5)
            .lean();

        // Attach user info to recent orders
        const enrichedRecent = await Promise.all(
            recentOrders.map(async (order) => {
                const user = await User.findById(order.userId).select('userName email');
                return {
                    ...order,
                    userInfo: user || { userName: 'Deleted User', email: '-' },
                };
            })
        );

        // Monthly revenue for last 6 months (for chart)
        const monthlyRevenue = [];
        for (let i = 5; i >= 0; i--) {
            const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
            const orders = await Order.find({
                orderDate: { $gte: start, $lte: end },
                paymentStatus: 'paid',
            });
            const revenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
            monthlyRevenue.push({
                month: start.toLocaleString('default', { month: 'short' }),
                revenue: parseFloat(revenue.toFixed(2)),
                orders: orders.length,
            });
        }

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalSellers,
                approvedSellers,
                pendingSellers,
                totalProducts,
                pendingProducts,
                totalRevenue: parseFloat(totalRevenue.toFixed(2)),
                thisMonthRevenue: parseFloat(thisMonthRevenue.toFixed(2)),
                lastMonthRevenue: parseFloat(lastMonthRevenue.toFixed(2)),
                revenueChange: parseFloat(revenueChange),
                totalOrders,
                thisMonthOrderCount,
                recentOrders: enrichedRecent,
                monthlyRevenue,
            },
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: 'Error fetching dashboard stats' });
    }
};

module.exports = { getDashboardStats };
