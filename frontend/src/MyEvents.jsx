import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export default function MyEvents() {
  const { user, token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventAdded, setEventAdded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/events?organizerId=${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
        if (data.length > 0) {
          setEventAdded(true);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user, token]);

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  if (loading) return <p>Loading your events...</p>;

  return (
    <div style={{ padding: '2rem', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '2rem', right: '2rem', textAlign: 'right' }}>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Would you like to create an event?</p>
        <button
          onClick={handleCreateEvent}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Create Event
        </button>
      </div>

      <h2 style={{ fontWeight: 'bold' }}>My Events</h2>
      {eventAdded && <p style={{ color: 'green' }}>Event added successfully!</p>}
      {events.length === 0 ? (
        <p>You have not created any events yet.</p>
      ) : (
        <ul>
          {events.map(event => (
            <li key={event.id}>
              <strong>{event.title}</strong> - {event.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
