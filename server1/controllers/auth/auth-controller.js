const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User')

// register 

const registerUser = async(req,res) =>{
    const {userName ,email ,password} = req.body;

    try{
        const checkUser = await User.findOne({email});
        if(checkUser) {
            return res.json({
                success: false,
                message: "User already exists with the same email! Please try again"
            });
        }

        const hashPassword = await bcrypt.hash(password ,12);
        const newUser = new User({
            userName,
            email,
            password : hashPassword,
        })
        await newUser.save()
        res.status(200).json({
            success : true,
            message : "Registration successfully"
        })

    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false ,
            message : "Some error occured"
        });
    }
};


// login

const loginUser = async(req,res) =>{
    const {email ,password} = req.body;

    try{
        const checkUser = await User.findOne({email});
        if(!checkUser) return res.json({
            success :false ,
            message : "User doesn't exists! Please Register first",
        })

        const checkPassMatch = await bcrypt.compare(password , checkUser.password);
        if(!checkPassMatch) return res.json({
            success : false ,
            message :"Password doesn't match! please try again",
        })

        const token = jwt.sign({
            id:checkUser._id , 
            role : checkUser.role , 
            email : checkUser.email,
            userName : checkUser.userName,
        },'CLIENT_SECRET_KEY',{expiresIn :"60m"})

        res.cookie('token' , token ,{httpOnly : true , secure :false,
             sameSite: 'lax', // or 'none' if using HTTPS and cross-site
    path: '/' // optional

        }).json({
            success : true,
            message : "Logged in successfully ",
            user : {
                id: checkUser._id,
                role : checkUser.role,
                email : checkUser.email,
                userName : checkUser.userName,
            }
        })

    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false ,
            message : "Some error occured"
        });
    }
}

// logout

const logoutUser = (req, res) => {
    res.clearCookie('token').json({
        success : true ,
        message : "Logged out successfully",
    })
}


// auth middleware

const authMidleware = async (req, res, next) => {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({
        success : false ,
        message : "Unauthorised user!",
    })
    try {
        const decoded = jwt.verify(token , 'CLIENT_SECRET_KEY');
        req.user = decoded;
        next();
    } catch(error) {
        res.status(401).json({
            success : false ,
            message : "Unauthorised user!",
        })
    }
}

module.exports = { registerUser, loginUser, logoutUser, authMidleware };