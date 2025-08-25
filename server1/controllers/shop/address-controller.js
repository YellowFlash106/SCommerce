const Address = require('../../models/Address')


const addAddress = async (req,res) =>{
    try {
        const {userId, address, city, pincode, phone, notes} = req.body;
        if(!userId || !address || !city || !pincode || !phone || !notes){
            return res.status(400).json({
            success : false,
            message : 'Invalid data provided',
        })
        }

        const newCreatedAddress = new Address({
            userId, address, city, pincode, notes,phone
        });

        await newCreatedAddress.save();
        res.status(201).json({
            success : true,
            data : newCreatedAddress,
        })
         
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Error',
        })
    }
}

const fetchAllAddress = async (req,res) =>{
    try {
        const {userId} = req.params;
        if(!userId){
            return res.status(400).json({
            success : false,
            message : 'UserId is required!',
        })
    }
    const addressList = await Address.find({userId});
            res.status(200).json({
            success : false,
            data : addressList,
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Error',
        })
    }
}

const editAddress = async (req,res) =>{
    try {

        const {userId , addressId} = req.params;
        const formData = req.body;

        if(!userId || !addressId){
            return res.status(400).json({
            success : false,
            message : 'User and Address id are required!',
        })
    }

    const address = await Address.findByIdAndUpdate({
        _id : addressId, userId
        }, formData, {new : true});

    if(!address){
        return res.status(404).json({
            success : false,
            message : 'Address not found',
        })
    }
    res.status(200).json({
            success : true,
            data : address,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Error',
        })
    }
}

const deleteAddress = async (req,res) =>{
    try {
        const {userId , addressId} = req.params;

        if(!userId || !addressId){
            return res.status(400).json({
            success : false,
            message : 'User and Address id are required!',
        })
    }

     const address = await Address.findByIdAndDelete({
        _id : addressId, userId
        });

    if(!address){
        return res.status(404).json({
            success : false,
            message : 'Address not found',
        })
    }
    res.status(200).json({
            success : true,
            message : 'Address deleted successfully',
    })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Error',
        })
    }
}

module.exports ={
    addAddress,
    editAddress,
    fetchAllAddress,
    deleteAddress
}