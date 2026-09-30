import { VivaQuestion } from '../types/scratch';

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: 'viva-1',
    category: 'Variables',
    professorPrompt: 'Explain how your project manages data storage. What is the role of the "Score" and "QuestionNumber" variables?',
    studentModelAnswer: 
      'In our Scratch application, "Score" and "QuestionNumber" represent global dynamic state registers allocated in memory during initialization. When the Green Flag is clicked, an idempotent reset sets Score to 0 and QuestionNumber to 1. Throughout the quiz execution, Score operates as a monotonic accumulator: whenever an "if <(answer) = [expected]>" predicate evaluates to true, an atomic "change [Score v] by (1)" mutation occurs. This mimics how transactional counters or database accumulators persist state across discrete execution cycles without data corruption or memory leaks.',
    keyTechnicalTerms: [
      'Dynamic State Accumulator',
      'Idempotent Reset',
      'Atomic Mutation',
      'Global Memory Register',
      'Deterministic Lifecycle'
    ],
    vivaTip: 'Always emphasize that Score does not just display a number on the screen; it acts as an in-memory state variable that dynamically drives downstream conditional logic, such as the final grade calculation in Prompt 6.',
    rubricScoreMax: 10,
  },
  {
    id: 'viva-2',
    category: 'Control Flow',
    professorPrompt: 'Point out the control flow in your script. How does your program handle user responses and determine feedback?',
    studentModelAnswer: 
      'The control flow leverages synchronous blocking input coupled with binary selection control structures (if-then-else blocks). When the "ask and wait" block triggers, the main thread halts synchronously awaiting user sensing input. Once the input buffer receives the respondent string, it is piped into the Boolean equality operator <(answer) = [def]>. If the comparison evaluates to True, execution branches into the then-block, playing an affirmative auditory/visual chime and incrementing the state accumulator. If False, the execution falls into the else-block for error handling and feedback, ensuring deterministic dual-branch behavior with zero dangling operations.',
    keyTechnicalTerms: [
      'Synchronous Blocking I/O',
      'Binary Selection Control Structure',
      'Boolean Equality Operator',
      'Branch Divergence',
      'Error Handling / Fallback'
    ],
    vivaTip: 'Point directly to the C-shaped if/else block in the visual editor. Explain that Scratch creates an exclusive binary fork: exactly one branch executes per question, guaranteeing predictability and algorithmic correctness.',
    rubricScoreMax: 10,
  },
  {
    id: 'viva-3',
    category: 'Modular Design',
    professorPrompt: 'How extensible is this architecture? What engineering effort is required to expand this from 3 questions to 50 questions or different subjects?',
    studentModelAnswer: 
      'The system adheres to the Open-Closed Principle and modular decomposition. Each flashcard is implemented as an atomic Question Unit consisting of an (Ask -> Evaluate -> Branch -> Mutate) block pattern. To add new questions or load alternate decks (such as Python OOP, Algorithms, or Web Tech), we simply duplicate the composite question block or iterate through a sequence table. The core event orchestration (Green Flag initialization, final score calculation, and broadcast [restart_quiz]) remains completely decoupled and untouched. In our web environment, our Modular Deck Builder proves this by allowing live runtime injection of custom flashcard blocks.',
    keyTechnicalTerms: [
      'Open-Closed Principle (OCP)',
      'Modular Decomposition',
      'Atomic Composite Pattern',
      'Decoupled Event Orchestration',
      'Extensibility & Maintainability'
    ],
    vivaTip: 'Open the "Modular Deck Builder" tab live in front of the examiner. Add a 4th question on Tuples or Loops, and show how the visual Scratch block stack instantly accommodates it without breaking the existing flow.',
    rubricScoreMax: 10,
  },
  {
    id: 'viva-4',
    category: 'Scratch Architecture',
    professorPrompt: 'Why did you use "broadcast [restart_quiz]" in Prompt 7 instead of a simple infinite loop?',
    studentModelAnswer: 
      'Using a message broadcast pattern implements a Publisher-Subscriber (Pub/Sub) event bus rather than a tight, CPU-intensive busy-waiting loop. When the user selects "yes" to replay, the sprite broadcasts [restart_quiz], which triggers an asynchronous event listener "when I receive [restart_quiz]". This decouples the termination and restart workflows, allows other sprites or stage backdrops to independently listen and reset their local states, and cleanly resets execution without stack overflow or stale thread accumulation.',
    keyTechnicalTerms: [
      'Publisher-Subscriber (Pub/Sub)',
      'Event-Driven Architecture',
      'Loose Coupling',
      'Stack Hygiene',
      'Thread Clean-up'
    ],
    vivaTip: 'Highlight how broadcast messages in Scratch are broadcast across all active actors (sprites and backdrops), which makes future multi-sprite enhancements (like cheerleading sprites or countdown timers) trivial to implement.',
    rubricScoreMax: 10,
  },
];
