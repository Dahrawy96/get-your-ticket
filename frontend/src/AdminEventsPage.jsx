import React, { useState, useEffect, useContext } from 'react';
import api from './api';
import { AuthContext } from './AuthContext';
import Navbar from './NavBar';

export default function AdminEventsPage() {
  const { token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/events/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      setError('Failed to fetch events');
    }
    setLoading(false);
  };

  const handleStatusChange = async (eventId, status) => {
    setMessage('');
    try {
      await api.patch(
        `/${eventId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(`Event ${status}`);
      fetchEvents(); // Refresh events list after update
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <p style={{ padding: '2rem' }}>Loading events...</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <p style={{ color: 'red', padding: '2rem' }}>{error}</p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 1200, margin: 'auto', padding: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#222' }}>Admin Events Management</h2>
        {message && <p style={{ color: 'green', marginBottom: '1rem' }}>{message}</p>}

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <thead style={{ backgroundColor: '#f0f0f0' }}>
            <tr>
              {['Title', 'Date', 'Location', 'Status', 'Actions'].map((head) => (
                <th
                  key={head}
                  style={{
                    padding: '12px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textAlign: 'left',
                    borderBottom: '2px solid #ddd',
                    color: '#333',
                  }}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{event.title}</td>
                <td style={{ padding: '12px' }}>{new Date(event.date).toLocaleDateString()}</td>
                <td style={{ padding: '12px' }}>{event.location}</td>
                <td style={{ padding: '12px', textTransform: 'capitalize' }}>{event.status}</td>
                <td style={{ padding: '12px' }}>
                  {event.status !== 'approved' && (
                    <button
                      onClick={() => handleStatusChange(event._id, 'approved')}
                      style={{
                        padding: '8px 14px',
                        marginRight: '10px',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      Approve
                    </button>
                  )}
                  {event.status !== 'declined' && (
                    <button
                      onClick={() => handleStatusChange(event._id, 'declined')}
                      style={{
                        padding: '8px 14px',
                        backgroundColor: '#9c27b0',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      Decline
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
