import { motion } from "framer-motion";

function Flashcard({ card, showAnswer, onFlip }) {
  const MotionDiv = motion.div;

  return (
    <div className="perspective-1000 min-h-[320px] w-full">
      <MotionDiv
        onClick={onFlip}
        className="relative h-[320px] w-full cursor-pointer"
        animate={{ rotateY: showAnswer ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm [backface-visibility:hidden]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-indigo-600">Question</p>
          <p className="text-lg text-slate-900">{card.question}</p>
          <p className="mt-6 text-sm text-slate-500">Click to reveal answer</p>
        </div>

        <div className="absolute inset-0 rounded-2xl border border-slate-200 bg-indigo-50 p-6 shadow-sm [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-indigo-700">Answer</p>
          <p className="text-lg text-slate-900">{card.answer}</p>
          <p className="mt-6 text-sm text-slate-600">Click to see question again</p>
        </div>
      </MotionDiv>
    </div>
  );
}

export default Flashcard;
