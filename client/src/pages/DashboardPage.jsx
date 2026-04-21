import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProgressBar from "../components/ProgressBar";
import { getDailyGoalStats, getDecks } from "../api/decks";

function DashboardPage() {
  const [decks, setDecks] = useState([]);
  const [dailyGoal, setDailyGoal] = useState({ reviewedToday: 0, dailyGoal: 30 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDecks = async () => {
      try {
        setLoading(true);
        const [decksData, goalData] = await Promise.all([getDecks(), getDailyGoalStats()]);
        setDecks(decksData);
        setDailyGoal(goalData);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load decks.");
      } finally {
        setLoading(false);
      }
    };

    loadDecks();
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-wrap items-center justify-between gap-3"
      >
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Mastery Dashboard</h2>
          <p className="mt-1 text-sm text-slate-600">Track daily consistency and level up every concept.</p>
        </div>
        <Link
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 px-5 py-2.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5"
          to="/upload"
        >
          + Create New Deck
        </Link>
      </motion.div>

      <motion.article
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card mb-6 rounded-3xl p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-700">Daily Goal Tracker</p>
          <p className="text-sm font-bold text-indigo-700">
            {dailyGoal.reviewedToday}/{dailyGoal.dailyGoal} cards reviewed today
          </p>
        </div>
        <div className="mt-3">
          <ProgressBar value={Math.min(100, Math.round((dailyGoal.reviewedToday / Math.max(1, dailyGoal.dailyGoal)) * 100))} />
        </div>
      </motion.article>

      {loading && <p className="text-slate-600">Loading decks...</p>}
      {error && <p className="rounded-lg bg-rose-50 p-3 text-rose-600">{error}</p>}

      {!loading && !error && !decks.length && (
        <div className="glass-card rounded-3xl p-8 text-center text-slate-600">
          Upload your first PDF to generate an AI study deck.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {decks.map((deck, index) => (
          <motion.article
            key={deck._id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="glass-card rounded-3xl p-5"
          >
            <h3 className="text-lg font-semibold text-slate-900">{deck.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{deck.totalCards} cards</p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Mastery Progress</span>
                <span className="font-semibold text-slate-900">{deck.progressPercent}%</span>
              </div>
              <ProgressBar value={deck.progressPercent} />
            </div>
            <Link
              to={`/study/${deck._id}`}
              className="mt-5 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.03] hover:bg-slate-700"
            >
              Study Deck
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default DashboardPage;
