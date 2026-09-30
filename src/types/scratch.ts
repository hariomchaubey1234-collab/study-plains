export type SpriteId = 'avery' | 'nano' | 'robot' | 'owl' | 'cat';

export interface SpriteInfo {
  id: SpriteId;
  name: string;
  role: string;
  description: string;
  avatarUrl?: string;
  costumeType: 'svg' | 'image';
  isDeleted?: boolean;
}

export type BackdropId = 'chalkboard' | 'classroom' | 'library' | 'cyberlab';

export interface BackdropInfo {
  id: BackdropId;
  name: string;
  theme: string;
  description: string;
  imageUrl: string;
}

export interface Question {
  id: string;
  questionNumber: number;
  questionText: string;
  correctAnswer: string;
  acceptedAliases: string[];
  correctSayText: string;
  incorrectSayText: string;
  topic: string;
  explanation: string;
}

export type BlockCategory = 
  | 'events' 
  | 'control' 
  | 'sensing' 
  | 'operators' 
  | 'variables' 
  | 'looks';

export interface ScratchBlockData {
  id: string;
  promptStep: number;
  category: BlockCategory;
  type: string;
  label: string;
  params?: string[];
  nestedBlocks?: ScratchBlockData[];
  elseBlocks?: ScratchBlockData[];
}

export interface VivaQuestion {
  id: string;
  category: 'Variables' | 'Control Flow' | 'Modular Design' | 'Scratch Architecture';
  professorPrompt: string;
  studentModelAnswer: string;
  keyTechnicalTerms: string[];
  vivaTip: string;
  rubricScoreMax: number;
}
