const Product = require('../../models/product.js')

const searchProducts = async(req,res)=>{
    try {
        const {keyword} = req.params;
        if(!keyword || typeof keyword !== 'string'){
        return res.status(400).json({
            success: false,
            message: 'keyword is require and must be in String formate'
        })
        }
        const regEx = new RegExp(keyword,'i')
        const createSearchQuery ={
            $or : [
                {title : regEx},
                {decription : regEx},
                {category : regEx},
                {brand : regEx},
            ]
        }
        const searchResults = await Product.find(createSearchQuery);
        res.status(200).json({
            success: true,
            data : searchResults
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error'
        })
    }
}

module.exports = {searchProducts};