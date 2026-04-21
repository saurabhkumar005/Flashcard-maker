import { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

function AuthPage() {
  const { isAuthenticated, login, signUp } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      if (mode === "signup") {
        await signUp(form);
      } else {
        await login({ email: form.email, password: form.password });
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6"
      >
        <h2 className="bg-gradient-to-r from-indigo-700 via-violet-600 to-emerald-600 bg-clip-text text-3xl font-extrabold text-transparent">
          Welcome to FlashCard Maker
        </h2>
        <p className="mt-2 text-sm text-slate-700">Save progress, unlock mastery streaks, and learn with confidence.</p>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-white/75 p-1.5">
          <button
            onClick={() => setMode("login")}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${mode === "login" ? "bg-gradient-to-r from-indigo-600 to-violet-500 text-white" : "text-slate-600"}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${mode === "signup" ? "bg-gradient-to-r from-indigo-600 to-violet-500 text-white" : "text-slate-600"}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          {mode === "signup" && (
            <input
              required
              placeholder="Full name"
              className="w-full rounded-xl border border-white/70 bg-white/80 px-3 py-2.5"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          )}
          <input
            type="email"
            required
            placeholder="Email"
            className="w-full rounded-xl border border-white/70 bg-white/80 px-3 py-2.5"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            className="w-full rounded-xl border border-white/70 bg-white/80 px-3 py-2.5"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          />
          {error && <p className="rounded-lg bg-rose-50 p-2 text-sm text-rose-600">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 px-4 py-2.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Login"}
          </button>
        </form>
      </motion.div>
    </section>
  );
}

export default AuthPage;
