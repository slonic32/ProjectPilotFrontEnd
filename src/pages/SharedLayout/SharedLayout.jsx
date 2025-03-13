import css from "./SharedLayout.module.css";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Suspense } from "react";

export default function SharedLayout() {
  return (
    <>
      <header className={css.header}>
        <div className={css.container}>
          <nav>
            <NavLink to="/" className={css.headerLink}>
              Home page
            </NavLink>

            <NavLink to="/signup" className={css.headerLink}>
              Add User
            </NavLink>
            <NavLink to="/signin" className={css.headerLink}>
              Login
            </NavLink>
            <NavLink to="/logout" className={css.headerLink}>
              Logout
            </NavLink>
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
