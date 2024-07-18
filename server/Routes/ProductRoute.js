const express = require('express');
const { getAllProducts, 
    newProduct,
    getSingleProduct} = require('../controllers/product');

const router = express.Router();




router.route('/products').get(getAllProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/admin/product/new').post(newProduct);
            
        



module.exports = router;