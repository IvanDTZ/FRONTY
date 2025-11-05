import { NavLink } from "react-router-dom";

const link = ({ isActive }: { isActive: boolean }) =>
  `block px-4 py-3 rounded-xl transition ${
    isActive
      ? "bg-[var(--color-vans-burgundy)] text-white"
      : "hover:bg-white/5 text-white/80"
  }`;

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-black/40 backdrop-blur border-r border-white/10 p-4 flex flex-col">
      <div className="text-3xl font-black tracking-wide mb-2">VANS</div>
      <div className="text-xs opacity-70 mb-6">“OFF THE WALL”</div>
      <nav className="space-y-2">
        <NavLink to="/" className={link}>
          Overview
        </NavLink>
        <NavLink to="/audience" className={link}>
          Audience
        </NavLink>
        <NavLink to="/demographics" className={link}>
          Demographics
        </NavLink>
        <NavLink to="/terms" className={link}>
          Terms & Emojis
        </NavLink>
        <NavLink to="/geography" className={link}>
          Geography
        </NavLink>
        <NavLink to="/influencers" className={link}>
          Influencers
        </NavLink>
        <NavLink to="/events" className={link}>
          Events
        </NavLink>
      </nav>
      <div className="mt-auto text-[10px] opacity-50">Dashboard</div>
    </aside>
  );
}

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 bg-[var(--color-vans-burgundy)]/85 backdrop-blur border-b border-white/10">
      <div className="px-6 py-3 h1">Social Listening</div>
    </header>
  );
}
