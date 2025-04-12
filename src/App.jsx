import { Route, Routes } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refresh } from "./redux/auth/operations.js";
import { selectError, selectLoading } from "./redux/selectors.js";
import Loader from "./components/Loader/Loader.jsx";
import RestrictedRoute from "./components/RestrictedRoute/RestrictedRoute.jsx";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx";
import AdminRoute from "./components/AdminRoute/AdminRoute.jsx";
import { Toaster } from "react-hot-toast";
import SharedLayout from "./pages/SharedLayout/SharedLayout.jsx";

import { useAuth } from "./hooks/useAuth.js";

// Lazy-loaded pages
const HomePage = lazy(() => import("./pages/HomePage/HomePage.jsx"));
const SignInPage = lazy(() => import("./pages/SignInPage/SignInPage.jsx"));
const AddUser = lazy(() => import("./pages/AddUser/AddUser.jsx"));
const LogOut = lazy(() => import("./pages/LogOut/LogOut.jsx"));
const ErrorPage = lazy(() => import("./pages/ErrorPage/ErrorPage.jsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage/ProfilePage.jsx"));
const ClientManagement = lazy(() =>
  import("./pages/ClientManagement/ClientManagement.jsx")
);
const AdminPanel = lazy(() => import("./pages/AdminPanel/AdminPanel.jsx"));


export default function App() {
  const dispatch = useDispatch();
  const { isRefreshing } = useAuth();

  useEffect(() => {
    dispatch(refresh());
  }, [dispatch]);

  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  return isRefreshing ? (
    <b>Refreshing user...</b>
  ) : (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            <Route
              index
              element={
                <PrivateRoute redirectTo="/signin" component={<HomePage />} />
              }
            />
            <Route
              path="/adduser"
              element={
                <AdminRoute redirectTo="/signin" component={<AddUser />} />
              }
            />
            <Route
              path="/signin"
              element={
                <RestrictedRoute redirectTo="/" component={<SignInPage />} />
              }
            />
            <Route
              path="/admin-panel"
              element={
                <AdminRoute redirectTo="/signin" component={<AdminPanel />} />
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute
                  redirectTo="/signin"
                  component={<ProfilePage />}
                />
              }
            />
            <Route
              path="/clients"
              element={
                <PrivateRoute
                  redirectTo="/signin"
                  component={<ClientManagement />}
                />
              }
            />
            <Route
              path="/logout"
              element={
                <PrivateRoute redirectTo="/signin" component={<LogOut />} />
              }
            />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
      {loading && <Loader />}
    </div>
  );
}
