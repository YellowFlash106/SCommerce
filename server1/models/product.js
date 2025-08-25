
const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    image : String ,
    title : String ,
    description : String,
    category : String ,
    brand : String,
    price : Number,
    salePrice : Number,
    totalStock : Number 
},{timeseries : true})

// module.exports = mongoose.model('Product' , ProductSchema)
module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);