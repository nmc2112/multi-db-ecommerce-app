import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

export default function Neo4jSocial() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/neo4j/users`).then(res => setUsers(res.data));
  }, []);

  const showRelations = async (userId) => {
    setSelected(userId);
    const [followersRes, followingRes] = await Promise.all([
      axios.get(`${API}/api/neo4j/followers/${userId}`),
      axios.get(`${API}/api/neo4j/following/${userId}`)
    ]);
    setFollowers(followersRes.data);
    setFollowing(followingRes.data);
  };

  return (
    <div>
      <h2>Neo4j Social Network Demo</h2>
      <h3>User List</h3>
      <ul>
        {users.map(u => (
          <li key={u.userId}>
            <button onClick={() => showRelations(u.userId)}>{u.name} ({u.userId})</button>
          </li>
        ))}
      </ul>

      {selected && (
        <div>
          <h4>Selected User: {users.find(u => u.userId === selected)?.name}</h4>
          <div>
            <b>Followers:</b>
            <ul>
              {followers.length ? followers.map(f => (
                <li key={f.userId}>{f.name} ({f.userId})</li>
              )) : <li>None</li>}
            </ul>
          </div>
          <div>
            <b>Following:</b>
            <ul>
              {following.length ? following.map(f => (
                <li key={f.userId}>{f.name} ({f.userId})</li>
              )) : <li>None</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
