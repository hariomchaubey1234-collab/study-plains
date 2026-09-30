import React, { useState } from 'react';
import { Question } from '../types/scratch';
import { Flag, Play, Sparkles, Copy, Check, ChevronDown, ChevronRight, Layers } from 'lucide-react';
import { sound } from '../utils/audio';

interface BlockWorkspaceProps {
  questions: Question[];
  activePromptIndex: number | null;
  activeSubStepId: string | null;
  onJumpToPrompt?: (index: number) => void;
}

export const BlockWorkspace: React.FC<BlockWorkspaceProps> = ({
  questions,
  activePromptIndex,
  activeSubStepId,
}) => {
  const [copied, setCopied] = useState(false);
  const [expandedPrompts, setExpandedPrompts] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
  });

  const togglePrompt = (p: number) => {
    sound.playPop();
    setExpandedPrompts((prev) => ({ ...prev, [p]: !prev[p] }));
  };

  const handleCopyScript = () => {
    sound.playPop();
    const scriptText = `// Scratch 3.0 Smart Study Flashcards Script
When green flag clicked:
  set [Score v] to [0]
  set [QuestionNumber v] to [1]
  say [Welcome to Smart Study Flashcards!] for (2) seconds
  ask [What is your name?] and wait
  say (join [Hello ] (answer)) for (2) seconds
  
${questions
  .map(
    (q, i) => `// Prompt ${i + 3}: Question ${q.questionNumber}
  ask [${q.questionText}] and wait
  if <(answer) = [${q.correctAnswer}]> then
    say [${q.correctSayText}] for (2) seconds
    change [Score v] by (1)
  else
    say [${q.incorrectSayText}] for (3) seconds`
  )
  .join('\n\n')}

// Prompt 6: Score Calculation & Feedback
  say (join [Quiz Over! Your final score is: ] (Score)) for (3) seconds
  if <(Score) > [2]> then
    say [Awesome! You're a Python Pro! 🏆] for (3) seconds
  else
    say [Keep practicing! You can do better next time. 💪] for (3) seconds

// Prompt 7: Restart / Loop
  ask [Do you want to study again? (yes/no)] and wait
  if <(answer) = [yes]> then
    broadcast [restart_quiz v]
  else
    say [Good luck with your exams! Goodbye!] for (2) seconds
    stop [all v]

When I receive [restart_quiz v]:
  broadcast [green_flag]
`;

    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper for active block highlight
  const isBlockActive = (promptIdx: number, subId?: string) => {
    if (activePromptIndex !== promptIdx) return false;
    if (subId && activeSubStepId && activeSubStepId !== subId) return false;
    return true;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-full text-slate-100">
      {/* Workspace Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Scratch Block Script Editor
          </h3>
          <span className="text-xs text-slate-500">·</span>
          <span className="text-xs text-emerald-400 font-mono">
            {questions.length + 4} Block Clusters
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyScript}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Script!' : 'Copy Script Text'}</span>
          </button>
        </div>
      </div>

      {/* Script Canvas / Blocks Column */}
      <div className="p-4 overflow-y-auto space-y-4 max-h-[720px] font-sans text-xs select-none">
        {/* Main Stack: When Green Flag Clicked */}
        <div className="space-y-1.5">
          {/* Hat Block: When ⚑ clicked (Events: #FFBF00) */}
          <div
            className={`flex items-center gap-2 bg-[#FFBF00] text-slate-950 font-bold px-3 py-2 rounded-t-xl rounded-b-md shadow-md border-b-2 border-amber-600 w-fit transition-all ${
              activePromptIndex === 1 ? 'ring-2 ring-amber-300 shadow-amber-500/30' : ''
            }`}
          >
            <Flag className="w-4 h-4 fill-slate-950" />
            <span>when</span>
            <div className="w-4 h-4 rounded-full bg-emerald-700 flex items-center justify-center">
              <Play className="w-2.5 h-2.5 fill-white text-white translate-x-[0.5px]" />
            </div>
            <span>clicked</span>
          </div>

          {/* ===================== PROMPT 1: INITIALIZATION ===================== */}
          <div className="border-l-2 border-amber-500/40 pl-3 py-1 space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => togglePrompt(1)}
                className="text-[10px] text-amber-400/90 hover:text-amber-300 font-mono flex items-center gap-1"
              >
                {expandedPrompts[1] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                <span>Prompt 1 · Initialization (Resetting Variables)</span>
              </button>
              {activePromptIndex === 1 && (
                <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded animate-pulse">
                  EXECUTING
                </span>
              )}
            </div>

            {expandedPrompts[1] && (
              <div className="space-y-1 pl-1">
                {/* set [Score v] to [0] (Variables: #FF8C1A) */}
                <div
                  className={`flex items-center gap-1.5 bg-[#FF8C1A] text-white font-medium px-3 py-1.5 rounded-md shadow-sm border-b-2 border-orange-700 w-fit transition-all ${
                    isBlockActive(1, 'set_score') ? 'ring-2 ring-white shadow-lg scale-102' : ''
                  }`}
                >
                  <span>set</span>
                  <span className="bg-orange-800 text-orange-100 px-2 py-0.5 rounded text-[11px] font-semibold">
                    Score ▾
                  </span>
                  <span>to</span>
                  <span className="bg-white text-slate-900 px-2 py-0.5 rounded text-[11px] font-bold font-mono">
                    0
                  </span>
                </div>

                {/* set [QuestionNumber v] to [1] */}
                <div
                  className={`flex items-center gap-1.5 bg-[#FF8C1A] text-white font-medium px-3 py-1.5 rounded-md shadow-sm border-b-2 border-orange-700 w-fit transition-all ${
                    isBlockActive(1, 'set_qnum') ? 'ring-2 ring-white shadow-lg scale-102' : ''
                  }`}
                >
                  <span>set</span>
                  <span className="bg-orange-800 text-orange-100 px-2 py-0.5 rounded text-[11px] font-semibold">
                    QuestionNumber ▾
                  </span>
                  <span>to</span>
                  <span className="bg-white text-slate-900 px-2 py-0.5 rounded text-[11px] font-bold font-mono">
                    1
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ===================== PROMPT 2: GREETING & INTRO ===================== */}
          <div className="border-l-2 border-purple-500/40 pl-3 py-1 space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => togglePrompt(2)}
                className="text-[10px] text-purple-400/90 hover:text-purple-300 font-mono flex items-center gap-1"
              >
                {expandedPrompts[2] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                <span>Prompt 2 · Greeting & Introduction</span>
              </button>
              {activePromptIndex === 2 && (
                <span className="text-[9px] bg-purple-400/20 text-purple-300 px-1.5 py-0.2 rounded animate-pulse">
                  EXECUTING
                </span>
              )}
            </div>

            {expandedPrompts[2] && (
              <div className="space-y-1 pl-1">
                {/* say [Welcome to Smart Study Flashcards!] for (2) seconds (Looks: #9966FF) */}
                <div
                  className={`flex items-center gap-1.5 bg-[#9966FF] text-white font-medium px-3 py-1.5 rounded-md shadow-sm border-b-2 border-purple-800 w-fit transition-all ${
                    isBlockActive(2, 'welcome') ? 'ring-2 ring-white shadow-lg scale-102' : ''
                  }`}
                >
                  <span>say</span>
                  <span className="bg-white text-slate-900 px-2 py-0.5 rounded text-[11px] font-medium max-w-xs truncate">
                    Welcome to Smart Study Flashcards!
                  </span>
                  <span>for</span>
                  <span className="bg-white text-slate-900 px-1.5 py-0.5 rounded text-[11px] font-mono">2</span>
                  <span>seconds</span>
                </div>

                {/* ask [What is your name?] and wait (Sensing: #5CB1D6) */}
                <div
                  className={`flex items-center gap-1.5 bg-[#5CB1D6] text-white font-medium px-3 py-1.5 rounded-md shadow-sm border-b-2 border-sky-700 w-fit transition-all ${
                    isBlockActive(2, 'ask_name') ? 'ring-2 ring-white shadow-lg scale-102' : ''
                  }`}
                >
                  <span>ask</span>
                  <span className="bg-white text-slate-900 px-2 py-0.5 rounded text-[11px] font-medium">
                    What is your name?
                  </span>
                  <span>and wait</span>
                </div>

                {/* say (join [Hello ] (answer)) for (2) seconds */}
                <div
                  className={`flex items-center gap-1.5 bg-[#9966FF] text-white font-medium px-3 py-1.5 rounded-md shadow-sm border-b-2 border-purple-800 w-fit transition-all ${
                    isBlockActive(2, 'say_hello') ? 'ring-2 ring-white shadow-lg scale-102' : ''
                  }`}
                >
                  <span>say</span>
                  {/* Operators green block: join */}
                  <div className="flex items-center gap-1 bg-[#59C059] text-white px-2 py-0.5 rounded-full border border-green-600 text-[10px]">
                    <span>join</span>
                    <span className="bg-white text-slate-900 px-1.5 py-0.2 rounded text-[10px]">Hello </span>
                    <span className="bg-[#5CB1D6] text-white px-1.5 py-0.2 rounded-full text-[10px]">answer</span>
                  </div>
                  <span>for</span>
                  <span className="bg-white text-slate-900 px-1.5 py-0.5 rounded text-[11px] font-mono">2</span>
                  <span>seconds</span>
                </div>
              </div>
            )}
          </div>

          {/* ===================== PROMPTS 3 TO N: FLASHCARD QUESTIONS ===================== */}
          {questions.map((q, idx) => {
            const promptNum = idx + 3;
            const isExpanded = expandedPrompts[promptNum] ?? true;
            const isActive = activePromptIndex === promptNum;

            return (
              <div key={q.id} className="border-l-2 border-sky-500/40 pl-3 py-1 space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <button
                    onClick={() => togglePrompt(promptNum)}
                    className="text-[10px] text-sky-400/90 hover:text-sky-300 font-mono flex items-center gap-1"
                  >
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    <span>Prompt {promptNum} · Flashcard Q{q.questionNumber} ({q.topic})</span>
                  </button>
                  {isActive && (
                    <span className="text-[9px] bg-sky-400/20 text-sky-300 px-1.5 py-0.2 rounded animate-pulse">
                      EXECUTING
                    </span>
                  )}
                </div>

                {isExpanded && (
                  <div className="space-y-1.5 pl-1">
                    {/* ask [Q...] and wait */}
                    <div
                      className={`flex items-center gap-1.5 bg-[#5CB1D6] text-white font-medium px-3 py-1.5 rounded-md shadow-sm border-b-2 border-sky-700 w-fit transition-all ${
                        isActive && activeSubStepId === 'ask' ? 'ring-2 ring-white shadow-lg scale-102' : ''
                      }`}
                    >
                      <span>ask</span>
                      <span className="bg-white text-slate-900 px-2 py-0.5 rounded text-[11px] font-medium max-w-sm truncate">
                        {q.questionText}
                      </span>
                      <span>and wait</span>
                    </div>

                    {/* C-Shape Control: if <(answer) = [...]> then ... else ... (Control: #FFAB19) */}
                    <div className="bg-[#FFAB19] text-slate-950 font-bold rounded-lg p-1.5 shadow-md border-b-2 border-amber-600 max-w-lg space-y-1.5">
                      {/* If condition header */}
                      <div className="flex items-center gap-2 px-1">
                        <span>if</span>
                        {/* Operator: < (answer) = [answer] > */}
                        <div className="flex items-center gap-1 bg-[#59C059] text-white px-2 py-0.5 rounded-full border border-green-600 text-[10px]">
                          <span className="bg-[#5CB1D6] text-white px-1.5 py-0.2 rounded-full">answer</span>
                          <span className="font-bold">=</span>
                          <span className="bg-white text-slate-900 px-2 py-0.2 rounded font-mono font-bold">
                            {q.correctAnswer}
                          </span>
                        </div>
                        <span>then</span>
                      </div>

                      {/* THEN Branch */}
                      <div className="bg-slate-900/60 rounded p-2 ml-3 space-y-1 border-l-2 border-emerald-400">
                        {/* say [Correct! ...] for (2) seconds */}
                        <div className="flex items-center gap-1.5 bg-[#9966FF] text-white font-medium px-2.5 py-1 rounded text-[11px] w-fit">
                          <span>say</span>
                          <span className="bg-white text-slate-900 px-1.5 py-0.2 rounded">{q.correctSayText}</span>
                          <span>for</span>
                          <span className="bg-white text-slate-900 px-1 py-0.2 rounded font-mono">2</span>
                          <span>seconds</span>
                        </div>

                        {/* change [Score v] by (1) */}
                        <div className="flex items-center gap-1.5 bg-[#FF8C1A] text-white font-medium px-2.5 py-1 rounded text-[11px] w-fit">
                          <span>change</span>
                          <span className="bg-orange-800 text-orange-100 px-1.5 py-0.2 rounded">Score ▾</span>
                          <span>by</span>
                          <span className="bg-white text-slate-900 px-1 py-0.2 rounded font-mono">1</span>
                        </div>
                      </div>

                      {/* ELSE Header */}
                      <div className="px-1 font-bold text-slate-950">else</div>

                      {/* ELSE Branch */}
                      <div className="bg-slate-900/60 rounded p-2 ml-3 space-y-1 border-l-2 border-rose-400">
                        {/* say [Incorrect. ...] for (3) seconds */}
                        <div className="flex items-center gap-1.5 bg-[#9966FF] text-white font-medium px-2.5 py-1 rounded text-[11px] w-fit">
                          <span>say</span>
                          <span className="bg-white text-slate-900 px-1.5 py-0.2 rounded">{q.incorrectSayText}</span>
                          <span>for</span>
                          <span className="bg-white text-slate-900 px-1 py-0.2 rounded font-mono">3</span>
                          <span>seconds</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* ===================== PROMPT 6: SCORE CALCULATION & FEEDBACK ===================== */}
          <div className="border-l-2 border-emerald-500/40 pl-3 py-1 space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => togglePrompt(6)}
                className="text-[10px] text-emerald-400/90 hover:text-emerald-300 font-mono flex items-center gap-1"
              >
                {expandedPrompts[6] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                <span>Prompt 6 · Score Calculation & Feedback</span>
              </button>
              {activePromptIndex === 6 && (
                <span className="text-[9px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.2 rounded animate-pulse">
                  EXECUTING
                </span>
              )}
            </div>

            {expandedPrompts[6] && (
              <div className="space-y-1.5 pl-1">
                {/* say (join [Quiz Over! Your final score is: ] (Score)) for (3) seconds */}
                <div
                  className={`flex items-center gap-1.5 bg-[#9966FF] text-white font-medium px-3 py-1.5 rounded-md shadow-sm border-b-2 border-purple-800 w-fit transition-all ${
                    isBlockActive(6, 'score_report') ? 'ring-2 ring-white shadow-lg scale-102' : ''
                  }`}
                >
                  <span>say</span>
                  <div className="flex items-center gap-1 bg-[#59C059] text-white px-2 py-0.5 rounded-full border border-green-600 text-[10px]">
                    <span>join</span>
                    <span className="bg-white text-slate-900 px-1.5 py-0.2 rounded">Quiz Over! Your final score is: </span>
                    <span className="bg-[#FF8C1A] text-white px-1.5 py-0.2 rounded-full font-mono">Score</span>
                  </div>
                  <span>for</span>
                  <span className="bg-white text-slate-900 px-1.5 py-0.5 rounded text-[11px] font-mono">3</span>
                  <span>seconds</span>
                </div>

                {/* if < (Score) > [2] > then ... else ... */}
                <div className="bg-[#FFAB19] text-slate-950 font-bold rounded-lg p-1.5 shadow-md border-b-2 border-amber-600 max-w-lg space-y-1.5">
                  <div className="flex items-center gap-2 px-1">
                    <span>if</span>
                    <div className="flex items-center gap-1 bg-[#59C059] text-white px-2 py-0.5 rounded-full border border-green-600 text-[10px]">
                      <span className="bg-[#FF8C1A] text-white px-1.5 py-0.2 rounded-full font-mono">Score</span>
                      <span className="font-bold">&gt;</span>
                      <span className="bg-white text-slate-900 px-2 py-0.2 rounded font-mono font-bold">2</span>
                    </div>
                    <span>then</span>
                  </div>

                  {/* THEN */}
                  <div className="bg-slate-900/60 rounded p-2 ml-3 space-y-1 border-l-2 border-emerald-400">
                    <div className="flex items-center gap-1.5 bg-[#9966FF] text-white font-medium px-2.5 py-1 rounded text-[11px] w-fit">
                      <span>say</span>
                      <span className="bg-white text-slate-900 px-1.5 py-0.2 rounded">
                        Awesome! You're a Python Pro! 🏆
                      </span>
                      <span>for</span>
                      <span className="bg-white text-slate-900 px-1 py-0.2 rounded font-mono">3</span>
                      <span>seconds</span>
                    </div>
                  </div>

                  <div className="px-1 font-bold text-slate-950">else</div>

                  {/* ELSE */}
                  <div className="bg-slate-900/60 rounded p-2 ml-3 space-y-1 border-l-2 border-amber-400">
                    <div className="flex items-center gap-1.5 bg-[#9966FF] text-white font-medium px-2.5 py-1 rounded text-[11px] w-fit">
                      <span>say</span>
                      <span className="bg-white text-slate-900 px-1.5 py-0.2 rounded">
                        Keep practicing! You can do better next time. 💪
                      </span>
                      <span>for</span>
                      <span className="bg-white text-slate-900 px-1 py-0.2 rounded font-mono">3</span>
                      <span>seconds</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ===================== PROMPT 7: RESTART / LOOP ===================== */}
          <div className="border-l-2 border-rose-500/40 pl-3 py-1 space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => togglePrompt(7)}
                className="text-[10px] text-rose-400/90 hover:text-rose-300 font-mono flex items-center gap-1"
              >
                {expandedPrompts[7] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                <span>Prompt 7 · Restart / Loop Prompt</span>
              </button>
              {activePromptIndex === 7 && (
                <span className="text-[9px] bg-rose-400/20 text-rose-300 px-1.5 py-0.2 rounded animate-pulse">
                  EXECUTING
                </span>
              )}
            </div>

            {expandedPrompts[7] && (
              <div className="space-y-1.5 pl-1">
                {/* ask [Do you want to study again? (yes/no)] and wait */}
                <div
                  className={`flex items-center gap-1.5 bg-[#5CB1D6] text-white font-medium px-3 py-1.5 rounded-md shadow-sm border-b-2 border-sky-700 w-fit transition-all ${
                    isBlockActive(7, 'ask_restart') ? 'ring-2 ring-white shadow-lg scale-102' : ''
                  }`}
                >
                  <span>ask</span>
                  <span className="bg-white text-slate-900 px-2 py-0.5 rounded text-[11px] font-medium">
                    Do you want to study again? (yes/no)
                  </span>
                  <span>and wait</span>
                </div>

                {/* if <(answer) = [yes]> then broadcast [restart_quiz v] else say ... stop [all v] */}
                <div className="bg-[#FFAB19] text-slate-950 font-bold rounded-lg p-1.5 shadow-md border-b-2 border-amber-600 max-w-lg space-y-1.5">
                  <div className="flex items-center gap-2 px-1">
                    <span>if</span>
                    <div className="flex items-center gap-1 bg-[#59C059] text-white px-2 py-0.5 rounded-full border border-green-600 text-[10px]">
                      <span className="bg-[#5CB1D6] text-white px-1.5 py-0.2 rounded-full">answer</span>
                      <span className="font-bold">=</span>
                      <span className="bg-white text-slate-900 px-2 py-0.2 rounded font-mono font-bold">yes</span>
                    </div>
                    <span>then</span>
                  </div>

                  {/* THEN: broadcast [restart_quiz v] */}
                  <div className="bg-slate-900/60 rounded p-2 ml-3 space-y-1 border-l-2 border-amber-400">
                    <div className="flex items-center gap-1.5 bg-[#FFBF00] text-slate-950 font-bold px-2.5 py-1 rounded text-[11px] w-fit shadow">
                      <span>broadcast</span>
                      <span className="bg-amber-700 text-amber-100 px-1.5 py-0.2 rounded">restart_quiz ▾</span>
                    </div>
                  </div>

                  <div className="px-1 font-bold text-slate-950">else</div>

                  {/* ELSE: say farewell and stop all */}
                  <div className="bg-slate-900/60 rounded p-2 ml-3 space-y-1.5 border-l-2 border-rose-400">
                    <div className="flex items-center gap-1.5 bg-[#9966FF] text-white font-medium px-2.5 py-1 rounded text-[11px] w-fit">
                      <span>say</span>
                      <span className="bg-white text-slate-900 px-1.5 py-0.2 rounded">
                        Good luck with your exams! Goodbye!
                      </span>
                      <span>for</span>
                      <span className="bg-white text-slate-900 px-1 py-0.2 rounded font-mono">2</span>
                      <span>seconds</span>
                    </div>

                    {/* stop [all v] */}
                    <div className="flex items-center gap-1.5 bg-[#FFAB19] text-slate-950 font-bold px-2.5 py-1 rounded text-[11px] w-fit shadow">
                      <span>stop</span>
                      <span className="bg-amber-700 text-amber-100 px-1.5 py-0.2 rounded">all ▾</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Receiver Script Stack: when I receive [restart_quiz v] */}
        <div className="pt-4 border-t border-slate-800 space-y-1.5">
          <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Event Receiver (Decoupled Loop Architecture)</span>
          </div>

          <div className="flex items-center gap-2 bg-[#FFBF00] text-slate-950 font-bold px-3 py-2 rounded-t-xl rounded-b-md shadow-md border-b-2 border-amber-600 w-fit">
            <span>when I receive</span>
            <span className="bg-amber-700 text-amber-100 px-2 py-0.5 rounded text-[11px]">restart_quiz ▾</span>
          </div>

          <div className="bg-[#FF8C1A] text-white font-medium px-3 py-1.5 rounded-md shadow-sm border-b-2 border-orange-700 w-fit ml-3">
            <span>set</span>
            <span className="bg-orange-800 text-orange-100 px-2 py-0.5 rounded text-[11px] font-semibold">Score ▾</span>
            <span>to</span>
            <span className="bg-white text-slate-900 px-2 py-0.5 rounded text-[11px] font-bold font-mono">0</span>
          </div>

          <div className="bg-[#FF8C1A] text-white font-medium px-3 py-1.5 rounded-md shadow-sm border-b-2 border-orange-700 w-fit ml-3">
            <span>set</span>
            <span className="bg-orange-800 text-orange-100 px-2 py-0.5 rounded text-[11px] font-semibold">QuestionNumber ▾</span>
            <span>to</span>
            <span className="bg-white text-slate-900 px-2 py-0.5 rounded text-[11px] font-bold font-mono">1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
