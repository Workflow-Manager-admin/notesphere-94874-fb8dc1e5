import React from "react";

// PUBLIC_INTERFACE
function Navbar({ user, onLogout }) {
  /** Navbar: shows site title, user (if logged in), and login/logout. */
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-title" style={{ color: "var(--primary-color)" }}>
          <b>notesphere</b>
        </span>
      </div>
      <div className="navbar-actions">
        {user ? (
          <>
            <span className="navbar-user">Hello, {user.username}</span>
            <button className="btn btn-small" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
}
export default Navbar;
