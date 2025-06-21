const neo4j = require('neo4j-driver');

// Initialize Neo4j driver (update credentials as needed)
const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'your_password')
);

// Create a new user node
async function createUser(username, email) {
  const session = driver.session();
  try {
    const result = await session.run(
      'CREATE (u:User {username: $username, email: $email}) RETURN u',
      { username, email }
    );
    return result.records[0].get('u').properties;
  } finally {
    await session.close();
  }
}

// Create a new product node
async function createProduct(name, description) {
  const session = driver.session();
  try {
    const result = await session.run(
      'CREATE (p:Product {name: $name, description: $description}) RETURN p',
      { name, description }
    );
    return result.records[0].get('p').properties;
  } finally {
    await session.close();
  }
}

// Make one user follow another
async function followUser(from, to) {
  const session = driver.session();
  try {
    await session.run(
      'MATCH (a:User {username: $from}), (b:User {username: $to}) MERGE (a)-[:FOLLOWS]->(b)',
      { from, to }
    );
    return true;
  } finally {
    await session.close();
  }
}

// User likes a product
async function likeProduct(username, product) {
  const session = driver.session();
  try {
    await session.run(
      'MATCH (u:User {username: $username}), (p:Product {name: $product}) MERGE (u)-[:LIKES]->(p)',
      { username, product }
    );
    return true;
  } finally {
    await session.close();
  }
}

// Find shortest path between two users
async function shortestPath(from, to) {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (a:User {username: $from}), (b:User {username: $to}),
        p = shortestPath((a)-[:FOLLOWS*]-(b))
        RETURN [n IN nodes(p) | n.username] AS path`,
      { from, to }
    );
    if (result.records.length === 0) return null;
    return result.records[0].get('path');
  } finally {
    await session.close();
  }
}

// Recommend products liked by friends but not by the user
async function recommendProducts(username) {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (u:User {username: $username})-[:FOLLOWS]->(f:User)-[:LIKES]->(p:Product)
       WHERE NOT (u)-[:LIKES]->(p)
       RETURN DISTINCT p.name AS product`,
      { username }
    );
    return result.records.map(r => r.get('product'));
  } finally {
    await session.close();
  }
}

// Get top 5 central users by PageRank
async function getCentralUsers() {
  const session = driver.session();
  try {
    const result = await session.run(
      `CALL gds.pageRank.stream({
        nodeProjection: 'User',
        relationshipProjection: {
          FOLLOWS: {
            type: 'FOLLOWS',
            orientation: 'NATURAL'
          }
        }
      })
      YIELD nodeId, score
      RETURN gds.util.asNode(nodeId).username AS username, score
      ORDER BY score DESC
      LIMIT 5`
    );
    return result.records.map(r => ({
      username: r.get('username'),
      score: r.get('score')
    }));
  } finally {
    await session.close();
  }
}

module.exports = {
  createUser,
  createProduct,
  followUser,
  likeProduct,
  shortestPath,
  recommendProducts,
  getCentralUsers,
  driver // Export driver for app
}; 