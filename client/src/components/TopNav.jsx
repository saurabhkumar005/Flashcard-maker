import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const navClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-md"
      : "bg-white/80 text-slate-700 hover:bg-white"
  }`;

function TopNav() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-white/40 bg-white/45 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <motion.h1
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-700 via-violet-600 to-emerald-600 bg-clip-text text-lg font-extrabold text-transparent"
        >
          FlashCard Maker
        </motion.h1>
        {isAuthenticated ? (
          <nav className="flex items-center gap-2">
            <NavLink to="/" className={navClass}>
              Dashboard
            </NavLink>
            <NavLink to="/upload" className={navClass}>
              Upload Deck
            </NavLink>
            <span className="hidden rounded-full bg-white/85 px-3 py-2 text-xs font-semibold text-slate-700 md:inline">
              {user?.name}
            </span>
            <button
              onClick={logout}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.03] hover:bg-slate-700"
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
