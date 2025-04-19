// Bring in all the needed packages
const express = require('express');       
const mongoose = require('mongoose');     
const dotenv = require('dotenv');         
const cors = require('cors');              
const connectDB = require('./config/db');  

dotenv.config();

//elserver lazem no3o yebaa express
const app = express();

connectDB();


// Middleware to let Express understand JSON and form data
app.use(express.json());                         
app.use(express.urlencoded({ extended: false })); 
app.use(cors());                                  // Allow frontend to access the API

const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

app.use('/api/users', userRoutes);        
app.use('/api/events', eventRoutes);      
app.use('/api/bookings', bookingRoutes);  

// bengarab haga bas 3ashan el api yebaa shaghala
app.get('/', (req, res) => {
  res.send('API is running...');
});



// A global error handler (runs when something goes wrong)
app.use((err, req, res, next) => {
  console.error(err.stack); // Show error in terminal
  res.status(500).json({ message: 'Something went wrong!' }); // Send  error to user
});



// Start the server 
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log("Server running on http://localhost:${PORT}");
});