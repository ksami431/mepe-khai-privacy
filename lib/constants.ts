export const APP_NAME = 'Mepe Khai';
export const APP_TAGLINE = 'I eat by measuring';

export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
export type MealType = typeof MEAL_TYPES[number];

export const ACTIVITY_LEVELS = {
  sedentary: {
    label: 'Sedentary',
    description: 'Little or no exercise',
  },
  light: {
    label: 'Lightly Active',
    description: 'Light exercise 1-3 days/week',
  },
  moderate: {
    label: 'Moderately Active',
    description: 'Moderate exercise 3-5 days/week',
  },
  active: {
    label: 'Very Active',
    description: 'Hard exercise 6-7 days/week',
  },
  very_active: {
    label: 'Extremely Active',
    description: 'Very hard exercise & physical job',
  },
};

export const GOALS = {
  lose: {
    label: 'Lose Weight',
    description: 'Create a calorie deficit',
    icon: '📉',
  },
  maintain: {
    label: 'Maintain Weight',
    description: 'Stay at current weight',
    icon: '⚖️',
  },
  gain: {
    label: 'Gain Weight',
    description: 'Build muscle mass',
    icon: '📈',
  },
};

export const GENDERS = {
  male: { label: 'Male', icon: '♂️' },
  female: { label: 'Female', icon: '♀️' },
  other: { label: 'Other', icon: '⚧' },
};

export const COLORS = {
  primary: '#0ea5e9',
  success: '#22c55e',
  warning: '#eab308',
  danger: '#ef4444',
  protein: '#f97316',
  carbs: '#3b82f6',
  fats: '#eab308',
};

export const getMealTypeByTime = (): MealType | null => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 11) {
    return 'breakfast';
  } else if (hour >= 11 && hour < 16) {
    return 'lunch';
  } else if (hour >= 16 && hour < 22) {
    return 'dinner';
  } else {
    return 'snack';
  }
};

export const getMealTypeEmoji = (mealType: MealType | null): string => {
  if (!mealType) return '';
  
  const emojiMap: Record<MealType, string> = {
    breakfast: '🌅',
    lunch: '🌞',
    dinner: '🌙',
    snack: '🍎',
  };
  
  return emojiMap[mealType];
};
