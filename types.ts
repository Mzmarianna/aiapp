export interface User {
  id: string;
  name: string;
  password?: string;
  role: 'student' | 'tutor';
  tutorId?: string;
  level: number;
  xp: number;
  weeklyXp: number;
  gems: number;
  avatar: string; // Emoji string
  inventory: string[]; // item IDs
  completedLessons: string[]; // lesson IDs
  completedGoals: string[]; // external goal IDs
  badges: string[]; // badge IDs
  loginStreak: number;
  lastLoginDate: string; // YYYY-MM-DD
  penaltyBox: {
    isActive: boolean;
    reason: string;
    redemptionTask: string;
  } | null;
  parentName?: string;
  parentEmail?: string;
  lessonsCompletedThisWeek?: number; // For email summary
}

export enum ItemCategory {
  AVATAR = 'Avatar',
  REWARD = 'Reward',
}

export interface ShopItem {
  id: string;
  name: string;
  category: ItemCategory;
  price: number;
  asset: string; // Could be an emoji string or image URL
  description?: string;
}

export interface Badge {
  id:string;
  name: string;
  description: string;
  icon: string; // Emoji or SVG string
}

export interface Course {
  id:string;
  title: string;
  description: string;
  lessons: Lesson[];
  icon: string;
}

export interface Lesson {
  id: string;
  title: string;
  topic: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface ExternalGoal {
  id: string;
  platform: 'IXL' | 'Nearpod';
  title: string;
  description: string;
  xp: number;
  gems: number;
}

export interface ClassroomInfo {
  id: string;
  courseName: string;
  classroomLink: string;
  classCode: string;
  meetingLink: string;
  schedule: string;
  icon: string;
}

export interface CustomGoal {
    id: string;
    studentId: string;
    tutorId: string;
    title: string;
    description: string;
    xp: number;
    gems: number;
    isCompleted: boolean;
    createdAt: string;
}

export interface TutorNote {
    id: string;
    studentId: string;
    tutorId: string;
    note: string;
    createdAt: string;
}