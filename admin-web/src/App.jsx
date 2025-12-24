import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Movies from './pages/Movies';
import AddMovie from './pages/AddMovie';
import EditMovie from './pages/EditMovie';
import Theaters from './pages/Theaters';
import Rooms from './pages/Rooms';
import Showtimes from './pages/Showtimes';
import ShowtimeSlots from './pages/ShowtimeSlots';
import TicketPrices from './pages/TicketPrices';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Accounts from './pages/Accounts';
import AddAccount from './pages/AddAccount';
import AccountDetail from './pages/AccountDetail';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="movies">
              <Route index element={<Movies />} />
              <Route path="add" element={<AddMovie />} />
              <Route path="edit/:id" element={<EditMovie />} />
            </Route>
            <Route path="theaters" element={<Theaters />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="showtimes" element={<Showtimes />} />
            <Route path="showtime-slots" element={<ShowtimeSlots />} />
            <Route path="ticket-prices" element={<TicketPrices />} />
            <Route path="orders">
              <Route index element={<Orders />} />
              <Route path=":id" element={<OrderDetail />} />
            </Route>
            <Route path="accounts">
              <Route index element={<Accounts />} />
              <Route path="add" element={<AddAccount />} />
              <Route path=":id" element={<AccountDetail />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
