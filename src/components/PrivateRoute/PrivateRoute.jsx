import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function PrivateRoute({
  component: Component,
  redirectTo = '/',
}) {
  //turned off for testing
  const { isLoggedIn, isRefreshing } = useAuth();
  const shouldRedirect = !isLoggedIn && !isRefreshing;
  // const shouldRedirect = false;

  return shouldRedirect ? <Navigate to={redirectTo} /> : Component;
}
