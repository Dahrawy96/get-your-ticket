import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import EventsPage from './EventsPage';
import EventDetails from './EventDetails';
import CreateEvent from './CreateEvent';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import UserProfile from './UserProfile';
import MyBookings from './MyBookings';
import EditEvent from './EditEvent';  // Import your new component
import AdminUsersPage from './AdminUsersPage';
import AdminEventsPage from './AdminEventsPage';
import UserEventsPage from './UserEventsPage';
import { AuthProvider,useAuth } from './AuthContext';
import ProtectedRoute from './ProtectedRoutes';




function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
  <Route path="/" element={<WelcomePage />} />

  {/* Public routes */}
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<SignupPage />} />

  {/* Protected routes */}
  <Route
    path="/events"
    element={
      <ProtectedRoute allowedRoles={['organizer', 'admin']}>
        <EventsPage />
      </ProtectedRoute>
    }
  />

  <Route
    path="/events/user"
    element={
      <ProtectedRoute allowedRoles={['user']}>
        <UserEventsPage />
      </ProtectedRoute>
    }
  />

  <Route
    path="/events/:id"
    element={
      <ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}>
        <EventDetails />
      </ProtectedRoute>
    }
  />

  <Route
    path="/create-event"
    element={
      <ProtectedRoute allowedRoles={['organizer']}>
        <CreateEvent />
      </ProtectedRoute>
    }
  />

  <Route
    path="/edit-event/:id"
    element={
      <ProtectedRoute allowedRoles={['organizer']}>
        <EditEvent />
      </ProtectedRoute>
    }
  />

  <Route
    path="/userprofile"
    element={
      <ProtectedRoute allowedRoles={['user', 'organizer', 'admin']}>
        <UserProfile />
      </ProtectedRoute>
    }
  />

  <Route
    path="/my-bookings"
    element={
      <ProtectedRoute allowedRoles={['user']}>
        <MyBookings />
      </ProtectedRoute>
    }
  />

  <Route
    path="/admin/users"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminUsersPage />
      </ProtectedRoute>
    }
  />

  <Route
    path="/admin/events"
    element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminEventsPage />
      </ProtectedRoute>
    }
  />
</Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
