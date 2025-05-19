import React, { useState, useEffect } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';

export default function UserEventsPage() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchApprovedEvents() {
      try {
        const res = await api.get('/events'); // fetch approved events (public)
        setEvents(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch events');
        setLoading(false);
      }
    }
    fetchApprovedEvents();
  }, []);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'white',
      padding: '2rem',
      boxSizing: 'border-box',
      maxWidth: 1200,
      margin: 'auto',
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '1.5rem',
        color: '#222'
      }}>
        All Approved Events
      </h1>

      <input
        type="text"
        placeholder="Search events by name or location..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '0.75rem',
          fontSize: '1rem',
          borderRadius: '8px',
          border: '1px solid #ccc',
          marginBottom: '1.5rem',
        }}
      />

      {loading && <p style={{ color: '#222' }}>Loading events...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
        gap: '1.5rem',
      }}>
        {filteredEvents.length === 0 && !loading && <p style={{ color: '#222' }}>No events found.</p>}

        {filteredEvents.map(event => (
          <div
            key={event._id}
            style={{
              backgroundColor: '#f8f8f8',
              color: '#222',
              borderRadius: '8px',
              padding: '1rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              textAlign: 'center',
            }}
            onClick={() => navigate(`/events/${event._id}`)}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h3>{event.title}</h3>
            <p>{new Date(event.date).toLocaleDateString()}</p>
            <p>{event.location}</p>
            <p>Price: ${event.ticketPrice}</p>
            <p>Remaining Tickets: {event.remainingTickets}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
