import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface ActivityLog {
  id: string;
  user_id: string;
  logged_date: string;
  step_count: number;
  exercise_type: string | null;
  duration_minutes: number | null;
  calories_burned: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DailyActivityTotals {
  total_steps: number;
  total_calories_burned: number;
  total_exercise_minutes: number;
  activities: ActivityLog[];
}

export const useActivityLogs = (date?: string) => {
  const { user } = useAuth();
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const targetDate = date || new Date().toISOString().split('T')[0];

  const getActivityLogsByDateRange = async (startDate: string, endDate: string) => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_date', startDate)
        .lte('logged_date', endDate)
        .order('logged_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading activity logs by date range:', error);
      throw error;
    }
  };

  const getActivityLogsByDate = async (date: string) => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('logged_date', date)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading activity logs by date:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      loadActivityLogs();
    } else {
      setLoading(false);
    }
  }, [user, targetDate]);

  const loadActivityLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', user!.id)
        .eq('logged_date', targetDate)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivityLogs(data || []);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const createActivityLog = async (activityLog: Omit<ActivityLog, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('No user logged in');

    const { data, error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: user.id,
        ...activityLog,
      })
      .select()
      .single();

    if (error) throw error;
    
    await loadActivityLogs();
    return data;
  };

  const updateActivityLog = async (id: string, updates: Partial<Omit<ActivityLog, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    const { data, error } = await supabase
      .from('activity_logs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    await loadActivityLogs();
    return data;
  };

  const deleteActivityLog = async (id: string) => {
    const { error } = await supabase
      .from('activity_logs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    await loadActivityLogs();
  };

  const getDailyTotals = (): DailyActivityTotals => {
    const totals = activityLogs.reduce(
      (acc, log) => ({
        total_steps: acc.total_steps + log.step_count,
        total_calories_burned: acc.total_calories_burned + log.calories_burned,
        total_exercise_minutes: acc.total_exercise_minutes + (log.duration_minutes || 0),
      }),
      { total_steps: 0, total_calories_burned: 0, total_exercise_minutes: 0 }
    );

    return {
      ...totals,
      activities: activityLogs,
    };
  };

  return {
    activityLogs,
    loading,
    error,
    createActivityLog,
    updateActivityLog,
    deleteActivityLog,
    refreshLogs: loadActivityLogs,
    dailyTotals: getDailyTotals(),
    getActivityLogsByDateRange,
    getActivityLogsByDate,
  };
};
