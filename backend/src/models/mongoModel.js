const mongoose = require('mongoose');

// Item Schema
const itemSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true }
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, default: 'user' }
});

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    quantity:  { type: Number, required: true },
    price:     { type: Number, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Export ALL MODELS as an object
const Item  = mongoose.model('Item', itemSchema);
const User  = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = { Item, User, Order };
