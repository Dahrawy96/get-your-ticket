// src/UserRow.jsx
import React, { useState, useContext } from 'react';
import api from './api';
import { AuthContext } from './AuthContext';
import UpdateUserRoleModal from './UpdateUserRoleModal';

export default function UserRow({ user, refreshUsers }) {
  const { token } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState('');

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete user ${user.name}?`)) return;
    setLoadingDelete(true);
    setErrorDelete('');
    try {
      await api.delete(`/users/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshUsers();
    } catch (err) {
      setErrorDelete('Failed to delete user');
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      <tr>
        <td style={{ borderBottom: '1px solid #ddd', padding: '12px' }}>{user.name}</td>
        <td style={{ borderBottom: '1px solid #ddd', padding: '12px' }}>{user.email}</td>
        <td style={{ borderBottom: '1px solid #ddd', padding: '12px' }}>{user.role}</td>
        <td style={{ borderBottom: '1px solid #ddd', padding: '12px' }}>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#4CAF50',
              color: 'white',
              fontWeight: 'bold',
              marginRight: '10px',
              cursor: 'pointer',
            }}
          >
            Update Role
          </button>
          <button
            onClick={handleDelete}
            disabled={loadingDelete}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#7b1fa2',
              color: 'white',
              fontWeight: 'bold',
              cursor: loadingDelete ? 'not-allowed' : 'pointer',
              opacity: loadingDelete ? 0.7 : 1,
            }}
          >
            {loadingDelete ? 'Deleting...' : 'Delete'}
          </button>
          {errorDelete && <p style={{ color: 'red', marginTop: '6px' }}>{errorDelete}</p>}
        </td>
      </tr>

      {modalOpen && (
        <UpdateUserRoleModal
          user={user}
          closeModal={() => setModalOpen(false)}
          refreshUsers={refreshUsers}
        />
      )}
    </>
  );
}
