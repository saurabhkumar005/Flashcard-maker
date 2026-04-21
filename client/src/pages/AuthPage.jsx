import { useState } from "react";
import { Navigate } from "react-router-dom";
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
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Welcome to FlashCard Maker</h2>
        <p className="mt-2 text-sm text-slate-600">Save your decks and track mastery with spaced repetition.</p>

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setMode("login")}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === "login" ? "bg-white text-slate-900" : "text-slate-600"}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === "signup" ? "bg-white text-slate-900" : "text-slate-600"}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          {mode === "signup" && (
            <input
              required
              placeholder="Full name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          )}
          <input
            type="email"
            required
            placeholder="Email"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          />
          {error && <p className="rounded-lg bg-rose-50 p-2 text-sm text-rose-600">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AuthPage;
