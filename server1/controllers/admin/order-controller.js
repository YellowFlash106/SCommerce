const paypal = require('../../healpers/paypal')
 const Order = require('../../models/Order')
 const Cart = require('../../models/Cart')



const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({ });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
}

const getAllOrderDetailsForAdmin = async (req, res)=>{
    try {
        const {id} = req.params;
        const order = await Order.findById(id);

        if(!order){
            res.status(404).json({
            success : false, 
            message : "Order not found!"
        })
        }
        res.status(200).json({
            success : true, 
            data : order // orders 
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false, 
            message : "Error"
        })
        
        
    }
}
const updateOrderStatus = async(req,res)=>{
  try {
    const {id} = req.params;
    const {orderStatus} = req.body;
    const order = await Order.findById(id);

    if(!order){
        res.status(404).json({
        success : false, 
        message : "Order not found!"
    })
    }

    await Order.findByIdAndUpdate(id,{orderStatus});

    res.status(200).json({
        success : true, 
        message : "Order status is updated successfully"
        })

  } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false, 
            message : "Error"
        })
  }
}

module.exports = {
  getAllOrdersOfAllUsers , 
  getAllOrderDetailsForAdmin,
  updateOrderStatus,
};