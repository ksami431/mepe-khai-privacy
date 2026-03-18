import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FoodLog } from '@/types/food.types';
import { calculateDailyProgress } from '@/lib/calculations';
import { MacroTargets } from '@/lib/calculations';
import { getStartOfDay, getEndOfDay } from '@/utils/format';

export const useDailyStats = (userId: string | undefined, targets: MacroTargets) => {
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDailyLogs = async (isRefresh: boolean = false) => {
    if (!userId) {
      setLoading(false);
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const startOfDay = getStartOfDay();
      const endOfDay = getEndOfDay();

      const { data, error } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('logged_at', startOfDay.toISOString())
        .lte('logged_at', endOfDay.toISOString())
        .order('logged_at', { ascending: false });

      if (error) throw error;
      setFoodLogs(data || []);
    } catch (error) {
      console.error('Error fetching daily logs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDailyLogs();
  }, [userId]);

  const consumed = foodLogs.reduce(
    (acc, log) => ({
      calories: acc.calories + log.calories,
      protein: acc.protein + log.protein,
      carbs: acc.carbs + log.carbs,
      fats: acc.fats + log.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const progress = calculateDailyProgress(consumed, targets);

  const refresh = () => fetchDailyLogs(true);

  return {
    foodLogs,
    consumed,
    progress,
    loading,
    refreshing,
    refresh,
  };
};
