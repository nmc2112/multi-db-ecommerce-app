const express = require('express');
const router = express.Router();
const neo4jModel = require('../models/neo4jModel');

// Create user
router.post('/user', async (req, res) => {
  const { username, email } = req.body;
  try {
    const user = await neo4jModel.createUser(username, email);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create product
router.post('/product', async (req, res) => {
  const { name, description } = req.body;
  try {
    const product = await neo4jModel.createProduct(name, description);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Follow user
router.post('/user/:from/follow/:to', async (req, res) => {
  const { from, to } = req.params;
  try {
    await neo4jModel.followUser(from, to);
    res.json({ message: `${from} now follows ${to}` });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Like product
router.post('/user/:username/like/:product', async (req, res) => {
  const { username, product } = req.params;
  try {
    await neo4jModel.likeProduct(username, product);
    res.json({ message: `${username} likes ${product}` });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Shortest path between users
router.get('/user/:from/path/:to', async (req, res) => {
  const { from, to } = req.params;
  try {
    const path = await neo4jModel.shortestPath(from, to);
    res.json({ path });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Recommendations
router.get('/user/:username/recommendations', async (req, res) => {
  const { username } = req.params;
  try {
    const recommendations = await neo4jModel.recommendProducts(username);
    res.json({ recommendations });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Central users
router.get('/central-users', async (req, res) => {
  try {
    const users = await neo4jModel.getCentralUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;