import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export default function CreateEvent() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [totalTickets, setTotalTickets] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Make sure this line is NOT missing!

    const newEvent = {
      title,
      description,
      date,
      location,
      category,
      ticketPrice: parseFloat(ticketPrice),
      totalTickets: parseInt(totalTickets),
      organizerId: user?.id, // use optional chaining for safety
    };

    try {
      const res = await fetch('http://localhost:5000/api/v1/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newEvent)
      });

      const data = await res.json();

      if (res.ok) {
        alert('Event created successfully!');
        navigate('/my-events');
      } else {
        alert('Failed to create event: ' + data.message);
      }
    } catch (error) {
      console.error('Error submitting event:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Create a New Event</h2>

      <form method="post" onSubmit={handleSubmit} style={{
        display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px'
      }}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <input type="number" placeholder="Ticket Price" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} required />
        <input type="number" placeholder="Total Tickets" value={totalTickets} onChange={(e) => setTotalTickets(e.target.value)} required />
        <button type="submit" style={{
          padding: '0.5rem 1rem', backgroundColor: '#1976d2',
          color: 'white', border: 'none', borderRadius: '4px'
        }}>
          Submit Event
        </button>
      </form>
    </div>
  );
}
