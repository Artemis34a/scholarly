import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { homePathForRole } from './paths'

export default function PrivateRoute({ children, allowedRoles }) {
  const { authenticated, user } = useAuth()
  if (!authenticated) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={homePathForRole(user?.role)} replace />
  }

  return children
}
