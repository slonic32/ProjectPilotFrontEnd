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
        <div className={css.navbar}>
          <div className={css.brand}>ProjectPilot</div>
          <nav className={css.navLinks}>
            <NavLink to="/" className={css.link}>
              Home page
            </NavLink>


            {isLoggedIn ? (
              <NavLink to="/profile" className={css.link}>
                {user.name} {/* Show user's name */}
              </NavLink>
            ) : (
              <NavLink to="/signin" className={css.link}>
                Login
              </NavLink>
            )}


            {isLoggedIn && user.admin && (
              <NavLink to="/adduser" className={css.link}>
                Add User
              </NavLink>
            )}


            {isLoggedIn && (
              <NavLink to="/logout" className={css.link}>
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
