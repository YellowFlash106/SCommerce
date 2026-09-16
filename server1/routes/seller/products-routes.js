const express = require('express');
const router = express.Router();

const {
    handleImageUpload,
    addSellerProduct,
    fetchSellerProducts,
    editSellerProduct,
    deleteSellerProduct,
} = require('../../controllers/seller/products-controller');

const { upload } = require('../../healpers/cloudinary');
const { authMidleware, sellerMiddleware } = require('../../controllers/auth/auth-controller');

// All seller product routes require auth + approved seller
router.post('/upload-image', authMidleware, sellerMiddleware, upload.single('my_file'), handleImageUpload);
router.post('/add', authMidleware, sellerMiddleware, addSellerProduct);
router.get('/get', authMidleware, sellerMiddleware, fetchSellerProducts);
router.put('/edit/:id', authMidleware, sellerMiddleware, editSellerProduct);
router.delete('/delete/:id', authMidleware, sellerMiddleware, deleteSellerProduct);

module.exports = router;
