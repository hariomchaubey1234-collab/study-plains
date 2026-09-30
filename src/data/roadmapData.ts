export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  duration: string;
  status: 'completed' | 'in_progress' | 'planned';
  goal: string;
  scratchBlocksUsed: string[];
  tasks: {
    id: string;
    description: string;
    acceptanceCriteria: string;
    csConcept: string;
  }[];
  verificationSteps: string[];
  vivaTalkingPoints: string[];
}

export const IMPLEMENTATION_ROADMAP: RoadmapPhase[] = [
  {
    phaseNumber: 1,
    title: 'Stage & Sprite Environment Setup',
    duration: 'Sprint 1 · Initial Stage Calibration',
    status: 'completed',
    goal: 'Configure the Scratch stage coordinate space (-240 to +240 X, -180 to +180 Y), remove the boilerplate cat mascot, select an academic professor avatar, and calibrate background backdrop lighting.',
    scratchBlocksUsed: ['delete sprite', 'choose backdrop', 'set size to (100) %', 'go to x: (0) y: (-20)'],
    tasks: [
      {
        id: 'task-1-1',
        description: 'Purge default Sprite1 (Cat) via asset pane trash affordance to decouple from standard templates.',
        acceptanceCriteria: 'Stage contains zero references to Sprite1; workspace hierarchy is clean.',
        csConcept: 'Resource Deallocation & Clean Canvas Initialization',
      },
      {
        id: 'task-1-2',
        description: 'Provision Study Professor Host (Robo-Professor, Avery, Nano, or Owl) with centered idle posture.',
        acceptanceCriteria: 'Character sprite renders with SVG vector clarity or hi-res raster costume at origin.',
        csConcept: 'Actor-Model Instantiation & Visual Shell Binding',
      },
      {
        id: 'task-1-3',
        description: 'Select educational backdrop (Chalkboard / Classroom / University Library) with high text contrast.',
        acceptanceCriteria: 'Backdrop maintains >= 4.5:1 contrast against speech bubble and variable monitors.',
        csConcept: 'UI/UX Visual Scrim & Viewport Legibility',
      },
    ],
    verificationSteps: [
      'Confirm Sprite pane has exactly one active character host.',
      'Check that stage aspect ratio conforms to 4:3 standard Scratch viewport.',
      'Verify backdrop scales seamlessly without stretching or distortion.',
    ],
    vivaTalkingPoints: [
      'Why delete the cat? "Deleting boilerplate assets demonstrates intentional system design rather than using default templates."',
      'Host architecture: "The character acts as the primary sensory actor, managing dialogue and user input prompts."',
    ],
  },
  {
    phaseNumber: 2,
    title: 'Prompt 1: Initialization & State Reset',
    duration: 'Sprint 2 · State Lifecycle Architecture',
    status: 'completed',
    goal: 'Declare application data storage registers (Score, QuestionNumber) and hook variable reset actions to the Green Flag entry point.',
    scratchBlocksUsed: ['when ⚑ clicked', 'set [Score v] to [0]', 'set [QuestionNumber v] to [1]'],
    tasks: [
      {
        id: 'task-2-1',
        description: 'Declare global numeric variable "Score" initialized to 0.',
        acceptanceCriteria: 'Score monitor reads 0 upon green flag trigger.',
        csConcept: 'Deterministic Memory Allocation & Primitive State Initialization',
      },
      {
        id: 'task-2-2',
        description: 'Declare ordinal counter variable "QuestionNumber" initialized to 1.',
        acceptanceCriteria: 'QuestionNumber monitor reads 1 on execution start.',
        csConcept: 'Ordinal Sequence Indexing & Monotonic Counter Setup',
      },
      {
        id: 'task-2-3',
        description: 'Bind event handler "when ⚑ clicked" as the deterministic bootstrap lifecycle event.',
        acceptanceCriteria: 'Every execution run begins from a clean, predictable state machine state.',
        csConcept: 'Idempotency & Bootstrap Event Listeners',
      },
    ],
    verificationSteps: [
      'Click green flag multiple times in succession: Verify Score and QuestionNumber consistently reset to 0 and 1.',
      'Confirm Scratch stage monitors show real-time values in top-left quadrant.',
    ],
    vivaTalkingPoints: [
      'Variable state tracking: "The Score variable functions as an in-memory accumulator tracking state dynamically, identical to a database counter or session store."',
      'Idempotency: "Resetting state on green flag prevents stale data leakage between consecutive quiz sessions."',
    ],
  },
  {
    phaseNumber: 3,
    title: 'Prompt 2: Greeting & Sensory Input Binding',
    duration: 'Sprint 3 · User Onboarding & String Interpolation',
    status: 'completed',
    goal: 'Welcome user with timed speech bubble, capture respondent identity via synchronous blocking sensing block, and output concatenated greeting.',
    scratchBlocksUsed: [
      'say [Welcome to Smart Study Flashcards!] for (2) seconds',
      'ask [What is your name?] and wait',
      'say (join [Hello ] (answer)) for (2) seconds',
    ],
    tasks: [
      {
        id: 'task-3-1',
        description: 'Render speech bubble welcoming student for 2000ms duration.',
        acceptanceCriteria: 'Speech bubble renders adjacent to host sprite; vanishes automatically after 2s.',
        csConcept: 'Asynchronous Timer / Non-blocking UI Notification',
      },
      {
        id: 'task-3-2',
        description: 'Deploy synchronous "ask [What is your name?] and wait" input prompt bar.',
        acceptanceCriteria: 'Execution halts synchronously until user enters string and clicks checkmark or presses Enter.',
        csConcept: 'Blocking I/O & Event-Driven Keyboard Sensing',
      },
      {
        id: 'task-3-3',
        description: 'Concatenate prefix "Hello " with sensing register (answer) via Scratch join operator.',
        acceptanceCriteria: 'Personalized greeting displays for exactly 2 seconds.',
        csConcept: 'String Interpolation & Standard Output Formatting',
      },
    ],
    verificationSteps: [
      'Input sample name "Alice": Verify bubble says "Hello Alice" for 2 seconds.',
      'Verify input box accepts whitespace, alphanumeric characters, and submits via Enter key.',
    ],
    vivaTalkingPoints: [
      'Sensing lifecycle: "The ask-and-wait block suspends the execution thread until the sensing buffer receives input, mirroring standard readline/cin operations."',
      'Join operator: "The join block performs string concatenation, demonstrating fundamental string manipulation."',
    ],
  },
  {
    phaseNumber: 4,
    title: 'Prompts 3–5: Core Quiz Engine & Evaluation Branches',
    duration: 'Sprint 4 · Conditional Logic & Dynamic Accumulation',
    status: 'completed',
    goal: 'Present questions Q1 (Python functions "def"), Q2 (Data structures "dictionary"), and Q3 (List indexing "0") with conditional if/else evaluation.',
    scratchBlocksUsed: [
      'ask [Q: ...] and wait',
      'if <(answer) = [...]> then ... else ...',
      'change [Score v] by (1)',
      'change [QuestionNumber v] by (1)',
    ],
    tasks: [
      {
        id: 'task-4-1',
        description: 'Implement Q1: Python function keyword evaluation ("def") with +1 score increment on true branch.',
        acceptanceCriteria: 'Answering "def" increments Score to 1 and says "Correct! Great job!". Answering anything else yields feedback with no increment.',
        csConcept: 'Binary Conditional Branching & Boolean Equality Operators',
      },
      {
        id: 'task-4-2',
        description: 'Implement Q2: Key-value data structure ("dictionary" or "dict") with score update.',
        acceptanceCriteria: 'Answering "dictionary" increments score; displays "Correct! Spot on!" for 2 seconds.',
        csConcept: 'Associative Mapping Theory & State Mutation',
      },
      {
        id: 'task-4-3',
        description: 'Implement Q3: Zero-indexing evaluation ("0") with score update.',
        acceptanceCriteria: 'Answering "0" increments score; displays "Correct! Zero-indexed!" for 2 seconds.',
        csConcept: 'Array / Sequence Indexing Conventions & Literal Comparison',
      },
    ],
    verificationSteps: [
      'Test all permutations: 3/3 correct (Score = 3), 1/3 correct (Score = 1), 0/3 correct (Score = 0).',
      'Verify case-insensitive normalization handles "DEF" and "Def" correctly.',
    ],
    vivaTalkingPoints: [
      'Control flow explanation: "Each question block uses a selection control structure (if-then-else) to evaluate user input against a known truth predicate, mutating the state accumulator only on positive resolution."',
      'Defensive parsing: "Normalizing the answer buffer ensures robust evaluation against unintentional whitespace and casing."',
    ],
  },
  {
    phaseNumber: 5,
    title: 'Prompt 6: Score Aggregation & Relational Feedback',
    duration: 'Sprint 5 · Relational Analysis & Mastery Tiering',
    status: 'completed',
    goal: 'Report final score string concatenation and trigger performance-tiered mastery feedback using relational operator (Score > 2).',
    scratchBlocksUsed: [
      'say (join [Quiz Over! Your final score is: ] (Score)) for (3) seconds',
      'if <(Score) > [2]> then ... else ...',
    ],
    tasks: [
      {
        id: 'task-5-1',
        description: 'Publish final score broadcast banner: "Quiz Over! Your final score is: [Score]" for 3 seconds.',
        acceptanceCriteria: 'Accurately displays numeric sum of correct responses.',
        csConcept: 'Dynamic State Projection & Data Binding',
      },
      {
        id: 'task-5-2',
        description: 'Implement relational predicate `<(Score) > [2]>` for high-achievement distinction.',
        acceptanceCriteria: 'Score of 3 triggers "Awesome! You\'re a Python Pro! 🏆". Score <= 2 triggers "Keep practicing! You can do better next time. 💪".',
        csConcept: 'Relational Inequality Predicates & Tiered Rubrics',
      },
    ],
    verificationSteps: [
      'Boundary value testing: Test Score = 2 (triggers practice message), Score = 3 (triggers trophy message).',
      'Confirm 3000ms display timing prevents abrupt UI truncation.',
    ],
    vivaTalkingPoints: [
      'Relational boundary: "Using the strict inequality (Score > 2) requires a perfect 3/3 score to achieve Mastery tier, representing 100% conceptual retention."',
    ],
  },
  {
    phaseNumber: 6,
    title: 'Prompt 7: Event Loop & Broadcast Re-triggering',
    duration: 'Sprint 6 · Event Bus & Termination Protocol',
    status: 'completed',
    goal: 'Prompt user for replay intent, broadcasting [restart_quiz] on affirmative answer or executing termination protocol (stop all).',
    scratchBlocksUsed: [
      'ask [Do you want to study again? (yes/no)] and wait',
      'if <(answer) = [yes]> then',
      'broadcast [restart_quiz v]',
      'else ... stop [all v]',
    ],
    tasks: [
      {
        id: 'task-6-1',
        description: 'Sensing prompt for study session recurrence: "Do you want to study again? (yes/no)".',
        acceptanceCriteria: 'Halts execution until input received; evaluates "yes" / "y".',
        csConcept: 'Interactive Session Continuation Decision',
      },
      {
        id: 'task-6-2',
        description: 'Implement event broadcast "broadcast [restart_quiz v]" for event-driven looping.',
        acceptanceCriteria: 'Receiver event "when I receive [restart_quiz]" resets Score and restarts greeting sequence without page reload.',
        csConcept: 'Publisher-Subscriber / Event Bus Architecture in Block Languages',
      },
      {
        id: 'task-6-3',
        description: 'Implement termination branch saying farewell and halting thread with "stop [all v]".',
        acceptanceCriteria: 'Displays goodbye message for 2 seconds and halts Scratch runner process.',
        csConcept: 'Deterministic Process Termination & Resource Clean-up',
      },
    ],
    verificationSteps: [
      'Enter "yes": Verify state resets to Score = 0 and question flow restarts seamlessly.',
      'Enter "no": Verify goodbye message displays and all active scripts halt.',
    ],
    vivaTalkingPoints: [
      'Event-driven loop: "Rather than using an infinite while loop, Scratch utilizes message broadcasting (Pub/Sub) to decouple session reset from linear script flow."',
      'Stop all block: "Ensures clean de-registration of listeners and prevents dangling timer routines."',
    ],
  },
  {
    phaseNumber: 7,
    title: 'Modular Deck Extension & Viva Voce Readiness',
    duration: 'Sprint 7 · Extensibility Architecture & Presentation Defense',
    status: 'completed',
    goal: 'Demonstrate modular design principles by creating dynamic question injectors and packaging viva defense documentation.',
    scratchBlocksUsed: ['custom question blocks', 'modular script duplication', 'viva defense matrix'],
    tasks: [
      {
        id: 'task-7-1',
        description: 'Provide dynamic deck builder allowing arbitrary question insertion into Scratch block stack.',
        acceptanceCriteria: 'Adding Q4 updates the visual Scratch block stack in real-time with zero manual restructuring.',
        csConcept: 'Open-Closed Principle (OCP) & DRY Code Organization',
      },
      {
        id: 'task-7-2',
        description: 'Generate interactive Viva Voce defense simulator covering Variables, Control Flow, and Architecture.',
        acceptanceCriteria: 'Students can rehearse technical explanations with sample rubric evaluations.',
        csConcept: 'Technical Defense & Pedagogical Articulation',
      },
      {
        id: 'task-7-3',
        description: 'Deliver downloadable/printable comprehensive laboratory engineering report.',
        acceptanceCriteria: 'Generates structured report with SRS, test execution logs, and block diagrams.',
        csConcept: 'Professional Technical Documentation & Audit Readiness',
      },
    ],
    verificationSteps: [
      'Add a custom question in the Modular Deck Builder; confirm it executes in the Scratch Stage.',
      'Verify Viva simulator gives instant scoring and model defense scripts.',
    ],
    vivaTalkingPoints: [
      'Modular design: "By encapsulating the ask-and-check pattern into a reusable block template, we achieve high cohesion and low coupling."',
    ],
  },
];
