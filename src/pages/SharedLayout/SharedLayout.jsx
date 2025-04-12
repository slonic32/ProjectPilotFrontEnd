import css from "./SharedLayout.module.css";
import { Outlet, NavLink } from "react-router-dom";
import { Suspense } from "react";

export default function SharedLayout() {
  return (
    <>
      <header className={css.header}>
        <div className={css.navbar}>
          <div className={css.brand}>ProjectPilot</div>
          <nav className={css.navLinks}>
            <NavLink to="/" className={css.link}>Home</NavLink>
            <NavLink to="/adduser" className={css.link}>Add User</NavLink>
            <NavLink to="/signin" className={css.link}>Login</NavLink>
            <NavLink to="/logout" className={css.link}>Logout</NavLink>
          </nav>
        </div>
      </header>

      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
}
