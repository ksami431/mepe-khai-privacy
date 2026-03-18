interface FoodLog {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  logged_at: string;
}

interface WeightLog {
  weight_kg: number;
  logged_at: string;
}

export interface WeeklyStats {
  daysLogged: number;
  avgCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFats: number;
  totalCalories: number;
  weightChange: number | null;
  adherence: number; // percentage
}

export interface MonthlyStats extends WeeklyStats {
  bestDay: { date: string; calories: number } | null;
  worstDay: { date: string; calories: number } | null;
  mostLoggedMealType: string | null;
  streak: number;
}

export const calculateWeeklyStats = (
  foodLogs: FoodLog[],
  weightLogs: WeightLog[],
  calorieTarget: number
): WeeklyStats => {
  if (foodLogs.length === 0) {
    return {
      daysLogged: 0,
      avgCalories: 0,
      avgProtein: 0,
      avgCarbs: 0,
      avgFats: 0,
      totalCalories: 0,
      weightChange: null,
      adherence: 0,
    };
  }

  // Group logs by date
  const logsByDate = new Map<string, FoodLog[]>();
  foodLogs.forEach(log => {
    const date = log.logged_at.split('T')[0];
    if (!logsByDate.has(date)) {
      logsByDate.set(date, []);
    }
    logsByDate.get(date)!.push(log);
  });

  const daysLogged = logsByDate.size;

  // Calculate daily totals
  const dailyTotals = Array.from(logsByDate.values()).map(logs => ({
    calories: logs.reduce((sum, log) => sum + log.calories, 0),
    protein: logs.reduce((sum, log) => sum + log.protein, 0),
    carbs: logs.reduce((sum, log) => sum + log.carbs, 0),
    fats: logs.reduce((sum, log) => sum + log.fats, 0),
  }));

  const totalCalories = dailyTotals.reduce((sum, day) => sum + day.calories, 0);
  const avgCalories = totalCalories / daysLogged;
  const avgProtein = dailyTotals.reduce((sum, day) => sum + day.protein, 0) / daysLogged;
  const avgCarbs = dailyTotals.reduce((sum, day) => sum + day.carbs, 0) / daysLogged;
  const avgFats = dailyTotals.reduce((sum, day) => sum + day.fats, 0) / daysLogged;

  // Calculate adherence (how close to target)
  const adherence = calorieTarget > 0 ? Math.min((avgCalories / calorieTarget) * 100, 200) : 0;

  // Calculate weight change
  let weightChange = null;
  if (weightLogs.length >= 2) {
    const sortedWeights = [...weightLogs].sort((a, b) => 
      new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime()
    );
    weightChange = sortedWeights[sortedWeights.length - 1].weight_kg - sortedWeights[0].weight_kg;
  }

  return {
    daysLogged,
    avgCalories,
    avgProtein,
    avgCarbs,
    avgFats,
    totalCalories,
    weightChange,
    adherence,
  };
};

export const calculateMonthlyStats = (
  foodLogs: FoodLog[],
  weightLogs: WeightLog[],
  calorieTarget: number
): MonthlyStats => {
  const weeklyStats = calculateWeeklyStats(foodLogs, weightLogs, calorieTarget);

  if (foodLogs.length === 0) {
    return {
      ...weeklyStats,
      bestDay: null,
      worstDay: null,
      mostLoggedMealType: null,
      streak: 0,
    };
  }

  // Group logs by date for best/worst day
  const logsByDate = new Map<string, FoodLog[]>();
  foodLogs.forEach(log => {
    const date = log.logged_at.split('T')[0];
    if (!logsByDate.has(date)) {
      logsByDate.set(date, []);
    }
    logsByDate.get(date)!.push(log);
  });

  // Find best and worst days
  let bestDay = null;
  let worstDay = null;
  let maxCalories = -Infinity;
  let minCalories = Infinity;

  logsByDate.forEach((logs, date) => {
    const calories = logs.reduce((sum, log) => sum + log.calories, 0);
    if (calories > maxCalories) {
      maxCalories = calories;
      bestDay = { date, calories };
    }
    if (calories < minCalories) {
      minCalories = calories;
      worstDay = { date, calories };
    }
  });

  // Calculate current streak
  const sortedDates = Array.from(logsByDate.keys()).sort().reverse();
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  
  if (sortedDates.includes(today) || 
      (sortedDates.length > 0 && isYesterday(sortedDates[0]))) {
    streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      if (isConsecutiveDay(sortedDates[i-1], sortedDates[i])) {
        streak++;
      } else {
        break;
      }
    }
  }

  return {
    ...weeklyStats,
    bestDay,
    worstDay,
    mostLoggedMealType: null, // Would need meal_type data
    streak,
  };
};

const isYesterday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0];
};

const isConsecutiveDay = (laterDate: string, earlierDate: string): boolean => {
  const later = new Date(laterDate);
  const earlier = new Date(earlierDate);
  const diffTime = later.getTime() - earlier.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
};

export const getTrendIndicator = (current: number, previous: number): '↑' | '↓' | '→' => {
  const diff = current - previous;
  if (Math.abs(diff) < 0.01) return '→';
  return diff > 0 ? '↑' : '↓';
};

export const getAdherenceColor = (adherence: number): string => {
  if (adherence >= 90 && adherence <= 110) return '#22c55e'; // Green - on target
  if (adherence >= 80 && adherence <= 120) return '#f59e0b'; // Yellow - close
  return '#ef4444'; // Red - off target
};
