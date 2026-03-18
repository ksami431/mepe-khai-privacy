export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Goal = 'lose' | 'maintain' | 'gain';

export interface UserProfile {
  age: number;
  gender: Gender;
  weight_kg: number;
  height_cm: number;
  activity_level: ActivityLevel;
  goal: Goal;
}

export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export const calculateBMR = (weight_kg: number, height_cm: number, age: number, gender: Gender): number => {
  if (gender === 'male') {
    return 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
  } else if (gender === 'female') {
    return 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
  } else {
    return 10 * weight_kg + 6.25 * height_cm - 5 * age - 78;
  }
};

export const calculateTDEE = (bmr: number, activityLevel: ActivityLevel): number => {
  return Math.round(bmr * activityMultipliers[activityLevel]);
};

export const calculateCalorieTarget = (tdee: number, goal: Goal): number => {
  switch (goal) {
    case 'lose':
      return Math.round(tdee - 500);
    case 'maintain':
      return tdee;
    case 'gain':
      return Math.round(tdee + 300);
    default:
      return tdee;
  }
};

export const calculateMacroTargets = (profile: UserProfile): MacroTargets => {
  const bmr = calculateBMR(profile.weight_kg, profile.height_cm, profile.age, profile.gender);
  const tdee = calculateTDEE(bmr, profile.activity_level);
  const calories = calculateCalorieTarget(tdee, profile.goal);

  const proteinPerKg = profile.goal === 'lose' ? 2.2 : profile.goal === 'gain' ? 2.0 : 1.8;
  const protein = Math.round(profile.weight_kg * proteinPerKg);

  const fatsPercentage = 0.25;
  const fats = Math.round((calories * fatsPercentage) / 9);

  const proteinCalories = protein * 4;
  const fatsCalories = fats * 9;
  const carbsCalories = calories - proteinCalories - fatsCalories;
  const carbs = Math.round(carbsCalories / 4);

  return {
    calories,
    protein,
    carbs,
    fats,
  };
};

export const calculateDailyProgress = (
  consumed: { calories: number; protein: number; carbs: number; fats: number },
  targets: MacroTargets
) => {
  return {
    calories: {
      consumed: consumed.calories,
      target: targets.calories,
      remaining: targets.calories - consumed.calories,
      percentage: Math.min(100, (consumed.calories / targets.calories) * 100),
    },
    protein: {
      consumed: consumed.protein,
      target: targets.protein,
      remaining: targets.protein - consumed.protein,
      percentage: Math.min(100, (consumed.protein / targets.protein) * 100),
    },
    carbs: {
      consumed: consumed.carbs,
      target: targets.carbs,
      remaining: targets.carbs - consumed.carbs,
      percentage: Math.min(100, (consumed.carbs / targets.carbs) * 100),
    },
    fats: {
      consumed: consumed.fats,
      target: targets.fats,
      remaining: targets.fats - consumed.fats,
      percentage: Math.min(100, (consumed.fats / targets.fats) * 100),
    },
  };
};
