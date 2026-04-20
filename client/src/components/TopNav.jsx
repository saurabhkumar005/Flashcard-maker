import { NavLink } from "react-router-dom";

const navClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"
  }`;

function TopNav() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold text-slate-900">FlashCard Maker</h1>
        <nav className="flex gap-2">
          <NavLink to="/" className={navClass}>
            Dashboard
          </NavLink>
          <NavLink to="/upload" className={navClass}>
            Upload Deck
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default TopNav;
