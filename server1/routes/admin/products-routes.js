const express = require('express');
const router = express.Router();

const {
    handleImageUpload,
    addProduct,
    deleteProduct,
    editProduct,
    fetchAllProducts,
} = require('../../controllers/admin/products-controller');

const { upload } = require('../../healpers/cloudinary');
const { authMidleware, adminMiddleware } = require('../../controllers/auth/auth-controller');

// All admin product routes are protected
router.post('/upload-image', authMidleware, adminMiddleware, upload.single('my_file'), handleImageUpload);
router.post('/add', authMidleware, adminMiddleware, addProduct);
router.put('/edit/:id', authMidleware, adminMiddleware, editProduct);
router.delete('/delete/:id', authMidleware, adminMiddleware, deleteProduct);
router.get('/get', authMidleware, adminMiddleware, fetchAllProducts);

module.exports = router;
