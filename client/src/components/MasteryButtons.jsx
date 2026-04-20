const options = [
  { id: "still_learning", label: "Still Learning", className: "bg-rose-500 hover:bg-rose-600" },
  { id: "almost_there", label: "Almost There", className: "bg-amber-500 hover:bg-amber-600" },
  { id: "mastered", label: "Mastered", className: "bg-emerald-600 hover:bg-emerald-700" },
];

function MasteryButtons({ onSelect, loading }) {
  return (
    <div className="grid gap-2 md:grid-cols-3">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          disabled={loading}
          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${option.className}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default MasteryButtons;
