const express = require('express');

const {
    handleImageUpload,
    addProduct,
    deleteProduct,
    editProduct,
    fetchAllProducts,
} = require('../../controllers/admin/products-controller')

const {upload} = require('../../healpers/cloudinary')

const router = express.Router();
router.post('/upload-image' , upload.single('my_file'), handleImageUpload)
router.post('/add', addProduct)
router.put('/edit/:id', editProduct)
router.delete('/delete/:id', deleteProduct)
router.get('/get', fetchAllProducts)
module.exports = router;