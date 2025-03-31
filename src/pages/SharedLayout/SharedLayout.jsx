import css from "./SharedLayout.module.css";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Suspense } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function SharedLayout() {
  const { isLoggedIn, user } = useAuth(); // Get login state and user info
  return (
    <>
      <header className={css.header}>
        <div className={css.container}>
          <nav>
            <NavLink to="/" className={css.headerLink}>
              Home page
            </NavLink>

            {isLoggedIn ? (
              <NavLink to="/profile" className={css.headerLink}>
                {user.name} {/* Show user's name */}
              </NavLink>
            ) : (
              <NavLink to="/signin" className={css.headerLink}>
                Login
              </NavLink>
            )}

            {isLoggedIn && user.admin && (
              <NavLink to="/adduser" className={css.headerLink}>
                Add User
              </NavLink>
            )}

            {isLoggedIn && (
              <NavLink to="/logout" className={css.headerLink}>
                Logout
              </NavLink>
            )}
          </nav>
        </div>
      </header>
      <main>
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </>
  );
}
