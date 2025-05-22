import React, { useEffect, useState, useContext } from 'react';
import api from './api';
import { AuthContext } from './AuthContext';
import UserRow from './UserRow';
import Navbar from './NavBar'; // Add this if not already

export default function AdminUsersPage() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await api.get('/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [token]);

  const refreshUsers = () => {
    setLoading(true);
    api.get('/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUsers(res.data))
      .catch(() => setError('Failed to fetch users'))
      .finally(() => setLoading(false));
  };

  if (loading) return (
    <>
      <Navbar />
      <p style={{ padding: '2rem', color: '#333' }}>Loading users...</p>
    </>
  );
  if (error) return (
    <>
      <Navbar />
      <p style={{ padding: '2rem', color: 'red' }}>{error}</p>
    </>
  );

  return (
    <>
      <Navbar />
      <div style={{
        maxWidth: 1000,
        margin: '2rem auto',
        padding: '2rem',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: '12px',
        boxShadow: '0 6px 24px rgba(0,0,0,0.1)',
      }}>
        <h2 style={{
          textAlign: 'left',
          fontSize: '1.8rem',
          fontWeight: '700',
          marginBottom: '1.5rem',
        }}>
          Users Management
        </h2>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Segoe UI, sans-serif' }}>
          <thead>
            <tr style={{
              backgroundColor: '#f3f3f3',
              borderBottom: '2px solid #ddd',
              textAlign: 'left'
            }}>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Email</th>
              <th style={{ padding: '12px' }}>Role</th>
              <th style={{ padding: '29px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <UserRow key={user._id} user={user} refreshUsers={refreshUsers} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
