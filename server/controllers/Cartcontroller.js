const Cart = require('../model/cardModel');
const Product = require("../model/ProductModel")
const jwt = require("jsonwebtoken");

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  console.log("cookies",req.cookies)
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(400).json({ error: 'JWT token is missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    let item = cart.items.find(item => item.productId === productId);

    if (item) {
      // If the product already exists in the cart, update its quantity
      item.quantity += quantity;
    } else {
      // If the product doesn't exist in the cart, add it as a new item
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid JWT token' });
    }
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getCartItems = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({ error: 'JWT token is missing' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  try {
    const cart = await Cart.findOne({ userId });

    // Fetch additional details for each product in the cart
    const cartItemsWithDetails = await Promise.all(cart.items.map(async (item) => {
      const product = await Product.findById(item.productId);
      return { ...item.toObject(), product };
    }));

    res.status(200).json({ items: cartItemsWithDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.removeItem = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({ error: 'JWT token is missing' });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;
  const itemId = req.params.itemId;

  try {
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { _id: itemId } } },
      { new: true }
    );

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateQuantity = async (req, res) => {
  const userId = req.user.id;
  const itemId = req.params.itemId;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOneAndUpdate(
      { userId, 'items._id': itemId },
      { $set: { 'items.$.quantity': quantity } },
      { new: true }
    );

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};