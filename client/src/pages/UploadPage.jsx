import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { uploadDeckPdf } from "../api/decks";

function UploadPage() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await uploadDeckPdf({ file, title });
      navigate(`/study/${response.deck._id}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to generate flashcards.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-xl px-4 py-12">
      <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold text-slate-900">
        Build Your Study Deck
      </motion.h2>
      <p className="mt-2 text-slate-600">
        Drop a PDF and let the AI teacher craft concept-rich flashcards with worked examples.
      </p>

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="glass-card mt-6 space-y-5 rounded-3xl p-6"
      >
        <label className="block text-sm font-medium text-slate-700">
          Deck Title (optional)
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Fractions - Class 6"
            className="mt-1 w-full rounded-xl border border-white/70 bg-white/75 px-3 py-2.5 outline-none transition focus:border-indigo-400"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          PDF File
          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            className="mt-1 block w-full rounded-xl border border-white/70 bg-white/75 px-3 py-2.5 text-sm"
          />
        </label>

        {error && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 px-4 py-2.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Generating smart flashcards..." : "Generate Flashcards"}
        </button>
      </motion.form>
    </section>
  );
}

export default UploadPage;
