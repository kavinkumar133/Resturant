const bcrypt = require('bcrypt');
const User = require('../model/SignupModel');
const sendToken = require('../Routes/jwt');

exports.register = async (req, res) => {
  try {
    const { username, email, phoneNumber, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, phoneNumber, password: hashedPassword });

    sendToken(user, 201, res);
  } catch (error) {
    if (!res.headersSent) {
      res.status(400).json({ message: error.message });
    }
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    sendToken(user, 200, res);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }
  }
};
// Logout user
exports.logout = (req, res) => {
  // Clear cookie
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.userId; // Assuming you have middleware to get userId from JWT
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};