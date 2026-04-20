import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <section className="mx-auto max-w-xl px-4 py-10">
      <h2 className="text-2xl font-bold text-slate-900">Upload PDF and Generate Deck</h2>
      <p className="mt-2 text-slate-600">The AI teacher will create 10 concept-heavy flashcards with edge cases and examples.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium text-slate-700">
          Deck Title (optional)
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Fractions - Class 6"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          PDF File
          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm"
          />
        </label>

        {error && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}

        <button
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Generating smart flashcards..." : "Generate Flashcards"}
        </button>
      </form>
    </section>
  );
}

export default UploadPage;
