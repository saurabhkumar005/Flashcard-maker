import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Flashcard from "../components/Flashcard";
import MasteryButtons from "../components/MasteryButtons";
import ProgressBar from "../components/ProgressBar";
import { getDeckById, updateMastery } from "../api/decks";

function StudyPage() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDeck = async () => {
      try {
        setLoading(true);
        const data = await getDeckById(deckId);
        setDeck(data.deck);
        setProgressPercent(data.progressPercent);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load deck.");
      } finally {
        setLoading(false);
      }
    };

    loadDeck();
  }, [deckId]);

  const currentCard = useMemo(() => deck?.cards?.[currentIndex], [deck, currentIndex]);

  const handleMastery = async (masteryLevel) => {
    if (!currentCard) return;

    try {
      setSaving(true);
      const data = await updateMastery({
        deckId,
        cardId: currentCard._id,
        masteryLevel,
      });

      setDeck((prev) => {
        if (!prev) return prev;
        const updatedCards = prev.cards.map((card) =>
          card._id === currentCard._id ? { ...card, masteryLevel } : card
        );
        return { ...prev, cards: updatedCards };
      });

      setProgressPercent(data.progressPercent);
      setShowAnswer(false);
      setCurrentIndex((index) => {
        if (!deck?.cards?.length) return 0;
        return (index + 1) % deck.cards.length;
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to save mastery update.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <section className="mx-auto max-w-4xl px-4 py-10 text-slate-600">Loading deck...</section>;
  }

  if (error && !deck) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-10">
        <p className="rounded-lg bg-rose-50 p-3 text-rose-600">{error}</p>
        <Link to="/" className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2 text-white">
          Back to dashboard
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{deck?.title}</h2>
          <p className="text-sm text-slate-500">
            Card {currentIndex + 1} of {deck?.cards?.length || 0}
          </p>
        </div>
        <Link to="/" className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300">
          Back to Dashboard
        </Link>
      </div>

      <div className="mb-6 space-y-2 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">Mastery Progress</span>
          <span className="font-bold text-slate-900">{progressPercent}%</span>
        </div>
        <ProgressBar value={progressPercent} />
      </div>

      {currentCard && (
        <div className="space-y-4">
          <Flashcard card={currentCard} showAnswer={showAnswer} onFlip={() => setShowAnswer((value) => !value)} />
          <MasteryButtons onSelect={handleMastery} loading={saving} />
        </div>
      )}

      {error && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
    </section>
  );
}

export default StudyPage;
