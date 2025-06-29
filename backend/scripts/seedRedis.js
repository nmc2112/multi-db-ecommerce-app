const { createClient } = require('redis');

async function seed() {
  const client = createClient({ url: 'redis://localhost:6379' });
  await client.connect();
  await client.flushDb(); // WARNING: clears all data!

  await client.hSet('user:u003', { username: 'jack', password: '123456', role: 'user' });
  await client.hSet('user:u004', { username: 'jane', password: '123456', role: 'user' });
  await client.hSet('user:u005', { username: 'alice', password: '123456', role: 'user' });
  await client.hSet('user:u002', { username: 'bob', password: '123456', role: 'user' });
  await client.hSet('user:admin', { username: 'admin', password: 'adminpass', role: 'admin' });

  console.log('Redis seeded!');
  await client.quit();
}
seed();
