import { Question, SpriteInfo, BackdropInfo } from '../types/scratch';

export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 'q1',
    questionNumber: 1,
    questionText: 'Q1: What keyword is used to define a function in Python?',
    correctAnswer: 'def',
    acceptedAliases: ['def', 'def()', '"def"'],
    correctSayText: 'Correct! Great job!',
    incorrectSayText: "Incorrect. The correct answer is 'def'.",
    topic: 'Python Basics & Functions',
    explanation: 'The def keyword stands for "define". It is used to declare user-defined functions in Python followed by function name and parentheses.',
  },
  {
    id: 'q2',
    questionNumber: 2,
    questionText: 'Q2: Which data structure uses key-value pairs in Python?',
    correctAnswer: 'dictionary',
    acceptedAliases: ['dictionary', 'dict', 'a dictionary', 'dictionaries'],
    correctSayText: 'Correct! Spot on!',
    incorrectSayText: "Incorrect. It's a dictionary!",
    topic: 'Data Structures & Mapping',
    explanation: 'Python dictionaries (dict) store associative mapping data in key:value pairs enclosed in curly braces {}. Keys must be immutable and unique.',
  },
  {
    id: 'q3',
    questionNumber: 3,
    questionText: 'Q3: What index does a Python list start with?',
    correctAnswer: '0',
    acceptedAliases: ['0', 'zero', 'index 0'],
    correctSayText: 'Correct! Zero-indexed!',
    incorrectSayText: 'Incorrect. Lists start at index 0.',
    topic: 'Lists & Indexing',
    explanation: 'Like most modern programming languages (C, Java, JavaScript), Python lists are zero-indexed, meaning the first element is accessed at index [0].',
  },
];

export const BONUS_QUESTIONS: Question[] = [
  {
    id: 'q4_bonus',
    questionNumber: 4,
    questionText: 'Q4: What data structure in Python is immutable and uses parentheses ()?',
    correctAnswer: 'tuple',
    acceptedAliases: ['tuple', 'a tuple', 'tuples'],
    correctSayText: 'Correct! Tuples are immutable!',
    incorrectSayText: 'Incorrect. It is a tuple!',
    topic: 'Immutable Sequences',
    explanation: 'Tuples are ordered collections that cannot be modified after creation, declared with parentheses (1, 2, 3).',
  },
  {
    id: 'q5_bonus',
    questionNumber: 5,
    questionText: 'Q5: What built-in function returns the total number of items in a list?',
    correctAnswer: 'len',
    acceptedAliases: ['len', 'len()'],
    correctSayText: 'Correct! len() computes sequence length!',
    incorrectSayText: 'Incorrect. The built-in function is len().',
    topic: 'Built-in Functions',
    explanation: 'The len() function returns the cardinality/length of any sequence or collection object in O(1) time.',
  },
];

export const INITIAL_SPRITES: SpriteInfo[] = [
  {
    id: 'robot',
    name: 'Robo-Professor',
    role: 'AI Study Host',
    description: 'Charming retro-futuristic study tutor robot with glowing LED visor and academic bowtie.',
    avatarUrl: '/src/assets/images/avatar_professor_robot_1790693570356.jpg',
    costumeType: 'image',
    isDeleted: false,
  },
  {
    id: 'avery',
    name: 'Avery',
    role: 'Peer Study Lead',
    description: 'Energetic collegiate tutor with glasses, notebook, and friendly step-by-step guidance.',
    costumeType: 'svg',
    isDeleted: false,
  },
  {
    id: 'nano',
    name: 'Nano',
    role: 'Cyber Mascot',
    description: 'Curious cyber alien creature with antenna and enthusiastic learning animations.',
    costumeType: 'svg',
    isDeleted: false,
  },
  {
    id: 'owl',
    name: 'Professor Owl',
    role: 'Senior Academician',
    description: 'Wise scholarly owl donning an Oxford mortarboard and magnifying glass.',
    costumeType: 'svg',
    isDeleted: false,
  },
  {
    id: 'cat',
    name: 'Scratch Cat',
    role: 'Default Scratch Sprite',
    description: 'The standard orange Scratch cat mascot. To follow the prompt instructions, delete it using the trash icon.',
    costumeType: 'svg',
    isDeleted: false,
  },
];

export const BACKDROPS: BackdropInfo[] = [
  {
    id: 'chalkboard',
    name: 'Chalkboard',
    theme: 'Academic Lecture Hall',
    description: 'Classic university lecture hall with deep slate-green chalkboard and chalk sketches.',
    imageUrl: '/src/assets/images/backdrop_chalkboard_1790693526888.jpg',
  },
  {
    id: 'classroom',
    name: 'Classroom',
    theme: 'Modern School Classroom',
    description: 'Bright contemporary educational classroom with student desks and natural daylight.',
    imageUrl: '/src/assets/images/backdrop_classroom_1790693541921.jpg',
  },
  {
    id: 'library',
    name: 'University Library',
    theme: 'Scholarly Archive',
    description: 'Warm atmospheric academic library with oak bookshelves and green banker lamps.',
    imageUrl: '/src/assets/images/backdrop_library_1790693557267.jpg',
  },
  {
    id: 'cyberlab',
    name: 'Cyber Studio',
    theme: 'Digital Lab',
    description: 'High-contrast dark grid chalkboard tailored for Python programming & data structures.',
    imageUrl: '',
  },
];
