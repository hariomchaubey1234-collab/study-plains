import React, { useState } from 'react';
import { Question } from '../types/scratch';
import { Printer, Download, X, Check, Award, BookOpen, Layers } from 'lucide-react';
import { sound } from '../utils/audio';

interface LabReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  currentScore: number;
}

export const LabReportModal: React.FC<LabReportModalProps> = ({
  isOpen,
  onClose,
  questions,
  currentScore,
}) => {
  const [studentName, setStudentName] = useState('Computer Science Student');
  const [rollNumber, setRollNumber] = useState('CS-2026-LAB-042');

  if (!isOpen) return null;

  const handlePrint = () => {
    sound.playPop();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6 my-8 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Modal Top Actions */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">
              Official Laboratory Project Report (Printable)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="bg-white text-slate-900 rounded-xl p-8 shadow-inner font-sans space-y-6 print:p-0 print:shadow-none">
          {/* Institution Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">
              Department of Computer Science & Engineering
            </h1>
            <p className="text-xs text-slate-600 uppercase tracking-widest mt-0.5">
              Visual Programming & Software Architecture Laboratory
            </p>
            <h2 className="text-lg font-bold text-amber-700 mt-2">
              Laboratory Exercise: Smart Study Flashcards in Scratch 3.0
            </h2>
          </div>

          {/* Student Metadata Fields */}
          <div className="grid grid-cols-2 gap-4 text-xs border border-slate-200 bg-slate-50 p-3 rounded-lg">
            <div>
              <span className="font-semibold text-slate-700">Student Name: </span>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="font-medium text-slate-900 border-b border-dashed border-slate-400 bg-transparent outline-none print:border-none"
              />
            </div>
            <div>
              <span className="font-semibold text-slate-700">Roll / Registration No: </span>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="font-mono text-slate-900 border-b border-dashed border-slate-400 bg-transparent outline-none print:border-none"
              />
            </div>
            <div>
              <span className="font-semibold text-slate-700">Execution Status: </span>
              <span className="text-emerald-700 font-bold">Verified & Tested ✓</span>
            </div>
            <div>
              <span className="font-semibold text-slate-700">Current Session Score: </span>
              <span className="font-mono font-bold text-indigo-700">{currentScore} / {questions.length}</span>
            </div>
          </div>

          {/* Section 1: Objective & Scope */}
          <div className="space-y-1.5 text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide border-b border-slate-300 pb-1">
              1. Project Objective & Architecture
            </h3>
            <p className="text-slate-700 leading-relaxed">
              To design, implement, and verify an interactive educational flashcard system utilizing Scratch 3.0 block
              structures. The system features deterministic variable initialization, synchronous blocking sensory inputs,
              binary conditional branching, dynamic state accumulation, and a decoupled event-driven message loop.
            </p>
          </div>

          {/* Section 2: Implementation Prompts Summary */}
          <div className="space-y-1.5 text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide border-b border-slate-300 pb-1">
              2. Seven-Stage Scratch Block Trace
            </h3>
            <div className="space-y-1 text-[11px] text-slate-800">
              <div><strong>Prompt 1 (Init):</strong> set [Score] to 0, set [QuestionNumber] to 1.</div>
              <div><strong>Prompt 2 (Greeting):</strong> say welcome (2s), ask [name], say (join Hello name) (2s).</div>
              <div><strong>Prompt 3 (Q1 - Functions):</strong> ask Python keyword ➔ if answer == 'def' then Score+=1.</div>
              <div><strong>Prompt 4 (Q2 - Data Structs):</strong> ask key-value mapping ➔ if answer == 'dictionary' then Score+=1.</div>
              <div><strong>Prompt 5 (Q3 - Lists):</strong> ask starting index ➔ if answer == '0' then Score+=1.</div>
              <div><strong>Prompt 6 (Feedback):</strong> say final score (3s); if Score &gt; 2 award Trophy tier else Remediation tier.</div>
              <div><strong>Prompt 7 (Loop):</strong> ask replay intent ➔ if 'yes' broadcast [restart_quiz] else stop [all].</div>
            </div>
          </div>

          {/* Section 3: Test Execution Matrix */}
          <div className="space-y-1.5 text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide border-b border-slate-300 pb-1">
              3. Verification & Test Case Logs
            </h3>
            <table className="w-full text-left text-[11px] border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
                <tr>
                  <th className="p-1.5">Test Case</th>
                  <th className="p-1.5">Input Stimulus</th>
                  <th className="p-1.5">Expected State Change</th>
                  <th className="p-1.5">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                <tr>
                  <td className="p-1.5 font-mono">TC-01</td>
                  <td className="p-1.5">Green Flag Click</td>
                  <td className="p-1.5">Score = 0, QuestionNumber = 1</td>
                  <td className="p-1.5 text-emerald-700 font-bold">Pass</td>
                </tr>
                <tr>
                  <td className="p-1.5 font-mono">TC-02</td>
                  <td className="p-1.5">Answer "def" on Q1</td>
                  <td className="p-1.5">Score increments to 1; chime sound</td>
                  <td className="p-1.5 text-emerald-700 font-bold">Pass</td>
                </tr>
                <tr>
                  <td className="p-1.5 font-mono">TC-03</td>
                  <td className="p-1.5">Answer "dictionary" on Q2</td>
                  <td className="p-1.5">Score increments to 2</td>
                  <td className="p-1.5 text-emerald-700 font-bold">Pass</td>
                </tr>
                <tr>
                  <td className="p-1.5 font-mono">TC-04</td>
                  <td className="p-1.5">Score &gt; 2 Mastery check</td>
                  <td className="p-1.5">Displays "Awesome! You're a Python Pro! 🏆"</td>
                  <td className="p-1.5 text-emerald-700 font-bold">Pass</td>
                </tr>
                <tr>
                  <td className="p-1.5 font-mono">TC-05</td>
                  <td className="p-1.5">Replay "yes"</td>
                  <td className="p-1.5">Broadcasts [restart_quiz]; resets Score</td>
                  <td className="p-1.5 text-emerald-700 font-bold">Pass</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="pt-6 flex justify-between text-xs text-slate-700 border-t border-slate-300">
            <div>
              <div className="h-10 border-b border-slate-400 w-40" />
              <span className="block mt-1">Student Signature</span>
            </div>
            <div>
              <div className="h-10 border-b border-slate-400 w-40" />
              <span className="block mt-1">Laboratory Instructor / Examiner</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
