import React, { useState, useEffect, useRef } from 'react';
import { SpriteId, BackdropId, Question } from './types/scratch';
import { DEFAULT_QUESTIONS, BONUS_QUESTIONS, INITIAL_SPRITES, BACKDROPS } from './data/defaultDeck';
import { ScratchStage } from './components/ScratchStage';
import { SpriteTray } from './components/SpriteTray';
import { BlockWorkspace } from './components/BlockWorkspace';
import { DeckBuilder } from './components/DeckBuilder';
import { DocumentationView } from './components/DocumentationView';
import { RoadmapView } from './components/RoadmapView';
import { VivaMasterclass } from './components/VivaMasterclass';
import { LabReportModal } from './components/LabReportModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { PaidPaymentBar } from './components/PaidPaymentBar';
import { FeatureDatabase } from './utils/database';
import { UserAccount, UserRole } from './types/auth';
import { sound } from './utils/audio';
import { Play, RotateCcw, FileText, CheckCircle2, Radio, Sparkles, User, ShieldCheck, LogOut } from 'lucide-react';

type TabView = 'stage' | 'blocks' | 'deck' | 'docs' | 'roadmap' | 'viva' | 'admin';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<TabView>('stage');
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Authentication & RBAC State
  const [currentUser, setCurrentUser] = useState<UserAccount>(FeatureDatabase.getCurrentUser());
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalRole, setAuthModalRole] = useState<UserRole>('customer');

  // Stage & Assets State
  const [sprites, setSprites] = useState(INITIAL_SPRITES);
  const [backdrops] = useState(BACKDROPS);
  const [catDeleted, setCatDeleted] = useState(false);
  const [selectedHostId, setSelectedHostId] = useState<SpriteId>('robot');
  const [selectedBackdropId, setSelectedBackdropId] = useState<BackdropId>('chalkboard');

  // Modular Questions Deck (synced with FeatureDatabase)
  const [questions, setQuestions] = useState<Question[]>(FeatureDatabase.getQuestions());

  // Scratch Execution Engine State
  const [isRunning, setIsRunning] = useState(false);
  const [stepMode, setStepMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(false);

  // Scratch Registers & State
  const [score, setScore] = useState<number>(0);
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [userName, setUserName] = useState<string>(currentUser.name.split(' ')[0] || 'Student');

  // Execution Pointers
  const [currentPromptIndex, setCurrentPromptIndex] = useState<number | null>(null);
  const [currentSubStepId, setCurrentSubStepId] = useState<string | null>(null);
  const [currentSayText, setCurrentSayText] = useState<string | null>(null);
  const [currentAskPrompt, setCurrentAskPrompt] = useState<string | null>(null);
  const [isWaitingForInput, setIsWaitingForInput] = useState<boolean>(false);
  const [broadcastMessage, setBroadcastMessage] = useState<string | null>(null);
  const [hostCostume, setHostCostume] = useState<'idle' | 'talking' | 'celebrate' | 'thinking'>('idle');

  // Execution flow control
  const executionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingAnswerResolveRef = useRef<((answer: string) => void) | null>(null);

  // Get current backdrop image
  const activeBackdrop = backdrops.find((b) => b.id === selectedBackdropId);
  const backdropUrl = activeBackdrop?.imageUrl || '';

  // Delete Cat Sprite handler (Phase 1 task)
  const handleDeleteCat = () => {
    setCatDeleted(true);
    setSprites((prev) => prev.filter((s) => s.id !== 'cat'));
  };

  // Helper to show dialogue for specified duration
  const executeSay = (text: string, durationSec: number): Promise<void> => {
    return new Promise((resolve) => {
      setCurrentSayText(text);
      setHostCostume('talking');
      if (sound.speechEnabled) {
        sound.speakText(text);
      }

      if (executionTimeoutRef.current) clearTimeout(executionTimeoutRef.current);
      executionTimeoutRef.current = setTimeout(() => {
        setCurrentSayText(null);
        setHostCostume('idle');
        resolve();
      }, durationSec * 1000);
    });
  };

  // Helper to wait for user input from sensing bar
  const executeAsk = (promptText: string): Promise<string> => {
    return new Promise((resolve) => {
      setCurrentAskPrompt(promptText);
      setIsWaitingForInput(true);
      setHostCostume('talking');
      if (sound.speechEnabled) {
        sound.speakText(promptText);
      }
      pendingAnswerResolveRef.current = resolve;
    });
  };

  // Submit Answer from Stage Sensing Bar
  const handleAnswerSubmit = (submittedText: string) => {
    setIsWaitingForInput(false);
    setCurrentAskPrompt(null);
    setHostCostume('idle');
    if (pendingAnswerResolveRef.current) {
      const resolver = pendingAnswerResolveRef.current;
      pendingAnswerResolveRef.current = null;
      resolver(submittedText);
    }
  };

  // Stop All handler (`stop [all v]`)
  const handleStop = () => {
    if (executionTimeoutRef.current) clearTimeout(executionTimeoutRef.current);
    pendingAnswerResolveRef.current = null;
    sound.stopSpeaking();
    setIsRunning(false);
    setIsWaitingForInput(false);
    setCurrentSayText(null);
    setCurrentAskPrompt(null);
    setBroadcastMessage(null);
    setHostCostume('idle');
    setCurrentPromptIndex(null);
    setCurrentSubStepId(null);
  };

  // Master Step-by-Step Scratch Sequence Runner
  const runQuizWorkflow = async () => {
    handleStop();
    setIsRunning(true);
    sound.playGreenFlag();

    // ==============================================================
    // PROMPT 1: The Initialization Prompt (Resetting Variables)
    // Goal: set [Score v] to [0], set [QuestionNumber v] to [1]
    // ==============================================================
    setCurrentPromptIndex(1);
    setCurrentSubStepId('set_score');
    setScore(0);
    await new Promise((r) => setTimeout(r, 400));

    setCurrentSubStepId('set_qnum');
    setQuestionNumber(1);
    await new Promise((r) => setTimeout(r, 400));

    // ==============================================================
    // PROMPT 2: The Greeting & Introduction Prompt
    // Goal: say [Welcome...] (2s), ask [name], say (join Hello name)
    // ==============================================================
    setCurrentPromptIndex(2);
    setCurrentSubStepId('welcome');
    await executeSay('Welcome to Smart Study Flashcards!', 2);

    setCurrentSubStepId('ask_name');
    const nameAnswer = await executeAsk('What is your name?');
    const studentName = nameAnswer.trim() || currentUser.name.split(' ')[0] || 'Friend';
    setUserName(studentName);

    setCurrentSubStepId('say_hello');
    await executeSay(`Hello ${studentName}!`, 2);

    // Track running score locally to avoid state latency
    let runningScore = 0;

    // ==============================================================
    // PROMPTS 3 TO N: Flashcard Questions
    // Q1: Function keyword ('def')
    // Q2: Key-value data structure ('dictionary')
    // Q3: List indexing ('0')
    // + Any additional custom deck questions!
    // ==============================================================
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const promptNum = i + 3;
      setCurrentPromptIndex(promptNum);
      setQuestionNumber(q.questionNumber);

      // ask [question] and wait
      setCurrentSubStepId('ask');
      const userResp = await executeAsk(q.questionText);
      const normalizedResp = userResp.trim().toLowerCase();

      // if <(answer) = [correctAnswer]>
      const isCorrect =
        normalizedResp === q.correctAnswer.toLowerCase() ||
        (q.acceptedAliases && q.acceptedAliases.some((alias) => normalizedResp === alias.toLowerCase()));

      if (isCorrect) {
        runningScore += 1;
        setScore(runningScore);
        sound.playCorrect();
        setHostCostume('celebrate');
        setCurrentSubStepId('then');
        await executeSay(q.correctSayText, 2);
      } else {
        sound.playIncorrect();
        setHostCostume('thinking');
        setCurrentSubStepId('else');
        await executeSay(q.incorrectSayText, 3);
      }
      setHostCostume('idle');
    }

    // ==============================================================
    // PROMPT 6: The Score Calculation & Feedback Prompt
    // Goal: say (join [Quiz Over! Your final score is: ] (Score)) (3s)
    // if <(Score) > [2]> then Python Pro! else Keep practicing!
    // ==============================================================
    setCurrentPromptIndex(6);
    setCurrentSubStepId('score_report');
    await executeSay(`Quiz Over! Your final score is: ${runningScore}`, 3);

    // Record quiz attempt to user profile in database
    currentUser.quizzesCompleted = (currentUser.quizzesCompleted || 0) + 1;
    if (runningScore > currentUser.highScore) {
      currentUser.highScore = runningScore;
    }
    const allUsers = FeatureDatabase.getUsers();
    const idx = allUsers.findIndex((u) => u.id === currentUser.id);
    if (idx !== -1) {
      allUsers[idx] = currentUser;
      FeatureDatabase.saveUsers(allUsers);
    }

    setCurrentSubStepId('eval_mastery');
    if (runningScore > 2) {
      sound.playCorrect();
      setHostCostume('celebrate');
      await executeSay("Awesome! You're a Python Pro! 🏆", 3);
    } else {
      setHostCostume('thinking');
      await executeSay('Keep practicing! You can do better next time. 💪', 3);
    }
    setHostCostume('idle');

    // ==============================================================
    // PROMPT 7: The Restart / Loop Prompt
    // Goal: ask [Do you want to study again? (yes/no)] and wait
    // if <(answer) = [yes]> then broadcast [restart_quiz v]
    // else say [Good luck with your exams! Goodbye!] (2s) stop [all v]
    // ==============================================================
    setCurrentPromptIndex(7);
    setCurrentSubStepId('ask_restart');
    const replayAnswer = await executeAsk('Do you want to study again? (yes/no)');
    const shouldReplay = ['yes', 'y', 'sure', 'ok'].includes(replayAnswer.trim().toLowerCase());

    if (shouldReplay) {
      sound.playPop();
      setBroadcastMessage('restart_quiz');
      await new Promise((r) => setTimeout(r, 1200));
      setBroadcastMessage(null);
      // Re-trigger loop
      runQuizWorkflow();
    } else {
      setCurrentSubStepId('goodbye');
      await executeSay('Good luck with your exams! Goodbye!', 2);
      handleStop();
    }
  };

  // Step trigger
  const handleStepClick = () => {
    if (!isRunning) {
      runQuizWorkflow();
    } else {
      sound.playPop();
    }
  };

  // Sound toggles
  const handleToggleSound = () => {
    sound.soundEnabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  const handleToggleSpeech = () => {
    sound.speechEnabled = !speechEnabled;
    setSpeechEnabled(!speechEnabled);
  };

  // Modular Deck Handlers (saving to state & database)
  const handleAddQuestion = (newQ: Question) => {
    const updated = [...questions, newQ];
    setQuestions(updated);
    FeatureDatabase.saveQuestions(updated);
  };

  const handleRemoveQuestion = (id: string) => {
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    FeatureDatabase.saveQuestions(updated);
  };

  const handleResetDefault = () => {
    setQuestions(DEFAULT_QUESTIONS);
    FeatureDatabase.saveQuestions(DEFAULT_QUESTIONS);
  };

  const handleBatchUpdateQuestions = (newQuestions: Question[], replace: boolean = true) => {
    if (replace) {
      setQuestions(newQuestions);
      FeatureDatabase.saveQuestions(newQuestions);
    } else {
      setQuestions((prev) => {
        const startingNum = prev.length + 1;
        const renumbered = newQuestions.map((q, idx) => ({
          ...q,
          questionNumber: startingNum + idx,
          questionText: q.questionText.match(/^Q\d+:\s*/i)
            ? q.questionText.replace(/^Q\d+:\s*/i, `Q${startingNum + idx}: `)
            : `Q${startingNum + idx}: ${q.questionText}`,
        }));
        const combined = [...prev, ...renumbered];
        FeatureDatabase.saveQuestions(combined);
        return combined;
      });
    }
  };

  const handleLoadPreset = (key: 'standard' | 'advanced' | 'cs') => {
    if (key === 'standard') {
      handleBatchUpdateQuestions(DEFAULT_QUESTIONS, true);
    } else if (key === 'advanced') {
      handleBatchUpdateQuestions([...DEFAULT_QUESTIONS, ...BONUS_QUESTIONS], true);
    } else {
      const csQuestions = [
        {
          id: 'cs1',
          questionNumber: 1,
          questionText: 'Q1: What base number system uses only 0 and 1?',
          correctAnswer: 'binary',
          acceptedAliases: ['binary', 'base 2'],
          correctSayText: 'Correct! Base-2 binary representation!',
          incorrectSayText: "Incorrect. The answer is 'binary'.",
          topic: 'Number Systems',
          explanation: 'Computers represent all logic and memory in base-2 binary transistors.',
        },
        {
          id: 'cs2',
          questionNumber: 2,
          questionText: 'Q2: What is the time complexity of dictionary lookup in Python?',
          correctAnswer: 'O(1)',
          acceptedAliases: ['o(1)', 'constant', 'o 1', 'constant time'],
          correctSayText: 'Correct! O(1) average hash lookup!',
          incorrectSayText: 'Incorrect. Hash map lookups average O(1).',
          topic: 'Algorithms & Hash Maps',
          explanation: 'Hash tables achieve average O(1) lookup time by computing key hashes directly.',
        },
        {
          id: 'cs3',
          questionNumber: 3,
          questionText: 'Q3: Which logic gate outputs TRUE only when both inputs are TRUE?',
          correctAnswer: 'AND',
          acceptedAliases: ['and', 'and gate'],
          correctSayText: 'Correct! The AND logic gate!',
          incorrectSayText: 'Incorrect. The answer is AND.',
          topic: 'Boolean Logic',
          explanation: 'An AND gate requires both conjuncts to evaluate to true for high output.',
        },
      ];
      handleBatchUpdateQuestions(csQuestions, true);
    }
  };

  // Auth Handler
  const openAuth = (role: UserRole) => {
    sound.playPop();
    setAuthModalRole(role);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setUserName(user.name.split(' ')[0]);
    if (user.role === 'admin') {
      setActiveTab('admin');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 
        ========================================================================
        TOP BAR CONTRACT: [Wordmark] — [Clean Nav Links] — [Primary Actions]
        ========================================================================
      */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 flex items-center justify-between">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-2">
          <span className="text-base font-bold tracking-tight text-slate-100">
            Smart Study Flashcards
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">·</span>
          <span className="text-xs text-slate-400 hidden sm:inline">Scratch Suite</span>
        </div>

        {/* Zone 2: Clean 4–6 text navigation links */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('stage')}
            className={`transition-colors hover:text-white ${
              activeTab === 'stage' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Scratch Stage
          </button>

          <button
            onClick={() => setActiveTab('blocks')}
            className={`transition-colors hover:text-white ${
              activeTab === 'blocks' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Visual Blocks
          </button>

          <button
            onClick={() => setActiveTab('deck')}
            className={`transition-colors hover:text-white ${
              activeTab === 'deck' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Modular Decks
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`transition-colors hover:text-white ${
              activeTab === 'docs' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Architecture & SRS
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`transition-colors hover:text-white ${
              activeTab === 'roadmap' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Roadmap
          </button>

          <button
            onClick={() => setActiveTab('viva')}
            className={`transition-colors hover:text-white ${
              activeTab === 'viva' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Viva Voce
          </button>

          <button
            onClick={() => {
              if (currentUser.role === 'admin') {
                setActiveTab('admin');
              } else {
                openAuth('admin');
              }
            }}
            className={`transition-colors hover:text-white flex items-center gap-1 ${
              activeTab === 'admin' ? 'text-amber-400 font-semibold' : 'text-slate-400'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Dashboard</span>
          </button>
        </nav>

        {/* Zone 3: Authentication & Primary Actions */}
        <div className="flex items-center gap-2">
          {/* Customer Sign In Button */}
          <button
            onClick={() => openAuth('customer')}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap"
          >
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Customer Sign-In</span>
          </button>

          {/* Admin Sign In Button */}
          <button
            onClick={() => openAuth('admin')}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              currentUser.role === 'admin'
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50'
                : 'text-amber-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-amber-500/40'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Sign-In</span>
          </button>

          {/* User Status Chip */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[11px]">
            <span className={`w-2 h-2 rounded-full ${currentUser.role === 'admin' ? 'bg-amber-400' : 'bg-indigo-400'}`} />
            <span className="font-medium text-slate-200 truncate max-w-[100px]">{currentUser.name.split(' ')[0]}</span>
            <span className="text-[9px] uppercase font-bold text-slate-400">[{currentUser.role}]</span>
          </div>

          {/* Green Flag Primary CTA */}
          <button
            onClick={runQuizWorkflow}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-95 ml-1"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Run Flag</span>
          </button>
        </div>
      </header>

      {/* Mobile Tab Selector */}
      <div className="md:hidden flex items-center justify-between overflow-x-auto gap-2 px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs">
        {(['stage', 'blocks', 'deck', 'docs', 'roadmap', 'viva', 'admin'] as TabView[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              if (tab === 'admin' && currentUser.role !== 'admin') {
                openAuth('admin');
              } else {
                setActiveTab(tab);
              }
            }}
            className={`capitalize px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === tab ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            {tab === 'stage'
              ? 'Stage'
              : tab === 'blocks'
              ? 'Blocks'
              : tab === 'deck'
              ? 'Decks'
              : tab === 'docs'
              ? 'SRS'
              : tab === 'roadmap'
              ? 'Roadmap'
              : tab === 'viva'
              ? 'Viva'
              : 'Admin'}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Paid Premium Payment Bar (Prominently displayed) */}
        <PaidPaymentBar
          currentUser={currentUser}
          onUpgradeSuccess={(upgraded) => setCurrentUser(upgraded)}
        />

        {/* TAB 1: SCRATCH STAGE & LIVE SIMULATOR */}
        {activeTab === 'stage' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Scratch Canvas Stage (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                <ScratchStage
                  score={score}
                  questionNumber={questionNumber}
                  currentSayText={currentSayText}
                  currentAskPrompt={currentAskPrompt}
                  isWaitingForInput={isWaitingForInput}
                  onAnswerSubmit={handleAnswerSubmit}
                  selectedHostId={selectedHostId}
                  selectedBackdropId={selectedBackdropId}
                  backdropUrl={backdropUrl}
                  isRunning={isRunning}
                  onGreenFlagClick={runQuizWorkflow}
                  onStopClick={handleStop}
                  onStepClick={handleStepClick}
                  stepMode={stepMode}
                  onToggleStepMode={() => setStepMode(!stepMode)}
                  soundEnabled={soundEnabled}
                  onToggleSound={handleToggleSound}
                  speechEnabled={speechEnabled}
                  onToggleSpeech={handleToggleSpeech}
                  broadcastMessage={broadcastMessage}
                  hostCostume={hostCostume}
                />

                {/* Phase 1: Setup Stage and Sprites (Trash Cat + Select Host/Backdrop) */}
                <SpriteTray
                  sprites={sprites}
                  backdrops={backdrops}
                  selectedHostId={selectedHostId}
                  selectedBackdropId={selectedBackdropId}
                  onSelectHost={(id) => setSelectedHostId(id)}
                  onSelectBackdrop={(id) => setSelectedBackdropId(id)}
                  onDeleteCat={handleDeleteCat}
                  catDeleted={catDeleted}
                />
              </div>

              {/* Right: Live Interlocking Scratch Blocks with Execution Glow (5 Cols) */}
              <div className="lg:col-span-5 h-full">
                <BlockWorkspace
                  questions={questions}
                  activePromptIndex={currentPromptIndex}
                  activeSubStepId={currentSubStepId}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VISUAL BLOCK SCRIPT WORKSPACE */}
        {activeTab === 'blocks' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  Full 7-Prompt Scratch Block Workspace
                </h3>
                <p className="text-xs text-slate-400">
                  Visual puzzle blocks matching the official Scratch 3.0 specification.
                </p>
              </div>
              <button
                onClick={runQuizWorkflow}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute Script</span>
              </button>
            </div>

            <BlockWorkspace
              questions={questions}
              activePromptIndex={currentPromptIndex}
              activeSubStepId={currentSubStepId}
            />
          </div>
        )}

        {/* TAB 3: MODULAR DECK BUILDER (WITH GEMINI AI) */}
        {activeTab === 'deck' && (
          <div className="animate-in fade-in duration-200">
            <DeckBuilder
              questions={questions}
              onAddQuestion={handleAddQuestion}
              onRemoveQuestion={handleRemoveQuestion}
              onResetDefault={handleResetDefault}
              onLoadPreset={handleLoadPreset}
              onBatchUpdateQuestions={handleBatchUpdateQuestions}
            />
          </div>
        )}

        {/* TAB 4: ARCHITECTURE & SRS */}
        {activeTab === 'docs' && (
          <div className="animate-in fade-in duration-200">
            <DocumentationView />
          </div>
        )}

        {/* TAB 5: ROADMAP */}
        {activeTab === 'roadmap' && (
          <div className="animate-in fade-in duration-200">
            <RoadmapView />
          </div>
        )}

        {/* TAB 6: VIVA VOCE MASTERCLASS */}
        {activeTab === 'viva' && (
          <div className="animate-in fade-in duration-200">
            <VivaMasterclass
              onSwitchToStage={() => setActiveTab('stage')}
              onSwitchToBlocks={() => setActiveTab('blocks')}
              onSwitchToDeck={() => setActiveTab('deck')}
            />
          </div>
        )}

        {/* TAB 7: ADMIN DASHBOARD (SECURITY & ROLE MANAGEMENT) */}
        {activeTab === 'admin' && (
          <div className="animate-in fade-in duration-200">
            <AdminDashboard
              currentUser={currentUser}
              questions={questions}
              onUpdateQuestions={(newQs) => {
                setQuestions(newQs);
                FeatureDatabase.saveQuestions(newQs);
              }}
              onUserRoleChange={(updatedUser) => {
                setCurrentUser(updatedUser);
              }}
            />
          </div>
        )}
      </main>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialRole={authModalRole}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Lab Report Print / Export Modal */}
      <LabReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        questions={questions}
        currentScore={score}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-4 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          <span>Smart Study Flashcards · Scratch 3.0 Educational Software Suite</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Python & CS Lab Viva Edition</span>
          <span>·</span>
          <span>Deterministic State Engine</span>
          <span>·</span>
          <span className="font-mono text-emerald-400">Database Active</span>
        </div>
      </footer>
    </div>
  );
}
