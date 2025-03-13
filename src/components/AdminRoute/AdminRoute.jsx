import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function AdminRoute({ component: Component, redirectTo = "/" }) {
  //turned off for testing
  const { isLoggedIn, isRefreshing, user } = useAuth();
  const shouldRedirect = !(isLoggedIn && user.admin) && !isRefreshing;
  // const shouldRedirect = false;

  return shouldRedirect ? <Navigate to={redirectTo} /> : Component;
}
