const mongoose = require('mongoose');
const { Item, Order } = require('../models/mongoModel'); // Adjust path as needed

const products = [
  { name: "iPhone 15 Pro", description: "Điện thoại Apple cao cấp", price: 1200 },
  { name: "Samsung S24 Ultra", description: "Flagship Hàn Quốc", price: 1100 },
  { name: "Xiaomi 14 Ultra", description: "Camera xịn giá rẻ", price: 900 },
  { name: "OPPO Find X7", description: "Máy đẹp nhiều tính năng", price: 800 },
  { name: "Vsmart Aris", description: "Điện thoại Việt Nam", price: 400 },
  { name: "Google Pixel 8", description: "Chụp ảnh siêu đẹp", price: 950 },
  { name: "Asus ROG Phone 7", description: "Gaming phone", price: 1300 },
  { name: "Realme GT Neo", description: "Hiệu năng ổn giá tốt", price: 550 },
  { name: "Nokia X100", description: "Siêu trâu pin bền", price: 380 },
  { name: "Sony Xperia 5 V", description: "Nghe nhạc cực hay", price: 990 }
];

// Example orders — link userId to Redis user keys
const orders = [
  {
    userId: "u003", // Redis userId
    items: [
      { productId: "replace_with_product_id_1", quantity: 2, price: 1200 },
      { productId: "replace_with_product_id_2", quantity: 1, price: 1100 }
    ]
  },
  {
    userId: "u004",
    items: [
      { productId: "replace_with_product_id_3", quantity: 3, price: 900 }
    ]
  }
];

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/multidb');
  await Item.deleteMany({});
  await Order.deleteMany({});
  const inserted = await Item.insertMany(products);
  // Map inserted product ids to orders
  orders[0].items[0].productId = inserted[0]._id;
  orders[0].items[1].productId = inserted[1]._id;
  orders[1].items[0].productId = inserted[2]._id;
  await Order.insertMany(orders);
  console.log('MongoDB seeded!');
  mongoose.disconnect();
}
seed();
