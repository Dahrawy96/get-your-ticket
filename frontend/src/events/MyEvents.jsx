import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';

export default function MyEvents() {
  const { user, token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your actual backend endpoint
    fetch(`http://localhost:5000/api/events?organizerId=${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user, token]);

  if (loading) return <p>Loading your events...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>My Events</h2>
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
