const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid'); // npm i uuid

// Đăng ký
router.post('/register', async (req, res) => {
  const redis = req.app.locals.redis;
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Thiếu thông tin' });

  const exists = await redis.exists(`user:${username}`);
  if (exists) return res.status(400).json({ error: 'Username đã tồn tại' });

  await redis.hSet(`user:${username}`, { password, role: 'user' });
  res.json({ message: 'Đăng ký thành công!' });
});

// Đăng nhập
// Express route: Only admin can login
router.post('/login', async (req, res) => {
  console.log('[DEBUG] Đã vào /api/redis/login với body:', req.body);
  const redis = req.app.locals.redis;
  const { username, password } = req.body;

  // Check if user exists
  const user = await redis.hGetAll(`user:${username}`);
  if (!user || !user.password) {
    return res.status(400).json({ error: 'User does not exist' });
  }

  // Check password
  if (user.password !== password) {
    return res.status(400).json({ error: 'Incorrect password' });
  }

  // Check if user is admin
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admin can login!' });
  }

  // If all checks pass, create session
  const sessionId = require('uuid').v4();
  await redis.set(`session:${sessionId}`, username, { EX: 3600 }); // 1 hour expiration
  res.json({ message: 'Login successful', sessionId, user: { username, role: user.role } });
});


// Đăng xuất
router.post('/logout', async (req, res) => {
  const redis = req.app.locals.redis;
  const { sessionId } = req.body;
  await redis.del(`session:${sessionId}`);
  res.json({ message: 'Logout thành công' });
});

module.exports = router;
