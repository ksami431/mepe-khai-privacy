import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface FoodLog {
  id: string;
  user_id: string;
  meal_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;
  logged_at: string;
  image_url: string | null;
  ai_analyzed: boolean;
  weight_grams?: number;
  created_at: string;
}

export interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export const useFoodLogs = (date?: string) => {
  const { user } = useAuth();
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const targetDate = date || new Date().toISOString().split('T')[0];

  const getFoodLogsByDateRange = async (startDate: string, endDate: string) => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', startDate)
        .lte('logged_at', endDate)
        .order('logged_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading food logs by date range:', error);
      throw error;
    }
  };

  const getFoodLogsByDate = async (date: string) => {
    if (!user) return [];

    const startOfDay = `${date}T00:00:00`;
    const endOfDay = `${date}T23:59:59`;

    try {
      const { data, error } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', startOfDay)
        .lte('logged_at', endOfDay)
        .order('logged_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading food logs by date:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      loadFoodLogs();
    } else {
      setLoading(false);
    }
  }, [user, targetDate]);

  const loadFoodLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', user!.id)
        .gte('logged_at', `${targetDate}T00:00:00`)
        .lte('logged_at', `${targetDate}T23:59:59`)
        .order('logged_at', { ascending: false });

      if (error) throw error;
      setFoodLogs(data || []);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading food logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const createFoodLog = async (foodLog: Omit<FoodLog, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) throw new Error('No user logged in');

    const { data, error } = await supabase
      .from('food_logs')
      .insert({
        user_id: user.id,
        ...foodLog,
      })
      .select()
      .single();

    if (error) throw error;
    
    // Refresh the list
    await loadFoodLogs();
    return data;
  };

  const deleteFoodLog = async (id: string) => {
    const { error } = await supabase
      .from('food_logs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    // Refresh the list
    await loadFoodLogs();
  };

  const getDailyTotals = (): DailyTotals => {
    return foodLogs.reduce(
      (totals, log) => ({
        calories: totals.calories + log.calories,
        protein: totals.protein + log.protein,
        carbs: totals.carbs + log.carbs,
        fats: totals.fats + log.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  return {
    foodLogs,
    loading,
    error,
    createFoodLog,
    deleteFoodLog,
    refreshLogs: loadFoodLogs,
    dailyTotals: getDailyTotals(),
    getFoodLogsByDateRange,
    getFoodLogsByDate,
  };
};
