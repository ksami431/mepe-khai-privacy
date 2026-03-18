import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { Database } from '@/types/database.types';

type FavoriteFood = Database['public']['Tables']['favorite_foods']['Row'];
type FavoriteFoodInsert = Database['public']['Tables']['favorite_foods']['Insert'];

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteFood[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorite_foods')
        .select('*')
        .eq('user_id', user.id)
        .order('last_used_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createFavorite = async (foodData: Omit<FavoriteFoodInsert, 'user_id'>) => {
    if (!user) throw new Error('No user logged in');

    const { data, error } = await supabase
      .from('favorite_foods')
      .insert({
        user_id: user.id,
        ...foodData,
      })
      .select()
      .single();

    if (error) throw error;
    await loadFavorites();
    return data;
  };

  const deleteFavorite = async (id: string) => {
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('favorite_foods')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    await loadFavorites();
  };

  const updateLastUsed = async (id: string) => {
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('favorite_foods')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    await loadFavorites();
  };

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  return {
    favorites,
    loading,
    loadFavorites,
    createFavorite,
    deleteFavorite,
    updateLastUsed,
  };
};
