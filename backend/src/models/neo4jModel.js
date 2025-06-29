// models/neo4jModel.js
class Neo4jModel {
  constructor(neo4jDriver) {
    this.driver = neo4jDriver;
  }

  // Tạo user mới (username là unique)
  async createUser({ username, name }) {
    const session = this.driver.session();
    try {
      await session.run(
        `MERGE (u:User {username: $username, name: $name})`,
        { username, name }
      );
      return true;
    } finally {
      await session.close();
    }
  }

  // Thêm quan hệ bạn bè hai chiều
  async addFriend(user1, user2) {
    const session = this.driver.session();
    try {
      await session.run(
        `MATCH (a:User {username: $user1}), (b:User {username: $user2})
         MERGE (a)-[:FRIEND]->(b)
         MERGE (b)-[:FRIEND]->(a)`,
        { user1, user2 }
      );
      return true;
    } finally {
      await session.close();
    }
  }

  // Lấy danh sách bạn bè
  async getFriends(username) {
    const session = this.driver.session();
    try {
      const res = await session.run(
        `MATCH (u:User {username: $username})-[:FRIEND]->(f:User)
         RETURN f.username AS username, f.name AS name`,
        { username }
      );
      return res.records.map(r => ({
        username: r.get('username'),
        name: r.get('name')
      }));
    } finally {
      await session.close();
    }
  }

  // Đề xuất bạn bè chung (mutual friends)
  async getSuggestedFriends(username) {
    const session = this.driver.session();
    try {
      const res = await session.run(
        `MATCH (me:User {username: $username})-[:FRIEND]->(f1:User)-[:FRIEND]->(f2:User)
         WHERE NOT (me)-[:FRIEND]->(f2) AND me <> f2
         RETURN DISTINCT f2.username AS username, f2.name AS name`,
        { username }
      );
      return res.records.map(r => ({
        username: r.get('username'),
        name: r.get('name')
      }));
    } finally {
      await session.close();
    }
  }
}

module.exports = Neo4jModel;
