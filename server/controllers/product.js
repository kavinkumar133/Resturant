const Product = require('../model/ProductModel')





//Create Product - /product/new
exports.newProduct = async (req, res, next)=>{

    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
}




// Assuming you have the Product model imported and catchAsyncError middleware defined

// Get all products - api/v1/products
exports.getAllProducts = async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        count: products.length,
        products
    });
}



//Get Single Product - api/v1/product/:id
exports.getSingleProduct = async(req, res, next) => {
    const product = await Product.findById(req.params.id).populate('reviews.user','name email');

    if(!product) {
        return next(new ErrorHandler('Product not found', 400));
    }

    res.status(201).json({
        success: true,
        product
    })
}