import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">VANS</div>
      <div className="tagline">“OFF THE WALL”</div>
      <nav className="nav">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Overview
        </NavLink>
        <NavLink
          to="/audience"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Audience
        </NavLink>
        <NavLink
          to="/demographics"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Demographics
        </NavLink>
        <NavLink
          to="/terms"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Terms & Emojis
        </NavLink>
        <NavLink
          to="/geography"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Geography
        </NavLink>
        <NavLink
          to="/influencers"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Influencers
        </NavLink>
        <NavLink
          to="/events"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Events
        </NavLink>
      </nav>
      <div style={{ marginTop: "auto", opacity: 0.5, fontSize: 10 }}>
        Dashboard
      </div>
    </aside>
  );
}

export function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-inner">Social Listening</div>
    </header>
  );
}
