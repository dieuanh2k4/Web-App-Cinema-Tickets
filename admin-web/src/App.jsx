import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Movies from './pages/Movies';
import AddMovie from './pages/AddMovie';
import EditMovie from './pages/EditMovie';

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
            <Route path="rooms" element={<div className="p-6 text-white">Quản lý phòng chiếu (Coming soon)</div>} />
            <Route path="seats" element={<div className="p-6 text-white">Quản lý ghế ngồi (Coming soon)</div>} />
            <Route path="showtimes" element={<div className="p-6 text-white">Quản lý lịch chiếu (Coming soon)</div>} />
            <Route path="ticket-prices" element={<div className="p-6 text-white">Quản lý giá vé (Coming soon)</div>} />
            <Route path="orders" element={<div className="p-6 text-white">Quản lý đơn hàng (Coming soon)</div>} />
            <Route path="accounts" element={<div className="p-6 text-white">Quản lý tài khoản (Coming soon)</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
