import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { WaterLog, WaterTarget } from '@/types/water.types';

export const useWaterLogs = (date?: string) => {
  const { user, profile } = useAuth();
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const targetDate = date || new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (user) {
      loadWaterLogs();
    } else {
      setLoading(false);
    }
  }, [user, targetDate]);

  const loadWaterLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('water_logs')
        .select('*')
        .eq('user_id', user!.id)
        .gte('logged_at', `${targetDate}T00:00:00`)
        .lte('logged_at', `${targetDate}T23:59:59`)
        .order('logged_at', { ascending: false });

      if (error) throw error;
      setWaterLogs(data || []);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading water logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const createWaterLog = async (amount_ml: number) => {
    if (!user) throw new Error('No user logged in');

    const { data, error } = await supabase
      .from('water_logs')
      .insert({
        user_id: user.id,
        amount_ml,
        logged_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    await loadWaterLogs();
    return data;
  };

  const deleteWaterLog = async (id: string) => {
    const { error } = await supabase
      .from('water_logs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await loadWaterLogs();
  };

  const getDailyTotal = (): number => {
    return waterLogs.reduce((total, log) => total + log.amount_ml, 0);
  };

  const getWaterTarget = (): WaterTarget => {
    const goal = profile?.daily_water_goal_ml || 2000;
    const consumed = getDailyTotal();
    const glassSize = 250; // 250ml per glass
    
    return {
      daily_goal_ml: goal,
      consumed_ml: consumed,
      remaining_ml: Math.max(0, goal - consumed),
      progress_percentage: Math.min(100, (consumed / goal) * 100),
      glasses_consumed: Math.floor(consumed / glassSize),
      glasses_remaining: Math.ceil(Math.max(0, goal - consumed) / glassSize),
    };
  };

  return {
    waterLogs,
    loading,
    error,
    createWaterLog,
    deleteWaterLog,
    refreshLogs: loadWaterLogs,
    dailyTotal: getDailyTotal(),
    waterTarget: getWaterTarget(),
  };
};
