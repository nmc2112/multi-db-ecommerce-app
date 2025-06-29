const express = require('express');
const router = express.Router();

// Get all users (nodes)
router.get('/users', async (req, res) => {
  const session = req.app.locals.neo4j.session();
  try {
    const result = await session.run('MATCH (u:User) RETURN u.userId AS userId, u.name AS name');
    res.json(result.records.map(r => ({
      userId: r.get('userId'),
      name: r.get('name')
    })));
  } finally {
    await session.close();
  }
});

// Create a "follow" relationship
router.post('/follow', async (req, res) => {
  const { fromId, toId } = req.body;
  const session = req.app.locals.neo4j.session();
  try {
    await session.run(
      'MATCH (a:User {userId: $from}), (b:User {userId: $to}) MERGE (a)-[:FOLLOWS]->(b)',
      { from: fromId, to: toId }
    );
    res.json({ message: 'Followed successfully!' });
  } finally {
    await session.close();
  }
});

// Get a user's followers
router.get('/followers/:userId', async (req, res) => {
  const session = req.app.locals.neo4j.session();
  try {
    const result = await session.run(
      'MATCH (f:User)-[:FOLLOWS]->(u:User {userId: $userId}) RETURN f.userId AS userId, f.name AS name',
      { userId: req.params.userId }
    );
    res.json(result.records.map(r => ({
      userId: r.get('userId'),
      name: r.get('name')
    })));
  } finally {
    await session.close();
  }
});

// Get a user's following
router.get('/following/:userId', async (req, res) => {
  const session = req.app.locals.neo4j.session();
  try {
    const result = await session.run(
      'MATCH (u:User {userId: $userId})-[:FOLLOWS]->(f:User) RETURN f.userId AS userId, f.name AS name',
      { userId: req.params.userId }
    );
    res.json(result.records.map(r => ({
      userId: r.get('userId'),
      name: r.get('name')
    })));
  } finally {
    await session.close();
  }
});

module.exports = router;
