import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import EventsPage from './EventsPage';  // Import the new page
import { AuthProvider,useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import UserProfile from './UserProfile'
import MyBookings from './MyBookings';
import EventDetails from './EventDetails';
import MyEvents from './MyEvents';

import CreateEvent from './CreateEvent';

function App() {

  return (
    
    <AuthProvider>
      <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />

       <Route path="/events" element={<EventsPage />} />   {/* New route */}
     
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/my-events" element={<MyEvents />} />            {/* New route */}
        <Route path="/create-event" element={<CreateEvent />} />

      </Routes>
      </Router>
      </AuthProvider>
    
  );
}

export default App;
