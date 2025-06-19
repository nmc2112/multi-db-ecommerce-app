import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MongoItems = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', price: '' });
  const [editingId, setEditingId] = useState(null);

  // Aggregation
  const [topSelling, setTopSelling] = useState([]);
  const [userSpending, setUserSpending] = useState([]);

  useEffect(() => {
    fetchItems();
    fetchTopSelling();
    fetchUserSpending();
    // eslint-disable-next-line
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/mongo/item`);
      setItems(res.data);
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  const fetchTopSelling = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/mongo/top-selling`);
      setTopSelling(res.data);
    } catch (err) {
      setTopSelling([]);
    }
  };

  const fetchUserSpending = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/mongo/user-spending`);
      setUserSpending(res.data);
    } catch (err) {
      setUserSpending([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Đảm bảo price là số
      const data = { ...formData, price: Number(formData.price) };
      if (editingId) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/mongo/item/${editingId}`, data);
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/mongo/item`, data);
      }
      setFormData({ name: '', description: '', price: '' });
      setEditingId(null);
      fetchItems();
    } catch (err) {
      alert('Error saving item');
    }
  };

  const handleEdit = (item) => {
    setFormData({ name: item.name, description: item.description, price: item.price });
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/mongo/item/${id}`);
      fetchItems();
    } catch (err) {
      alert('Error deleting item');
    }
  };

  return (
    <div className="database-container">
      <h2>MongoDB Items</h2>
      <form onSubmit={handleSubmit} className="item-form">
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          placeholder="Name"
          required
        />
        <input
          type="text"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description"
          required
        />
        <input
          type="number"
          value={formData.price}
          onChange={e => setFormData({ ...formData, price: e.target.value })}
          placeholder="Price"
          required
          min="0"
        />
        <button type="submit">{editingId ? 'Update Item' : 'Add Item'}</button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setFormData({ name: '', description: '', price: '' });
              setEditingId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="items-list">
        {items.map(item => (
          <div key={item._id} className="item-card">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p><b>Giá:</b> {item.price}</p>
            <div className="item-actions">
              <button onClick={() => handleEdit(item)}>Edit</button>
              <button onClick={() => handleDelete(item._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Aggregation */}
      <div className="aggregation-section">
        <h3>Top 5 Sản Phẩm Bán Chạy</h3>
        <ul>
          {topSelling.length === 0 ? (
            <li>Không có dữ liệu</li>
          ) : (
            topSelling.map((item, idx) => (
              <li key={idx}>
                <strong>Product ID:</strong> {item._id} | <strong>Sold:</strong> {item.totalSold}
              </li>
            ))
          )}
        </ul>

        <h3>User Spending</h3>
        <ul>
          {userSpending.length === 0 ? (
            <li>Không có dữ liệu</li>
          ) : (
            userSpending.map((user, idx) => (
              <li key={idx}>
                <strong>User ID:</strong> {user._id} | <strong>Total Spent:</strong> {user.totalSpent}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default MongoItems;
