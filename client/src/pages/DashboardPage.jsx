import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import { getDecks } from "../api/decks";

function DashboardPage() {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDecks = async () => {
      try {
        setLoading(true);
        const data = await getDecks();
        setDecks(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load decks.");
      } finally {
        setLoading(false);
      }
    };

    loadDecks();
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Mastery Dashboard</h2>
        <Link className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700" to="/upload">
          + Create New Deck
        </Link>
      </div>

      {loading && <p className="text-slate-600">Loading decks...</p>}
      {error && <p className="rounded-lg bg-rose-50 p-3 text-rose-600">{error}</p>}

      {!loading && !error && !decks.length && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
          Upload your first PDF to generate an AI study deck.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {decks.map((deck) => (
          <article key={deck._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
              className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Study Deck
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default DashboardPage;
