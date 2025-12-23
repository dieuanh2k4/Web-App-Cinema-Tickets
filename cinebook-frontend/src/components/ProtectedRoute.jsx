import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function ProtectedRoute({ children }) {
  const { user } = useAuthStore()
  const location = useLocation()

  if (!user) {
    // Redirect về trang login, lưu lại trang người dùng định vào
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
