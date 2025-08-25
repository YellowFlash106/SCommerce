
const express = require('express');


const { getAllOrdersOfAllUsers, 
    getAllOrderDetailsForAdmin,
    updateOrderStatus}
= require('../../controllers/admin/order-controller')

const router = express.Router();

router.get('/get',getAllOrdersOfAllUsers);
router.get('/details/:id',getAllOrderDetailsForAdmin);
router.put('/update/:id',getAllOrderDetailsForAdmin);

module.exports = router;
