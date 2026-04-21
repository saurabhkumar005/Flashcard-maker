import { motion } from "framer-motion";

function Flashcard({ card, showAnswer, onFlip }) {
  const MotionDiv = motion.div;

  return (
    <div className="perspective-1000 min-h-[320px] w-full">
      <MotionDiv
        onClick={onFlip}
        className="relative h-[340px] w-full cursor-pointer"
        animate={{ rotateY: showAnswer ? 180 : 0 }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.55 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 rounded-3xl border border-white/65 bg-gradient-to-br from-white/90 to-indigo-50/80 p-6 shadow-xl [backface-visibility:hidden]">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-600">Question</p>
          <p className="text-lg leading-relaxed text-slate-900">{card.question}</p>
          <p className="mt-6 text-sm font-medium text-slate-500">Tap card to reveal answer</p>
        </div>

        <div className="absolute inset-0 rounded-3xl border border-white/65 bg-gradient-to-br from-indigo-100/85 via-violet-100/75 to-emerald-100/70 p-6 shadow-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-700">Answer</p>
          <p className="text-lg leading-relaxed text-slate-900">{card.answer}</p>
          <p className="mt-6 text-sm font-medium text-slate-700">Tap card to see question again</p>
        </div>
      </MotionDiv>
    </div>
  );
}

export default Flashcard;
