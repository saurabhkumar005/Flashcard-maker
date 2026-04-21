import { motion } from "framer-motion";

const options = [
  { id: "still_learning", label: "Still Learning", className: "from-rose-500 to-red-500" },
  { id: "almost_there", label: "Almost There", className: "from-amber-500 to-orange-500" },
  { id: "mastered", label: "Mastered", className: "from-emerald-500 to-green-500" },
];

function MasteryButtons({ onSelect, loading }) {
  return (
    <div className="grid gap-2 md:grid-cols-3">
      {options.map((option) => (
        <motion.button
          key={option.id}
          onClick={() => onSelect(option.id)}
          disabled={loading}
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`rounded-xl bg-gradient-to-r px-4 py-2.5 text-sm font-semibold text-white shadow-md transition disabled:cursor-not-allowed disabled:opacity-50 ${option.className}`}
        >
          {option.label}
        </motion.button>
      ))}
    </div>
  );
}

export default MasteryButtons;
