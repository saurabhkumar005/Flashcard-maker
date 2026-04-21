function ProgressBar({ value = 0 }) {
  const clamped = Math.max(0, Math.min(100, value));
  const colorClass =
    clamped < 35
      ? "from-rose-500 to-rose-400"
      : clamped < 70
        ? "from-amber-500 to-yellow-400"
        : "from-emerald-500 to-green-400";

  return (
    <div className="w-full rounded-full bg-slate-200">
      <div
        className={`h-3 rounded-full bg-gradient-to-r transition-all duration-500 ${colorClass}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export default ProgressBar;
