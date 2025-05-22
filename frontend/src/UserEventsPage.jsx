import React, { useState, useEffect } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';
import './UserEventsPage.css';  // Make sure this path matches your project
import ticketphoto from './assets/ticketphoto.jpeg';  // Your background image


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
  <div
    style={{
      position: 'relative',
      minHeight: '100vh',
      backgroundImage: `url(${ticketphoto})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
  >
    {/* Overlay */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black overlay
        zIndex: 0,
      }}
    />

    {/* Actual content */}
    <div className="user-events-container" style={{ position: 'relative', zIndex: 1 }}>
      <h1>All Events</h1>

      <input
        type="text"
        placeholder="Search events by name or location..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="user-events-search"
      />

      {loading && <p>Loading events...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="events-grid">
        {filteredEvents.length === 0 && !loading && <p className="no-events-message">No events found.</p>}

        {filteredEvents.map(event => (
          <div
            key={event._id}
            className="event-card"
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
  </div>
);

}
