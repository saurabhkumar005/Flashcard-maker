import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"
  }`;

function TopNav() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold text-slate-900">FlashCard Maker</h1>
        {isAuthenticated ? (
          <nav className="flex items-center gap-2">
            <NavLink to="/" className={navClass}>
              Dashboard
            </NavLink>
            <NavLink to="/upload" className={navClass}>
              Upload Deck
            </NavLink>
            <span className="hidden rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 md:inline">
              {user?.name}
            </span>
            <button
              onClick={logout}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Logout
            </button>
          </nav>
        ) : (
          <NavLink to="/auth" className={navClass}>
            Login
          </NavLink>
        )}
      </div>
    </header>
  );
}

export default TopNav;
