import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface WeightLog {
  id: string;
  user_id: string;
  weight_kg: number;
  logged_at: string;
  created_at: string;
}

export interface WeightTrend {
  current: number | null;
  previous: number | null;
  change: number;
  percentChange: number;
}

export const useWeightLogs = (days: number = 30) => {
  const { user } = useAuth();
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      loadWeightLogs();
    } else {
      setLoading(false);
    }
  }, [user, days]);

  const loadWeightLogs = async () => {
    try {
      setLoading(true);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('weight_logs')
        .select('*')
        .eq('user_id', user!.id)
        .gte('logged_at', startDate.toISOString())
        .order('logged_at', { ascending: true });

      if (error) throw error;
      setWeightLogs(data || []);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading weight logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAllWeightLogs = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('weight_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading all weight logs:', error);
      throw error;
    }
  };

  const getWeightLogsByDateRange = async (startDate: string, endDate: string) => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('weight_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', startDate)
        .lte('logged_at', endDate)
        .order('logged_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading weight logs by date range:', error);
      throw error;
    }
  };

  const createWeightLog = async (weight_kg: number, logged_at?: string) => {
    if (!user) throw new Error('No user logged in');

    const logDate = logged_at || new Date().toISOString();

    // Use upsert to update if entry exists for this date, or insert if new
    const { data, error } = await supabase
      .from('weight_logs')
      .upsert({
        user_id: user.id,
        weight_kg,
        logged_at: logDate,
      }, {
        onConflict: 'user_id,logged_at',
      })
      .select()
      .single();

    if (error) throw error;
    
    await loadWeightLogs();
    return data;
  };

  const deleteWeightLog = async (id: string) => {
    const { error } = await supabase
      .from('weight_logs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    await loadWeightLogs();
  };

  const deleteAllWeightLogs = async () => {
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('weight_logs')
      .delete()
      .eq('user_id', user.id);

    if (error) throw error;
    
    await loadWeightLogs();
  };

  const getWeightTrend = (): WeightTrend => {
    if (weightLogs.length === 0) {
      return {
        current: null,
        previous: null,
        change: 0,
        percentChange: 0,
      };
    }

    const current = weightLogs[weightLogs.length - 1].weight_kg;
    const previous = weightLogs.length > 1 ? weightLogs[0].weight_kg : current;
    const change = current - previous;
    const percentChange = previous !== 0 ? (change / previous) * 100 : 0;

    return {
      current,
      previous,
      change,
      percentChange,
    };
  };

  const getLatestWeight = (): number | null => {
    if (weightLogs.length === 0) return null;
    return weightLogs[weightLogs.length - 1].weight_kg;
  };

  return {
    weightLogs,
    loading,
    error,
    createWeightLog,
    deleteWeightLog,
    deleteAllWeightLogs,
    refreshLogs: loadWeightLogs,
    weightTrend: getWeightTrend(),
    latestWeight: getLatestWeight(),
    getAllWeightLogs,
    getWeightLogsByDateRange,
  };
};
