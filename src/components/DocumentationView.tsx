import React, { useState } from 'react';
import { FileText, Cpu, GitBranch, Database, ShieldCheck, CheckCircle2, Download, Copy, Check } from 'lucide-react';
import { sound } from '../utils/audio';

export const DocumentationView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyDocs = () => {
    sound.playPop();
    const docText = `# Smart Study Flashcards (Scratch 3.0 Architecture)
## Software Requirements Specification & Technical Architecture

### 1. Executive Summary
Smart Study Flashcards is an interactive pedagogical software artifact architected within the Scratch block-based visual programming environment. It models asynchronous user input, sequential state accumulation, binary conditional branching, and message-driven event loops.

### 2. Functional Requirements
- FR-01: Asset Decoupling - Default cat sprite deallocated; replaced with Study Host character.
- FR-02: Deterministic Initialization - Variable reset on green_flag (Score=0, QuestionNumber=1).
- FR-03: Synchronous Sensing - Blocking "ask and wait" buffers user responses.
- FR-04: Binary Selection & State Mutation - if/else evaluations mutate Score dynamically.
- FR-05: Relational Mastery Tiering - Evaluates (Score > 2) for achievement feedback.
- FR-06: Event-Driven Looping - Broadcasts [restart_quiz] to achieve decoupled recurrence.
- FR-07: Modular Extensibility - Standardized Question Unit template allows seamless deck expansion.

### 3. Data Dictionary
- Score (Integer, Range: [0, N], Initial: 0): Dynamic state accumulator.
- QuestionNumber (Integer, Range: [1, N], Initial: 1): Ordinal sequence counter.
- answer (String, Sensing Buffer): Volatile system register storing most recent user response.
`;
    navigator.clipboard.writeText(docText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl text-slate-100 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              System Engineering Specification
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">IEEE 830-1998 Aligned</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">
            Smart Study Flashcards Technical Architecture & SRS
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Formal software requirements specification, state transition model, and computer science block
            translation table prepared for viva defense and laboratory evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyDocs}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Markdown' : 'Copy Documentation'}</span>
          </button>
        </div>
      </div>

      {/* Section 1: Architectural Paradigm & State Machine */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Cpu className="w-4 h-4 text-amber-400" />
          <span>01. System Architecture & Finite State Machine (FSM)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
            <div className="text-xs font-semibold text-amber-400 font-mono">01. Initialization State</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Triggered by the <code className="text-amber-300 bg-amber-950/60 px-1 py-0.5 rounded">when ⚑ clicked</code> event.
              Resets global variables <code className="text-cyan-300">Score = 0</code> and{' '}
              <code className="text-cyan-300">QuestionNumber = 1</code>. Clears any residual sensing buffer.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
            <div className="text-xs font-semibold text-purple-400 font-mono">02. Synchronous Sensing Loop</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The execution thread yields to the Scratch sensing subsystem via <code className="text-sky-300">ask & wait</code>.
              System state enters a blocking wait until user keyboard interrupt fires through the Enter key or checkmark.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
            <div className="text-xs font-semibold text-emerald-400 font-mono">03. Event Bus Replay Loop</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decoupled looping architecture using <code className="text-amber-300">broadcast [restart_quiz]</code>. Eliminates
              stack recursion, preventing memory leakages and allowing multi-actor lifecycle re-subscription.
            </p>
          </div>
        </div>

        {/* ASCII / Visual Flow Diagram */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-x-auto font-mono text-[11px] leading-relaxed text-slate-300">
          <div className="text-amber-400 font-semibold mb-2">[Execution State Flow Graph]</div>
          <div>[Green Flag Clicked]</div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│</div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼</div>
          <div>[Prompt 1: Set Score=0, QNum=1]</div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│</div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼</div>
          <div>[Prompt 2: Say Welcome (2s) ➔ Ask Name ➔ Say Hello (2s)]</div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│</div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼</div>
          <div>┌──► [Prompt 3-5: Flashcard Question Unit]</div>
          <div>│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;Ask Question ➔ Await Input in (answer)</div>
          <div>│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;If (answer == Correct) ➔ Say Correct (2s) & Score++</div>
          <div>│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;Else ➔ Say Incorrect (3s)</div>
          <div>│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼</div>
          <div>│&nbsp;&nbsp;&nbsp;[Prompt 6: Say Score Banner (3s)]</div>
          <div>│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;If (Score &gt; 2) ➔ "Python Pro! 🏆" Else ➔ "Keep practicing! 💪"</div>
          <div>│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼</div>
          <div>│&nbsp;&nbsp;&nbsp;[Prompt 7: Ask "Do you want to study again? (yes/no)"]</div>
          <div>│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──► (answer == "yes") ➔ Broadcast [restart_quiz] ─┐</div>
          <div>│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└──► (answer != "yes") ➔ Say Goodbye (2s) ➔ STOP ALL │</div>
          <div>└────────────────────────────────────────────────────────┘</div>
        </div>
      </div>

      {/* Section 2: Functional Requirements Matrix */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>02. Functional Requirements Specification (FRS)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Req ID</th>
                <th className="py-2.5 px-3">Lifecycle Phase</th>
                <th className="py-2.5 px-3">Scratch Block Implementation</th>
                <th className="py-2.5 px-3">Acceptance Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-mono text-cyan-400 font-medium">FR-01</td>
                <td className="py-2.5 px-3">Stage Setup</td>
                <td className="py-2.5 px-3">Trash cat sprite; bind host (Avery/Nano/Robot)</td>
                <td className="py-2.5 px-3 text-slate-400">Default Sprite1 removed; host occupies (0, -20)</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-mono text-cyan-400 font-medium">FR-02</td>
                <td className="py-2.5 px-3">Initialization</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-amber-300">set [Score v] to [0], set [QuestionNumber v] to [1]</td>
                <td className="py-2.5 px-3 text-slate-400">Score & QuestionNumber registers reset deterministically</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-mono text-cyan-400 font-medium">FR-03</td>
                <td className="py-2.5 px-3">Greeting & Intro</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-purple-300">say [Welcome...] (2s), ask [Name?], say (join [Hello ] (answer))</td>
                <td className="py-2.5 px-3 text-slate-400">Displays 2000ms timed dialogue and performs string interpolation</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-mono text-cyan-400 font-medium">FR-04</td>
                <td className="py-2.5 px-3">Quiz Engine (Q1-Q3)</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-sky-300">ask & wait ➔ if &lt;(answer) = [...]&gt; then Score+=1 else ...</td>
                <td className="py-2.5 px-3 text-slate-400">Accepts correct tokens ('def', 'dictionary', '0'); awards points</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-mono text-cyan-400 font-medium">FR-05</td>
                <td className="py-2.5 px-3">Mastery Evaluation</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-emerald-300">if &lt;(Score) &gt; [2]&gt; then "Python Pro! 🏆" else "Keep practicing! 💪"</td>
                <td className="py-2.5 px-3 text-slate-400">Strict inequality triggers mastery banner on 3/3 correct score</td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-mono text-cyan-400 font-medium">FR-06</td>
                <td className="py-2.5 px-3">Event-Driven Loop</td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-amber-300">if &lt;(answer) = [yes]&gt; then broadcast [restart_quiz v] else stop [all v]</td>
                <td className="py-2.5 px-3 text-slate-400">Loops execution via Pub/Sub or performs clean process termination</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Computer Science Concept Translation Matrix */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <GitBranch className="w-4 h-4 text-emerald-400" />
          <span>03. Scratch Block to Computer Science Theoretical Mapping</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
            <h4 className="text-xs font-semibold text-amber-400">1. Variables as Dynamic State Registers</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              In low-level and high-level programming alike, variables represent bound memory addresses storing
              mutable state. The Scratch <code className="text-orange-400">Score</code> variable is not merely a visual label;
              it is an in-memory accumulator that is mutated conditionally and queried downstream for decision-making.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
            <h4 className="text-xs font-semibold text-cyan-400">2. Control Flow & Boolean Predicates</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              The <code className="text-amber-400">if / else</code> block realizes Dijkstra's guarded command concept. The
              Boolean expression <code className="text-emerald-400">&lt;(answer) = [def]&gt;</code> computes a truth value:
              directing program counter flow into branch A (<code className="text-purple-400">then</code>) or branch B (<code className="text-purple-400">else</code>).
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
            <h4 className="text-xs font-semibold text-purple-400">3. Synchronous Blocking I/O</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              The <code className="text-sky-400">ask [...] and wait</code> block implements blocking synchronous input. Just
              as Python's <code className="text-sky-300">input()</code> halts execution until the newline carriage return,
              Scratch pauses the script fiber until the checkmark or Enter event submits the buffer into <code className="text-sky-300">(answer)</code>.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
            <h4 className="text-xs font-semibold text-emerald-400">4. Publisher-Subscriber Event Architecture</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scratch's <code className="text-amber-400">broadcast [event]</code> primitive enacts an asynchronous event bus.
              Rather than hardcoding cyclic references or recursing inside a while(true) loop, broadcasting emits an
              application-wide notification that decouples caller from callee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
