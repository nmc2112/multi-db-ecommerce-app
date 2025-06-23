const express = require('express');
const router = express.Router();
const { Item, User, Order } = require('../models/mongoModel');

// ===== ITEM APIs =====
router.post('/item', async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.get('/item', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/item/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put('/item/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.delete('/item/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== USER APIs =====
router.post('/user', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.get('/user', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== ORDER APIs =====
router.post('/order', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.get('/order', async (req, res) => {
  try {
    const orders = await Order.find().populate('userId').populate('items.productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== AGGREGATION =====
// Top 5 sản phẩm bán chạy
router.get('/top-selling', async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      // Lookup product info
      {
        $lookup: {
          from: "items",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      // Project name instead of _id
      {
        $project: {
          _id: 0,
          productId: "$_id",
          productName: "$product.name",
          totalSold: 1
        }
      }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Top user spending (JOIN to Item for price)
router.get('/user-spending', async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $unwind: "$items" },
      // Join để lấy giá của product
      {
        $lookup: {
          from: "items",
          localField: "items.productId",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      // Tổng số tiền đã chi theo userId
      {
        $group: {
          _id: "$userId",
          totalSpent: { $sum: { $multiply: ["$items.quantity", "$productInfo.price"] } }
        }
      },
      { $sort: { totalSpent: -1 } },
      // Lookup sang users để lấy username
      {
        $lookup: {
          from: "users",
          localField: "_id",         // _id là userId (ObjectId)
          foreignField: "_id",       // users._id
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          username: "$userInfo.username",
          totalSpent: 1
        }
      }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
