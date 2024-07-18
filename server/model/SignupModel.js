const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    enum: ['user', 'admin'],
    default: ['user'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// userSchema.pre('save', async function(next) {
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(this.password, salt);
//     this.password = hashedPassword;
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

userSchema.methods.getJwtToken = function(){
  return jwt.sign({id: this.id}, process.env.JWT_SECRET, {
       expiresIn: process.env.JWT_EXPIRES_TIME
   })
}


const User = mongoose.model('User', userSchema);

module.exports = User;
