import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface PlannedMeal {
  id: string;
  user_id: string;
  planned_date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  meal_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  weight_grams?: number;
  created_at: string;
}

export const usePlannedMeals = (startDate?: string, endDate?: string) => {
  const { user } = useAuth();
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPlannedMeals();
    }
  }, [user, startDate, endDate]);

  const loadPlannedMeals = async () => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from('planned_meals')
        .select('*')
        .eq('user_id', user.id);

      if (startDate) {
        query = query.gte('planned_date', startDate);
      }
      if (endDate) {
        query = query.lte('planned_date', endDate);
      }

      query = query.order('planned_date', { ascending: true });

      const { data, error } = await query;

      if (error) throw error;
      setPlannedMeals(data || []);
    } catch (error) {
      console.error('Error loading planned meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPlannedMeal = async (meal: Omit<PlannedMeal, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) throw new Error('No user logged in');

    const { data, error } = await supabase
      .from('planned_meals')
      .insert({
        user_id: user.id,
        ...meal,
      })
      .select()
      .single();

    if (error) throw error;
    await loadPlannedMeals();
    return data;
  };

  const updatePlannedMeal = async (id: string, updates: Partial<PlannedMeal>) => {
    const { error } = await supabase
      .from('planned_meals')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    await loadPlannedMeals();
  };

  const deletePlannedMeal = async (id: string) => {
    const { error } = await supabase
      .from('planned_meals')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await loadPlannedMeals();
  };

  const getMealsForDate = (date: string) => {
    return plannedMeals.filter(meal => meal.planned_date === date);
  };

  const getTotalNutritionForDate = (date: string) => {
    const mealsForDate = getMealsForDate(date);
    return mealsForDate.reduce(
      (totals, meal) => ({
        calories: totals.calories + meal.calories,
        protein: totals.protein + meal.protein,
        carbs: totals.carbs + meal.carbs,
        fats: totals.fats + meal.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  return {
    plannedMeals,
    loading,
    loadPlannedMeals,
    createPlannedMeal,
    updatePlannedMeal,
    deletePlannedMeal,
    getMealsForDate,
    getTotalNutritionForDate,
  };
};
