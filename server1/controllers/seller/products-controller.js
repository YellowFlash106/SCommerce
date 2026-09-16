const { ImageUploadUtil } = require('../../healpers/cloudinary');
const Product = require('../../models/product.js');

// Upload image (shared with admin)
const handleImageUpload = async (req, res) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const url = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await ImageUploadUtil(url);
        res.json({
            success: true,
            message: "File uploaded successfully",
            result
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error occured"
        });
    }
};

// Seller submits a new product (goes to 'pending' until admin approves)
const addSellerProduct = async (req, res) => {
    try {
        const {
            image, title, description, category, brand,
            price, salePrice, totalStock,
        } = req.body;

        const newProduct = new Product({
            image, title, description, category, brand,
            price, salePrice, totalStock,
            sellerId: req.user.id,
            sellerName: req.user.storeName || req.user.userName,
            approvalStatus: 'pending', // always starts pending
        });
        await newProduct.save();

        res.status(201).json({
            success: true,
            message: "Product submitted for admin approval",
            data: newProduct,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error occured" });
    }
};

// Seller fetches only their own products
const fetchSellerProducts = async (req, res) => {
    try {
        const products = await Product.find({ sellerId: req.user.id });
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error occured" });
    }
};

// Seller edits their own product (resets to pending on edit)
const editSellerProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            image, title, description, category,
            brand, price, salePrice, totalStock,
        } = req.body;

        const product = await Product.findOne({ _id: id, sellerId: req.user.id });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found or you don't own it",
            });
        }

        product.title = title || product.title;
        product.description = description || product.description;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.image = image || product.image;
        product.price = price === '' ? 0 : price || product.price;
        product.salePrice = salePrice === '' ? 0 : salePrice || product.salePrice;
        product.totalStock = totalStock || product.totalStock;
        // Re-submit for approval when seller edits
        product.approvalStatus = 'pending';
        product.adminNote = null;

        await product.save();
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error occured" });
    }
};

// Seller deletes their own product
const deleteSellerProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findOneAndDelete({ _id: id, sellerId: req.user.id });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found or you don't own it",
            });
        }
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error occured" });
    }
};

module.exports = {
    handleImageUpload,
    addSellerProduct,
    fetchSellerProducts,
    editSellerProduct,
    deleteSellerProduct,
};
