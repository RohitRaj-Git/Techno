import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

/**
 * Wraps protected routes — if the user has no active session,
 * they're redirected to /login.
 */
export default function AuthGuard({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
