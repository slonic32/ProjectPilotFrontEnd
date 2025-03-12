import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function RestrictedRoute({
  component: Component,
  redirectTo = '/',
}) {
  //turn off auth for testing
  const { isLoggedIn } = useAuth();
  // const isLoggedIn = false;

  return isLoggedIn ? <Navigate to={redirectTo} /> : Component;
}
