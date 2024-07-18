const express = require('express');
const router = express.Router();
const cartController = require('../controllers/Cartcontroller');
const auth = require('./middlewares')

// Add item to cart
router.post('/addtocart', auth,cartController.addToCart);

// Get cart items
router.get('/cart', cartController.getCartItems);

// Remove item from cart
router.delete('/remove/:itemId', cartController.removeItem);

// Update item quantity in cart
router.put('/update/:itemId',cartController.updateQuantity);

module.exports = router;