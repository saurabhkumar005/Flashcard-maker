function ProgressBar({ value = 0 }) {
  return (
    <div className="w-full rounded-full bg-slate-200">
      <div
        className="h-3 rounded-full bg-emerald-500 transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default ProgressBar;
