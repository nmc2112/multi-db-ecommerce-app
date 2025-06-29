import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import MongoItems from './components/MongoItems';
import RedisItems from './components/RedisItems';
import Neo4jItems from './components/Neo4jItems';
import LoginItem from './components/LoginItem'; // import file login vừa tạo
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/redis/logout`, { sessionId });
      } catch (err) {
        // Có thể ignore lỗi ở đây
      }
      localStorage.removeItem('sessionId');
    }
    setUser(null);
  };

  return (
    <Router>
      {user && (
          <button
            onClick={handleLogout}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              padding: '6px 14px',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        )}
      <nav>
        <Link to="/mongo">MongoDB</Link> | 
        {/* <Link to="/redis">Redis</Link> |  */}
        <Link to="/neo4j">Neo4j</Link>
      </nav>
      <Routes>
        {/* Nếu chưa đăng nhập, mọi truy cập khác đều về Login */}
        <Route path="/" element={
          user ? <Navigate to="/mongo" /> : <LoginItem onLogin={setUser} />
        } />
        <Route path="/mongo" element={
          user ? <MongoItems /> : <Navigate to="/" />
        } />
        <Route path="/redis" element={
          user ? <RedisItems /> : <Navigate to="/" />
        } />
        <Route path="/neo4j" element={
          user ? <Neo4jItems /> : <Navigate to="/" />
        } />
        {/* fallback route nếu truy cập linh tinh */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
