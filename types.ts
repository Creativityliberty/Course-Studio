
export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published'
}

export enum ContentBlockType {
  VIDEO = 'video',
  TEXT = 'text',
  QUIZ = 'quiz',
  RESOURCE = 'resource',
  IMAGE = 'image'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface ResourceLink {
  label: string;
  url: string;
  type: 'article' | 'tool' | 'book' | 'pdf';
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  title: string;
  content: string;
  payload?: {
    url?: string;
    videoUrls?: string[];
    primaryVideoIndex?: number;
    questions?: QuizQuestion[];
    resources?: ResourceLink[];
    glossary?: GlossaryTerm[];
    imageUrl?: string;
    imagePrompt?: string;
  };
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  blocks: ContentBlock[];
}

export interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  status: CourseStatus;
  modules: Module[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
