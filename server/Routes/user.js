const express = require('express');
const router = express.Router();
const { deleteUser,logout,login,register } = require('../controllers/Usercontroller');

// Routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/deleteUser', deleteUser);

module.exports = router;