// Exercise types with calorie burn rates (calories per minute for 70kg person)
export const EXERCISE_TYPES = {
  Walking: { emoji: '🚶', caloriesPerMinute: 3.5 },
  Running: { emoji: '🏃', caloriesPerMinute: 10 },
  Cycling: { emoji: '🚴', caloriesPerMinute: 7 },
  Swimming: { emoji: '🏊', caloriesPerMinute: 8 },
  'Gym/Weights': { emoji: '🏋️', caloriesPerMinute: 6 },
  Yoga: { emoji: '🧘', caloriesPerMinute: 3 },
  Dancing: { emoji: '💃', caloriesPerMinute: 5 },
  'Sports (General)': { emoji: '⚽', caloriesPerMinute: 7 },
  Hiking: { emoji: '🥾', caloriesPerMinute: 6 },
  'HIIT': { emoji: '🔥', caloriesPerMinute: 12 },
  Pilates: { emoji: '🤸', caloriesPerMinute: 4 },
  Boxing: { emoji: '🥊', caloriesPerMinute: 9 },
  'Jump Rope': { emoji: '🪢', caloriesPerMinute: 11 },
  'Elliptical': { emoji: '🏃', caloriesPerMinute: 6 },
  'Rowing': { emoji: '🚣', caloriesPerMinute: 7 },
} as const;

export type ExerciseType = keyof typeof EXERCISE_TYPES;

export function getExerciseTypeEmoji(exerciseType: string | null): string {
  if (!exerciseType) return '🏃';
  return EXERCISE_TYPES[exerciseType as ExerciseType]?.emoji || '🏃';
}

export function calculateCaloriesFromExercise(
  exerciseType: ExerciseType,
  durationMinutes: number,
  weight_kg: number = 70
): number {
  const baseCalories = EXERCISE_TYPES[exerciseType].caloriesPerMinute;
  // Adjust for user's weight (assuming base is for 70kg person)
  const weightFactor = weight_kg / 70;
  return Math.round(baseCalories * durationMinutes * weightFactor);
}

// Step count to calorie conversion (rough estimate: 0.04 calories per step for average person)
export function calculateCaloriesFromSteps(steps: number, weight_kg: number = 70): number {
  const baseCaloriesPerStep = 0.04;
  const weightFactor = weight_kg / 70;
  return Math.round(steps * baseCaloriesPerStep * weightFactor);
}

// Get list of exercise types for picker
export function getExerciseTypesList(): ExerciseType[] {
  return Object.keys(EXERCISE_TYPES) as ExerciseType[];
}
