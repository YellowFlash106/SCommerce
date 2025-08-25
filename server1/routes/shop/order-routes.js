
const express = require('express');


const { createOrder,
        capturePayment,
        getAllOrderDetails,
        getAllOrdersByUser } 
        = require('../../controllers/shop/order-controller')

const router = express.Router();

router.post('/create',createOrder);
router.post('/capture',capturePayment);
router.get('/list/:userID',getAllOrdersByUser);
router.get('/details/:id',getAllOrderDetails);


module.exports = router;
