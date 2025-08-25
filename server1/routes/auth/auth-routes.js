const express = require('express')
const router = express.Router();


const {registerUser, loginUser, logoutUser ,authMidleware
} = require ('../../controllers/auth/auth-controller')





router.post("/signup",registerUser)
router.post("/login",loginUser)
router.post("/logout",logoutUser)
router.get("/check-auth",authMidleware,(req ,res)=>{
    const user = req.user;
    res.status(200).json({
        success : true ,
        message : "Authenticated user!",
        user,
    })
})

module.exports = router;