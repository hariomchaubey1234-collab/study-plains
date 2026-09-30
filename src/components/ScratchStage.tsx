import React, { useState, useEffect, useRef } from 'react';
import { SpriteId, BackdropId } from '../types/scratch';
import { Play, Square, StepForward, Volume2, VolumeX, Mic, MicOff, Maximize2, Minimize2, Check, Radio } from 'lucide-react';
import { sound } from '../utils/audio';

interface ScratchStageProps {
  score: number;
  questionNumber: number;
  currentSayText: string | null;
  currentAskPrompt: string | null;
  isWaitingForInput: boolean;
  onAnswerSubmit: (answer: string) => void;
  selectedHostId: SpriteId;
  selectedBackdropId: BackdropId;
  backdropUrl: string;
  isRunning: boolean;
  onGreenFlagClick: () => void;
  onStopClick: () => void;
  onStepClick: () => void;
  stepMode: boolean;
  onToggleStepMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  speechEnabled: boolean;
  onToggleSpeech: () => void;
  broadcastMessage: string | null;
  hostCostume: 'idle' | 'talking' | 'celebrate' | 'thinking';
}

export const ScratchStage: React.FC<ScratchStageProps> = ({
  score,
  questionNumber,
  currentSayText,
  currentAskPrompt,
  isWaitingForInput,
  onAnswerSubmit,
  selectedHostId,
  selectedBackdropId,
  backdropUrl,
  isRunning,
  onGreenFlagClick,
  onStopClick,
  onStepClick,
  stepMode,
  onToggleStepMode,
  soundEnabled,
  onToggleSound,
  speechEnabled,
  onToggleSpeech,
  broadcastMessage,
  hostCostume,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const stageContainerRef = useRef<HTMLDivElement>(null);

  // Auto-focus input when ask block fires
  useEffect(() => {
    if (isWaitingForInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isWaitingForInput]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;
    sound.playPop();
    const submitted = inputValue.trim();
    setInputValue('');
    onAnswerSubmit(submitted);
  };

  const toggleFullscreen = () => {
    if (!stageContainerRef.current) return;
    if (!document.fullscreenElement) {
      stageContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={stageContainerRef}
      className={`flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl transition-all ${
        isFullscreen ? 'p-4 bg-slate-950' : ''
      }`}
    >
      {/* Scratch Top Control Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950/80 border-b border-slate-800/80">
        {/* Left: Green Flag & Stop Sign Controls */}
        <div className="flex items-center gap-2">
          {/* Green Flag Button */}
          <button
            onClick={onGreenFlagClick}
            title="When ⚑ clicked (Start Project)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white shadow-sm transition-transform active:scale-95 ${
              isRunning
                ? 'bg-emerald-600 hover:bg-emerald-500 ring-2 ring-emerald-400/50 ring-offset-1 ring-offset-slate-900'
                : 'bg-emerald-600/90 hover:bg-emerald-600'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Green Flag</span>
          </button>

          {/* Red Stop Sign Button */}
          <button
            onClick={onStopClick}
            title="stop [all v] (Stop Project)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-rose-600/90 hover:bg-rose-600 active:scale-95 transition-transform"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop</span>
          </button>

          {/* Step Debugger Button */}
          <button
            onClick={onStepClick}
            title="Step next Scratch block"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              stepMode
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <StepForward className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Step</span>
          </button>

          {/* Toggle Step Mode */}
          <button
            onClick={onToggleStepMode}
            className={`text-[11px] px-2 py-1 rounded transition-colors ${
              stepMode ? 'bg-amber-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {stepMode ? 'Step-by-Step ON' : 'Continuous Run'}
          </button>
        </div>

        {/* Right: Sound, Voice & Screen Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Synthesizer Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            className={`p-1.5 rounded-md transition-colors ${
              soundEnabled ? 'text-amber-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Speech TTS Toggle */}
          <button
            onClick={onToggleSpeech}
            title={speechEnabled ? 'Disable Host Voice' : 'Enable Host Voice (TTS)'}
            className={`p-1.5 rounded-md transition-colors ${
              speechEnabled ? 'text-cyan-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800'
            }`}
          >
            {speechEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Stage'}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* The 4:3 Proportional Stage Viewport */}
      <div className="relative w-full aspect-[4/3] bg-slate-950 overflow-hidden select-none flex items-center justify-center">
        {/* Backdrop Layer */}
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt="Stage Backdrop"
            style={{ borderColor: '#f1f9f9' }}
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.9] border border-[#f1f9f9]"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800">
            {/* Grid pattern simulating digital canvas */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-25" />
          </div>
        )}

        {/* Scratch Variable Monitors in Top-Left (Exact Scratch Visual Design) */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20 pointer-events-none">
          {/* Score Variable Monitor */}
          <div className="flex items-center gap-1.5 bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded shadow-md text-xs border border-amber-400">
            <span className="tracking-tight text-[11px] font-sans">Score</span>
            <span className="bg-amber-900/90 text-amber-100 px-2 py-0.5 rounded text-[11px] font-mono tabular-nums min-w-[28px] text-center border border-amber-700/60">
              {score}
            </span>
          </div>

          {/* QuestionNumber Variable Monitor */}
          <div className="flex items-center gap-1.5 bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded shadow-md text-xs border border-amber-400">
            <span className="tracking-tight text-[11px] font-sans">QuestionNumber</span>
            <span className="bg-amber-900/90 text-amber-100 px-2 py-0.5 rounded text-[11px] font-mono tabular-nums min-w-[28px] text-center border border-amber-700/60">
              {questionNumber}
            </span>
          </div>
        </div>

        {/* Broadcast Message Indicator */}
        {broadcastMessage && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-amber-500/90 text-slate-950 text-xs font-semibold px-2.5 py-1 rounded-md shadow-lg animate-pulse border border-amber-300">
            <Radio className="w-3.5 h-3.5 text-slate-900" />
            <span>Broadcast: [{broadcastMessage}]</span>
          </div>
        )}

        {/* Host Character Sprite & Speech Bubble Container */}
        <div className="relative flex flex-col items-center justify-end h-full w-full pb-14 z-10">
          {/* Speech Bubble (Classic Scratch Comic Balloon) */}
          {currentSayText && (
            <div className="relative max-w-sm mb-4 px-4 py-2.5 bg-white text-slate-900 rounded-2xl shadow-2xl border-2 border-slate-300 font-medium text-xs sm:text-sm animate-in fade-in zoom-in-95 duration-200">
              <p className="leading-snug text-center">{currentSayText}</p>
              {/* Balloon Tail pointing down to sprite */}
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white" />
            </div>
          )}

          {/* Active Host Character Sprite */}
          <div className="relative group cursor-pointer transition-transform duration-300 hover:scale-105">
            {selectedHostId === 'robot' ? (
              /* Robo-Professor */
              <div className="relative w-36 h-44 sm:w-44 sm:h-52 flex items-center justify-center">
                <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-xl">
                  {/* Antenna */}
                  <line x1="100" y1="35" x2="100" y2="10" stroke="#94a3b8" strokeWidth="4" />
                  <circle cx="100" cy="10" r="7" fill={hostCostume === 'celebrate' ? '#10b981' : '#06b6d4'} className="animate-pulse" />

                  {/* Robot Head */}
                  <rect x="50" y="35" width="100" height="75" rx="16" fill="#f8fafc" stroke="#334155" strokeWidth="4" />
                  {/* Visor */}
                  <rect x="65" y="50" width="70" height="30" rx="8" fill="#0f172a" />
                  {/* Visor Eyes */}
                  <circle
                    cx="85"
                    cy="65"
                    r={hostCostume === 'celebrate' ? 6 : 5}
                    fill={hostCostume === 'celebrate' ? '#34d399' : '#38bdf8'}
                    className={hostCostume === 'talking' ? 'animate-bounce' : ''}
                  />
                  <circle
                    cx="115"
                    cy="65"
                    r={hostCostume === 'celebrate' ? 6 : 5}
                    fill={hostCostume === 'celebrate' ? '#34d399' : '#38bdf8'}
                    className={hostCostume === 'talking' ? 'animate-bounce' : ''}
                  />

                  {/* Robot Glasses */}
                  <circle cx="85" cy="65" r="11" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                  <circle cx="115" cy="65" r="11" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                  <line x1="96" y1="65" x2="104" y2="65" stroke="#f59e0b" strokeWidth="2.5" />

                  {/* Robot Mouth / Sound Wave */}
                  {hostCostume === 'talking' ? (
                    <line x1="80" y1="92" x2="120" y2="92" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round" />
                  ) : hostCostume === 'celebrate' ? (
                    <path d="M 85,90 Q 100,102 115,90" fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
                  ) : (
                    <line x1="85" y1="92" x2="115" y2="92" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
                  )}

                  {/* Neck */}
                  <rect x="90" y="110" width="20" height="12" fill="#64748b" />

                  {/* Academic Bowtie */}
                  <polygon points="90,122 100,126 90,130" fill="#dc2626" />
                  <polygon points="110,122 100,126 110,130" fill="#dc2626" />
                  <circle cx="100" cy="126" r="3" fill="#991b1b" />

                  {/* Robot Torso with Gauge */}
                  <rect x="55" y="125" width="90" height="85" rx="14" fill="#e2e8f0" stroke="#334155" strokeWidth="4" />
                  <rect x="75" y="145" width="50" height="30" rx="6" fill="#0f172a" />
                  <text x="100" y="165" fill="#38bdf8" fontSize="11" fontFamily="monospace" textAnchor="middle">
                    PYTHON
                  </text>

                  {/* Arms */}
                  <path d="M 55,140 Q 30,165 40,195" fill="none" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
                  <circle cx="40" cy="195" r="7" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
                  <path d="M 145,140 Q 170,165 160,195" fill="none" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
                  <circle cx="160" cy="195" r="7" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
                </svg>
              </div>
            ) : selectedHostId === 'avery' ? (
              /* Avery Sprite */
              <div className="relative w-36 h-44 sm:w-44 sm:h-52 flex items-center justify-center">
                <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-xl">
                  {/* Hair */}
                  <circle cx="100" cy="70" r="42" fill="#451a03" />
                  {/* Face */}
                  <circle cx="100" cy="75" r="32" fill="#fbcfe8" />
                  {/* Glasses */}
                  <circle cx="90" cy="72" r="10" fill="none" stroke="#1e293b" strokeWidth="2.5" />
                  <circle cx="110" cy="72" r="10" fill="none" stroke="#1e293b" strokeWidth="2.5" />
                  <line x1="100" y1="72" x2="100" y2="72" stroke="#1e293b" strokeWidth="2" />
                  {/* Eyes */}
                  <circle cx="90" cy="72" r="3" fill="#0f172a" />
                  <circle cx="110" cy="72" r="3" fill="#0f172a" />
                  {/* Smile */}
                  <path d="M 92,88 Q 100,96 108,88" fill="none" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Sweater / Body */}
                  <path d="M 65,115 C 65,105 135,105 135,115 L 145,200 L 55,200 Z" fill="#4338ca" />
                  {/* Collar */}
                  <polygon points="100,122 88,110 112,110" fill="#ffffff" />
                  {/* Study Notebook */}
                  <rect x="80" y="145" width="40" height="30" rx="3" fill="#f59e0b" />
                  <line x1="86" y1="153" x2="114" y2="153" stroke="#ffffff" strokeWidth="2" />
                  <line x1="86" y1="160" x2="114" y2="160" stroke="#ffffff" strokeWidth="2" />
                </svg>
              </div>
            ) : selectedHostId === 'nano' ? (
              /* Nano Sprite */
              <div className="relative w-36 h-44 sm:w-44 sm:h-52 flex items-center justify-center">
                <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-xl">
                  {/* Nano Alien Body */}
                  <ellipse cx="100" cy="115" rx="55" ry="60" fill="#8b5cf6" stroke="#5b21b6" strokeWidth="4" />
                  {/* Single Big Cyclops Cyber Eye */}
                  <circle cx="100" cy="95" r="26" fill="#ffffff" stroke="#4c1d95" strokeWidth="3" />
                  <circle cx="100" cy="95" r="14" fill="#06b6d4" />
                  <circle cx="96" cy="91" r="5" fill="#ffffff" />
                  {/* Antenna */}
                  <line x1="100" y1="55" x2="100" y2="25" stroke="#7c3aed" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="100" cy="20" r="9" fill="#f59e0b" className="animate-ping" />
                  <circle cx="100" cy="20" r="8" fill="#fbbf24" />
                  {/* Friendly Smile */}
                  <path d="M 85,135 Q 100,150 115,135" fill="none" stroke="#2e1065" strokeWidth="4" strokeLinecap="round" />
                  {/* Feet */}
                  <ellipse cx="78" cy="175" rx="16" ry="10" fill="#6d28d9" />
                  <ellipse cx="122" cy="175" rx="16" ry="10" fill="#6d28d9" />
                </svg>
              </div>
            ) : (
              /* Professor Owl Sprite */
              <div className="relative w-36 h-44 sm:w-44 sm:h-52 flex items-center justify-center">
                <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-xl">
                  {/* Owl Body */}
                  <ellipse cx="100" cy="125" rx="50" ry="65" fill="#78350f" stroke="#451a03" strokeWidth="4" />
                  {/* Belly */}
                  <ellipse cx="100" cy="140" rx="32" ry="42" fill="#fef3c7" />
                  {/* Eyes */}
                  <circle cx="82" cy="95" r="18" fill="#fde68a" stroke="#78350f" strokeWidth="3" />
                  <circle cx="82" cy="95" r="8" fill="#1e293b" />
                  <circle cx="118" cy="95" r="18" fill="#fde68a" stroke="#78350f" strokeWidth="3" />
                  <circle cx="118" cy="95" r="8" fill="#1e293b" />
                  {/* Beak */}
                  <polygon points="95,108 105,108 100,122" fill="#f59e0b" />
                  {/* Mortarboard Academic Hat */}
                  <polygon points="100,35 155,55 100,75 45,55" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                  <rect x="85" y="65" width="30" height="15" fill="#1e293b" />
                  {/* Hat Tassel */}
                  <line x1="100" y1="55" x2="145" y2="70" stroke="#f59e0b" strokeWidth="3" />
                  <circle cx="145" cy="72" r="4" fill="#f59e0b" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Scratch Sensing Input Bar ("ask [question] and wait") */}
        {isWaitingForInput && (
          <div className="absolute bottom-2 inset-x-3 z-30 animate-in slide-in-from-bottom-3 duration-200">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 bg-sky-100 border-2 border-sky-400 rounded-lg p-2 shadow-2xl backdrop-blur-sm"
            >
              {/* Question label in sensing bar */}
              <div className="text-[11px] sm:text-xs font-semibold text-slate-800 shrink-0 max-w-[200px] sm:max-w-xs truncate">
                {currentAskPrompt || 'Type your answer:'}
              </div>

              {/* Text input with cursor focus */}
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter answer here..."
                autoComplete="off"
                className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-white text-slate-900 border border-sky-300 rounded shadow-inner outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              />

              {/* Blue Scratch Checkmark Button */}
              <button
                type="submit"
                title="Submit answer (Enter)"
                className="w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-600 active:scale-95 text-white flex items-center justify-center shadow-md transition-transform shrink-0"
              >
                <Check className="w-5 h-5 stroke-[3]" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Stage Status Footer */}
      <div className="px-3 py-2 bg-slate-950 text-slate-400 text-xs flex items-center justify-between border-t border-slate-800">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
          <span>{isRunning ? (isWaitingForInput ? 'Awaiting user input...' : 'Executing script...') : 'Idle (Click Green Flag to Run)'}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span>Stage Coordinates: X: 0, Y: -20</span>
          <span>Size: 100%</span>
        </div>
      </div>
    </div>
  );
};
