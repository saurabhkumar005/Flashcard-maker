import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Flashcard from "../components/Flashcard";
import MasteryButtons from "../components/MasteryButtons";
import ProgressBar from "../components/ProgressBar";
import { getDeckById, updateMastery } from "../api/decks";

const ENCOURAGEMENTS = [
  "Great job! Your neural pathways are getting stronger!",
  "Excellent work. You're building long-term memory!",
  "Mastery unlocked. Keep the momentum going!",
  "Brilliant recall! Your future self will thank you.",
];

function StudyPage() {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [celebration, setCelebration] = useState(null);

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
      if (masteryLevel === "mastered") {
        const text = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
        setCelebration({ id: Date.now(), text });
        window.setTimeout(() => setCelebration(null), 2200);
      }
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
      <AnimatePresence>
        {celebration && (
          <motion.div
            initial={{ opacity: 0, y: -18, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18 }}
            className="fixed right-4 top-20 z-40 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-lg"
          >
            <p className="text-sm font-semibold text-emerald-700">{celebration.text}</p>
            <div className="mt-2 flex gap-1">
              {[...Array(10)].map((_, index) => (
                <motion.span
                  key={index}
                  initial={{ y: 0, opacity: 1 }}
                  animate={{ y: index % 2 ? -8 : -14, opacity: 0 }}
                  transition={{ duration: 0.7, delay: index * 0.03 }}
                  className="inline-block h-2 w-2 rounded-full bg-emerald-500"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
          {showAnswer && currentCard.teacherTip && (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">Teacher&apos;s Note</p>
              <p className="mt-1 text-sm text-indigo-900">{currentCard.teacherTip}</p>
            </div>
          )}
          <MasteryButtons onSelect={handleMastery} loading={saving} />
        </div>
      )}

      {error && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
    </section>
  );
}

export default StudyPage;
