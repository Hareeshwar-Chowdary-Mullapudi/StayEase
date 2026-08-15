import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export const ProtectedRoute = () => {
  const { user, loading } = useAuth()
  if (loading) return <p className="muted">Loading...</p>
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

export const GuestRoute = () => {
  const { user, loading } = useAuth()
  if (loading) return <p className="muted">Loading...</p>
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'guest' && user.role !== 'admin') return <Navigate to="/" replace />
  return <Outlet />
}

export const HostRoute = () => {
  const { user, loading } = useAuth()
  if (loading) return <p className="muted">Loading...</p>
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'host' && user.role !== 'admin') return <Navigate to="/" replace />
  return <Outlet />
}

export const AdminRoute = () => {
  const { user, loading } = useAuth()
  if (loading) return <p className="muted">Loading...</p>
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return <Outlet />
}
