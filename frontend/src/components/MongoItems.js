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
      <form onSubmit={handleSubmit} className="item-form" style={{ marginBottom: 24 }}>
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
        <button type="submit" style={{ marginLeft: 8 }}>{editingId ? 'Update Item' : 'Add Item'}</button>
        {editingId && (
          <button
            type="button"
            style={{ marginLeft: 8 }}
            onClick={() => {
              setFormData({ name: '', description: '', price: '' });
              setEditingId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Items Table */}
      <table className="items-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 32 }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Name</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Description</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Price</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: 12 }}>No data</td>
            </tr>
          ) : (
            items.map(item => (
              <tr key={item._id}>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.name}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.description}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.price}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>
                  <button onClick={() => handleEdit(item)}>Edit</button>{' '}
                  <button onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Aggregation: Top 5 Sản Phẩm Bán Chạy */}
      <h3>Top 5 Sản Phẩm Bán Chạy</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 32 }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Product Name</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Sold</th>
          </tr>
        </thead>
        <tbody>
          {topSelling.length === 0 ? (
            <tr>
              <td colSpan={2} style={{ textAlign: 'center', padding: 12 }}>Không có dữ liệu</td>
            </tr>
          ) : (
            topSelling.map((item, idx) => (
              <tr key={idx}>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>
                  {item.productName ? item.productName : item.productId}
                </td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.totalSold}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Aggregation: User Spending */}
      <h3>User Spending</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 32 }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Username</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Total Spent</th>
          </tr>
        </thead>
        <tbody>
          {userSpending.length === 0 ? (
            <tr>
              <td colSpan={2} style={{ textAlign: 'center', padding: 12 }}>Không có dữ liệu</td>
            </tr>
          ) : (
            userSpending.map((user, idx) => (
              <tr key={idx}>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>
                  {user.username ? user.username : user.userId}
                </td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{user.totalSpent}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MongoItems;
