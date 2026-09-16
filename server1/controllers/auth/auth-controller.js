const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'CLIENT_SECRET_KEY';

// register
const registerUser = async (req, res) => {
    const { userName, email, password, role, storeName } = req.body;

    try {
        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.json({
                success: false,
                message: "User already exists with the same email! Please try again"
            });
        }

        // Only allow 'user' or 'seller' on self-registration; admin is set manually
        const allowedRoles = ['user', 'seller'];
        const assignedRole = allowedRoles.includes(role) ? role : 'user';

        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            userName,
            email,
            password: hashPassword,
            role: assignedRole,
            // Seller-specific: start as pending approval
            sellerStatus: assignedRole === 'seller' ? 'pending' : null,
            isApprovedSeller: false,
            storeName: assignedRole === 'seller' ? (storeName || userName) : null,
        });
        await newUser.save();

        res.status(200).json({
            success: true,
            message: assignedRole === 'seller'
                ? "Seller registration submitted! Please wait for admin approval before you can list products."
                : "Registration successful"
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured"
        });
    }
};


// login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const checkUser = await User.findOne({ email });
        if (!checkUser) return res.json({
            success: false,
            message: "User doesn't exist! Please register first",
        });

        const checkPassMatch = await bcrypt.compare(password, checkUser.password);
        if (!checkPassMatch) return res.json({
            success: false,
            message: "Password doesn't match! Please try again",
        });

        // Block unapproved sellers from logging into the seller panel
        // (they can still log in, but sellerStatus will be in the token so frontend can handle it)
        const token = jwt.sign({
            id: checkUser._id,
            role: checkUser.role,
            email: checkUser.email,
            userName: checkUser.userName,
            isApprovedSeller: checkUser.isApprovedSeller,
            sellerStatus: checkUser.sellerStatus,
            storeName: checkUser.storeName,
        }, JWT_SECRET, { expiresIn: "60m" });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/'
        }).json({
            success: true,
            message: "Logged in successfully",
            user: {
                id: checkUser._id,
                role: checkUser.role,
                email: checkUser.email,
                userName: checkUser.userName,
                isApprovedSeller: checkUser.isApprovedSeller,
                sellerStatus: checkUser.sellerStatus,
                storeName: checkUser.storeName,
            }
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured"
        });
    }
};


// logout
const logoutUser = (req, res) => {
    res.clearCookie('token').json({
        success: true,
        message: "Logged out successfully",
    });
};


// auth middleware — verifies JWT from cookie
const authMidleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({
        success: false,
        message: "Unauthorised user!",
    });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Unauthorised user!",
        });
    }
};


// admin-only middleware
const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admins only.",
        });
    }
    next();
};


// approved-seller-only middleware
const sellerMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'seller') {
        return res.status(403).json({
            success: false,
            message: "Access denied. Sellers only.",
        });
    }
    if (!req.user.isApprovedSeller) {
        return res.status(403).json({
            success: false,
            message: "Your seller account is pending admin approval.",
        });
    }
    next();
};


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    authMidleware,
    adminMiddleware,
    sellerMiddleware,
};
