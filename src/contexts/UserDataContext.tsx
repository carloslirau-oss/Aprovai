import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserDataContextType {
  userProfile: any;
  redacoes: any[];
  isLoading: boolean;
  updateUserProfile: (data: any) => Promise<void>;
  addRedacao: (redacao: any) => Promise<void>;
  updateUserStats: (stats: any) => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [redacoes, setRedacoes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
    fetchRedacoes();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        setUserProfile(data);
      } else {
        // Se não existir perfil, criar um
        await createUserProfile(user);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createUserProfile = async (user: any) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          name: user.user_metadata?.name || user.email,
        });

      if (error) {
        console.error('Error creating user profile:', error);
        return;
      }

      // Buscar o perfil recém-criado
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setUserProfile(data);
    } catch (error) {
      console.error('Error in createUserProfile:', error);
    }
  };

  const fetchRedacoes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('redacoes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching redacoes:', error);
        return;
      }

      setRedacoes(data || []);
    } catch (error) {
      console.error('Error in fetchRedacoes:', error);
    }
  };

  const updateUserProfile = async (data: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating user profile:', error);
        return;
      }

      // Atualizar o estado local
      setUserProfile(prev => ({
        ...prev,
        ...data,
        updated_at: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
    }
  };

  const addRedacao = async (redacao: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('redacoes')
        .insert({
          ...redacao,
          user_id: user.id,
        });

      if (error) {
        console.error('Error adding redacao:', error);
        return;
      }

      // Atualizar estatísticas do usuário
      await updateUserStats({
        redacoes_corrigidas: userProfile.redacoes_corrigidas + 1,
        xp_total: userProfile.xp_total + (redacao.nota_total || 0),
      });

      // Atualizar lista de redações
      await fetchRedacoes();
    } catch (error) {
      console.error('Error in addRedacao:', error);
    }
  };

  const updateUserStats = async (stats: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...stats,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating user stats:', error);
        return;
      }

      // Atualizar o estado local
      setUserProfile(prev => ({
        ...prev,
        ...stats,
        updated_at: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error in updateUserStats:', error);
    }
  };

  const value = {
    userProfile,
    redacoes,
    isLoading,
    updateUserProfile,
    addRedacao,
    updateUserStats,
  };

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};