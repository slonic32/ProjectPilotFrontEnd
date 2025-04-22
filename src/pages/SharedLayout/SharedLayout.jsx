import css from "./SharedLayout.module.css";
import { Outlet, NavLink } from "react-router-dom";
import { Suspense } from "react";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/images/logo.png";

export default function SharedLayout() {
  const { isLoggedIn, user } = useAuth(); // Get login state and user info

  return (
    <>
      <div className={css.background}>
        <header className={css.header}>
          <div className={css.navbar}>
            <div className={css.brand}>
            <NavLink to="/">
              <img src={logo} alt="Logo" className={css.logo} />
            </NavLink>

            </div>
            <nav className={css.navLinks}>
              {isLoggedIn ? (
                <NavLink to="/profile" className={css.link}>
                  {user.name}
                </NavLink>
              ) : (
                <NavLink to="/signin" className={css.link}>
                  Login
                </NavLink>
              )}

              {isLoggedIn && user.admin && (
                <>
                  <NavLink to="/adduser" className={css.link}>
                    Add User
                  </NavLink>
                  <NavLink to="/admin-panel" className={css.link}>
                    Admin Panel
                  </NavLink>
                </>
              )}

              {isLoggedIn && (
                <NavLink to="/logout" className={css.link}>
                  Logout
                </NavLink>
              )}
            </nav>
          </div>
        </header>

        <main className={css.content}>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </>
  );
}
