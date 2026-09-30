import React, { useState } from 'react';
import { IMPLEMENTATION_ROADMAP, RoadmapPhase } from '../data/roadmapData';
import { CheckCircle2, Circle, Clock, Check, ChevronRight, Layers, Award, Terminal } from 'lucide-react';
import { sound } from '../utils/audio';

export const RoadmapView: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<number>(1);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({
    'task-1-1': true,
    'task-1-2': true,
    'task-1-3': true,
    'task-2-1': true,
    'task-2-2': true,
    'task-2-3': true,
    'task-3-1': true,
    'task-3-2': true,
    'task-3-3': true,
    'task-4-1': true,
    'task-4-2': true,
    'task-4-3': true,
    'task-5-1': true,
    'task-5-2': true,
    'task-6-1': true,
    'task-6-2': true,
    'task-6-3': true,
    'task-7-1': true,
    'task-7-2': true,
    'task-7-3': true,
  });

  const toggleTask = (taskId: string) => {
    sound.playPop();
    setCompletedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const currentPhaseData =
    IMPLEMENTATION_ROADMAP.find((p) => p.phaseNumber === selectedPhase) || IMPLEMENTATION_ROADMAP[0];

  const totalTasks = IMPLEMENTATION_ROADMAP.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl text-slate-100 space-y-6">
      {/* Header and Progress Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Implementation Roadmap
            </span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">7-Sprint Agile Lifecycle</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">
            End-to-End Scratch Development & Verification Phases
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Traceable project roadmap mapping each Scratch prompt directly to software engineering
            deliverables, unit verification steps, and lab viva talking points.
          </p>
        </div>

        {/* Global Progress Metric */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 min-w-[200px]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Sprint Completion</span>
            <span className="font-mono font-bold text-emerald-400">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
            <span>{completedCount} of {totalTasks} tasks verified</span>
            <span>All 7 Prompts Built</span>
          </div>
        </div>
      </div>

      {/* 7-Phase Stepper Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {IMPLEMENTATION_ROADMAP.map((phase) => {
          const isSelected = selectedPhase === phase.phaseNumber;
          const phaseTasks = phase.tasks.map((t) => t.id);
          const isAllDone = phaseTasks.every((id) => completedTasks[id]);

          return (
            <button
              key={phase.phaseNumber}
              onClick={() => {
                sound.playPop();
                setSelectedPhase(phase.phaseNumber);
              }}
              className={`p-2.5 rounded-lg text-left transition-all border ${
                isSelected
                  ? 'bg-amber-950/40 border-amber-500 shadow-md shadow-amber-900/20 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold text-amber-400">Phase {phase.phaseNumber}</span>
                {isAllDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>
              <div className="text-[11px] font-semibold truncate leading-tight">{phase.title}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Phase Detail Panel */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-6">
        {/* Phase Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400">
                Phase {currentPhaseData.phaseNumber}
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-400">{currentPhaseData.duration}</span>
            </div>
            <h3 className="text-base font-bold text-slate-100 mt-0.5">{currentPhaseData.title}</h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded font-medium flex items-center gap-1.5">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Verified & Deployed</span>
            </span>
          </div>
        </div>

        {/* Phase Goal & Blocks Used */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Architectural Objective
            </span>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 border border-slate-800/80 rounded-lg p-3">
              {currentPhaseData.goal}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Scratch 3.0 Primitives Employed
            </span>
            <div className="flex flex-wrap gap-1.5 p-3 bg-slate-900/60 border border-slate-800/80 rounded-lg">
              {currentPhaseData.scratchBlocksUsed.map((blk, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-mono bg-slate-950 text-amber-300 px-2 py-0.5 rounded border border-slate-700/80"
                >
                  {blk}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Deliverable Tasks & Acceptance Criteria */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Sprint Tasks & Verification Matrix
          </span>
          <div className="space-y-2">
            {currentPhaseData.tasks.map((task) => {
              const isChecked = !!completedTasks[task.id];
              return (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-start gap-3 ${
                    isChecked
                      ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center transition-colors ${
                      isChecked ? 'bg-emerald-500 text-slate-950' : 'border border-slate-600 bg-slate-950'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>

                  <div className="flex-1 space-y-1 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className={`font-medium ${isChecked ? 'text-slate-200' : 'text-slate-400'}`}>
                        {task.description}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 shrink-0">
                        {task.csConcept}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      <strong>Acceptance:</strong> {task.acceptanceCriteria}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verification Checkpoint & Viva Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Unit Verification Checkpoints</span>
            </span>
            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
              {currentPhaseData.verificationSteps.map((vStep, idx) => (
                <li key={idx} className="leading-relaxed">
                  {vStep}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Viva Voce Defense Defense Anchors</span>
            </span>
            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
              {currentPhaseData.vivaTalkingPoints.map((talk, idx) => (
                <li key={idx} className="leading-relaxed">
                  {talk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
