import React from "react";
import PropTypes from "prop-types";
import "./Sidebar.css";

/**
 * PUBLIC_INTERFACE
 * Sidebar navigation with app branding, theme toggle, and new note button.
 */
function Sidebar({ onCreate, theme, onToggleTheme }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-app-title">
        <span role="img" aria-label="notebook">
          📝
        </span>
        <span>Notes</span>
      </div>
      <nav className="sidebar-nav">
        {/* Could be extended for navigation */}
        <button className="primary-btn" onClick={onCreate}>
          ＋ New Note
        </button>
      </nav>
      <div className="sidebar-bottom">
        <button
          className="theme-toggle-btn"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          onClick={onToggleTheme}
        >
          {theme === "light" ? "🌙" : "☀️"} {theme === "light" ? "Dark" : "Light"}
        </button>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  onCreate: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
  onToggleTheme: PropTypes.func.isRequired,
};

export default Sidebar;
