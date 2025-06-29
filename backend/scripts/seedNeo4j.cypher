// Remove all old data (optional, be careful)
MATCH (n) DETACH DELETE n;

// Users (userId same as Redis!)
CREATE (a:User {userId: "u003", name: "jack"});
CREATE (b:User {userId: "u004", name: "jane"});
CREATE (c:User {userId: "u005", name: "alice"});
CREATE (d:User {userId: "u002", name: "bob"});

// Follows
MATCH (a:User {userId:"u002"}), (b:User {userId:"u003"}) CREATE (a)-[:FOLLOWS]->(b);
MATCH (b:User {userId:"u003"}), (c:User {userId:"u004"}) CREATE (b)-[:FOLLOWS]->(c);
MATCH (a:User {userId:"u002"}), (d:User {userId:"u005"}) CREATE (a)-[:FOLLOWS]->(d);
