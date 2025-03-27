import { useEffect, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { refresh } from "./redux/auth/operations";
import { useAuth } from "./hooks/useAuth";
import SharedLayout from "./pages/SharedLayout/SharedLayout";
import HomePage from "./pages/HomePage/HomePage";
import SignInPage from "./pages/SignInPage/SignInPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import AddUser from "./pages/AddUser/AddUser";
import LogOut from "./pages/LogOut/LogOut";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import RestrictedRoute from "./components/RestrictedRoute/RestrictedRoute";
import AdminRoute from "./components/AdminRoute/AdminRoute";
import { Toaster } from "react-hot-toast";
import Loader from "./components/Loader/Loader";
import { selectLoading, selectError } from "./redux/selectors";

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
              path="/profile"
              element={
                <PrivateRoute redirectTo="/signin" component={<ProfilePage />} />
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