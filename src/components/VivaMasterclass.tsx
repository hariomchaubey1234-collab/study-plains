import React, { useState } from 'react';
import { VIVA_QUESTIONS } from '../data/vivaData';
import { VivaQuestion } from '../types/scratch';
import { GraduationCap, Award, HelpCircle, CheckCircle, ChevronRight, Eye, EyeOff, BookOpen, Star } from 'lucide-react';
import { sound } from '../utils/audio';

interface VivaMasterclassProps {
  onSwitchToStage: () => void;
  onSwitchToBlocks: () => void;
  onSwitchToDeck: () => void;
}

export const VivaMasterclass: React.FC<VivaMasterclassProps> = ({
  onSwitchToStage,
  onSwitchToBlocks,
  onSwitchToDeck,
}) => {
  const [activeQuestionId, setActiveQuestionId] = useState<string>('viva-1');
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({
    'viva-1': true,
  });
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const toggleReveal = (id: string) => {
    sound.playPop();
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRate = (id: string, score: number) => {
    sound.playCorrect();
    setRatings((prev) => ({ ...prev, [id]: score }));
  };

  const activeQ = VIVA_QUESTIONS.find((q) => q.id === activeQuestionId) || VIVA_QUESTIONS[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl text-slate-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Lab Presentation & Viva Voce
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">Oral Examination Preparation</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">
            Professor Viva Defense & Technical Defense Strategies
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Master the exact phrases, computer science terminology, and live demonstration cues required to
            explain your Scratch project with maximum academic rigor.
          </p>
        </div>

        {/* 3 Core Presentation Anchors Highlight */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              onSwitchToStage();
            }}
            className="px-2.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg transition-colors border border-amber-500/30"
          >
            Show Variables on Stage
          </button>
          <button
            onClick={() => {
              sound.playPop();
              onSwitchToBlocks();
            }}
            className="px-2.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-lg transition-colors border border-sky-500/30"
          >
            Show Control Flow
          </button>
          <button
            onClick={() => {
              sound.playPop();
              onSwitchToDeck();
            }}
            className="px-2.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-lg transition-colors border border-emerald-500/30"
          >
            Show Modular Decks
          </button>
        </div>
      </div>

      {/* The 3 Core Lab Presentation Tips (Explicitly highlighted from the user brief) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tip 1: Show the Variables */}
        <div className="bg-slate-950 border-2 border-amber-500/40 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Show the Variables
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Explain how <strong className="text-amber-400">Score</strong> tracks the state dynamically just
            like a database counter or session accumulator in memory.
          </p>
          <div className="bg-slate-900 border border-slate-800 rounded p-2 text-[11px] text-slate-400 font-mono">
            "Score is initialized to 0 and atomically incremented upon each truth predicate resolution."
          </div>
        </div>

        {/* Tip 2: Show Control Flow */}
        <div className="bg-slate-950 border-2 border-sky-500/40 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider">
              Show Control Flow
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Point out how the <strong className="text-sky-400">if / else</strong> block processes user input
            strings, handles positive outcomes, and provides targeted fallback feedback.
          </p>
          <div className="bg-slate-900 border border-slate-800 rounded p-2 text-[11px] text-slate-400 font-mono">
            "The C-shaped block forms a deterministic binary branch: then for reward, else for remediation."
          </div>
        </div>

        {/* Tip 3: Modular Design */}
        <div className="bg-slate-950 border-2 border-emerald-500/40 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Modular Design
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Mention how easy it is to add more questions (decks) just by duplicating the Question Unit blocks
            without modifying the global orchestration or broadcast loop.
          </p>
          <div className="bg-slate-900 border border-slate-800 rounded p-2 text-[11px] text-slate-400 font-mono">
            "Adheres to the Open-Closed Principle: open for deck expansion, closed for core modifications."
          </div>
        </div>
      </div>

      {/* Interactive Viva Questions Defense Practice Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Left Column: Question Selector */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Examiner Viva Prompts
          </span>
          <div className="space-y-2">
            {VIVA_QUESTIONS.map((q) => {
              const isSelected = q.id === activeQuestionId;
              const userRating = ratings[q.id];

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    sound.playPop();
                    setActiveQuestionId(q.id);
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500 shadow-md text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="text-amber-400 uppercase">{q.category}</span>
                    {userRating ? (
                      <span className="text-emerald-400 font-bold">{userRating}/10 pts</span>
                    ) : (
                      <span className="text-slate-500">Unscored</span>
                    )}
                  </div>
                  <div className="text-xs font-medium line-clamp-2">{q.professorPrompt}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Model Defense Script & Rubric */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-5">
          {/* Question Header */}
          <div className="pb-3 border-b border-slate-800 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400">{activeQ.category} Defense</span>
                <span className="text-xs text-slate-500">·</span>
                <span className="text-xs text-slate-400">Max Score: {activeQ.rubricScoreMax} Pts</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-100 mt-1 italic">
                "{activeQ.professorPrompt}"
              </h3>
            </div>

            <button
              onClick={() => toggleReveal(activeQ.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors shrink-0"
            >
              {revealedAnswers[activeQ.id] ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Hide Script</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reveal Defense Script</span>
                </>
              )}
            </button>
          </div>

          {/* Model Answer Body */}
          {revealedAnswers[activeQ.id] && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                  Recommended Student Model Response
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {activeQ.studentModelAnswer}
                </p>
              </div>

              {/* Keywords to Speak aloud */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  High-Impact Academic Vocabulary (Mention These!)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeQ.keyTechnicalTerms.map((term, i) => (
                    <span
                      key={i}
                      className="text-xs font-mono bg-amber-950/60 text-amber-300 border border-amber-600/50 px-2 py-0.5 rounded"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>

              {/* Examiner Tip */}
              <div className="bg-amber-950/20 border-l-4 border-amber-500 rounded p-3 text-xs text-amber-200/90 leading-relaxed">
                <strong>Viva Master Tip:</strong> {activeQ.vivaTip}
              </div>

              {/* Self-Rating Rubric Bar */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Self-Evaluate Your Defense:</span>
                <div className="flex items-center gap-1">
                  {[6, 7, 8, 9, 10].map((score) => (
                    <button
                      key={score}
                      onClick={() => handleRate(activeQ.id, score)}
                      className={`px-2 py-1 text-xs rounded font-mono font-semibold transition-colors ${
                        ratings[activeQ.id] === score
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
