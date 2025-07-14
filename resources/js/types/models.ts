// Type definitions for our Laravel models

import { OperationType, ModuleType } from '../enums';

export interface Activity {
  id: number;
  content: {
    question: string;
    options: string[];
    correct_answer_id: number;
  };
  type: 'multiple-choice';
  operation: OperationType;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: number;
  name: string;
  icon: string;
  description: string;
  color: string;
  operation: OperationType;
  type: ModuleType;
  no_feedback: boolean;
  activities: Activity[];
  pivot?: {
    position: number;
  };
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: number;
  name: string;
  invite_code: string;
  is_active: boolean;
  modules: Module[];
  created_at: string;
  updated_at: string;
}

export interface Attempt {
  id: number;
  activity_id: number;
  room_id: number;
  student_id: number;
  selected_option: number;
  correct: boolean;
  score: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

// Helper interfaces for API responses
export interface RoomPageProps {
  room: Room;
  currentActivity?: Activity;
  currentModule?: Module;
  progress: {
    total: number;
    completed: number;
    percentage: number;
  };
  moduleProgress: Record<number, {
    total: number;
    completed: number;
    percentage: number;
  }>;
}

// Activity helpers
export interface ActivityContent {
  question: string;
  options: string[];
  correct_answer_id: number;
  [key: string]: any;
}

export interface ActivityWithModule extends Activity {
  module_id: number;
  module_name: string;
}

// Progress tracking
export interface ModuleProgress {
  total: number;
  completed: number;
  percentage: number;
}

export interface RoomProgress {
  total_activities: number;
  completed_activities: number;
  percentage: number;
  modules: Record<number, ModuleProgress>;
}

// Activity creation templates
export interface ActivityTemplate {
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division';
  difficulty: 'easy' | 'medium' | 'hard';
}

// Factory methods for frontend
export const ActivityFactory = {
  createMultipleChoice: (data: {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    operation: OperationType;
  }): Partial<Activity> => ({
    content: {
      question: data.question,
      options: data.options,
      correct_answer_id: data.correctAnswerIndex,
    },
    type: 'multiple-choice',
    operation: data.operation,
  }),

  createFromTemplate: (template: ActivityTemplate): Partial<Activity> => {
    // This would be handled by the backend
    return {
      type: 'multiple-choice',
      operation: OperationType[template.operation],
    };
  },
};

// Validation helpers
export const ActivityValidators = {
  isValidMultipleChoice: (activity: any): activity is Activity => {
    return (
      activity?.type === 'multiple-choice' &&
      activity?.content?.question &&
      Array.isArray(activity?.content?.options) &&
      activity?.content?.options.length >= 2 &&
      typeof activity?.content?.correct_answer_id === 'number' &&
      activity?.content?.correct_answer_id >= 0 &&
      activity?.content?.correct_answer_id < activity?.content?.options.length
    );
  },

  isCompleteActivity: (activity: any): activity is Activity => {
    return (
      ActivityValidators.isValidMultipleChoice(activity) &&
      typeof activity.id === 'number' &&
      activity.operation &&
      activity.created_at &&
      activity.updated_at
    );
  },
};

// Progress calculation helpers
export const ProgressHelpers = {
  calculateModuleProgress: (module: Module, completedIds: number[]): ModuleProgress => {
    const total = module.activities.length;
    const completed = module.activities.filter(a => completedIds.includes(a.id)).length;
    
    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  },

  calculateRoomProgress: (room: Room, completedIds: number[]): RoomProgress => {
    const allActivities = room.modules.flatMap(m => m.activities);
    const totalActivities = allActivities.length;
    const completedActivities = allActivities.filter(a => completedIds.includes(a.id)).length;
    
    const modules = room.modules.reduce((acc, module) => {
      acc[module.id] = ProgressHelpers.calculateModuleProgress(module, completedIds);
      return acc;
    }, {} as Record<number, ModuleProgress>);

    return {
      total_activities: totalActivities,
      completed_activities: completedActivities,
      percentage: totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0,
      modules,
    };
  },
};

// Color and icon helpers
export const ModuleHelpers = {
  getColorForOperation: (operation: OperationType): string => {
    const colors = {
      [OperationType.Addition]: '#4CAF50',
      [OperationType.Subtraction]: '#FF9800',
      [OperationType.Multiplication]: '#2196F3',
      [OperationType.Division]: '#9C27B0',
      [OperationType.All]: '#FF6B6B',
    };
    return colors[operation] || '#6B7280';
  },

  getIconForOperation: (operation: OperationType): string => {
    const icons = {
      [OperationType.Addition]: '➕',
      [OperationType.Subtraction]: '➖',
      [OperationType.Multiplication]: '✖️',
      [OperationType.Division]: '➗',
      [OperationType.All]: '📝',
    };
    return icons[operation] || '📊';
  },

  getDisplayNameForOperation: (operation: OperationType): string => {
    const names = {
      [OperationType.Addition]: 'Adição',
      [OperationType.Subtraction]: 'Subtração',
      [OperationType.Multiplication]: 'Multiplicação',
      [OperationType.Division]: 'Divisão',
      [OperationType.All]: 'Todas as Operações',
    };
    return names[operation] || operation;
  },
};