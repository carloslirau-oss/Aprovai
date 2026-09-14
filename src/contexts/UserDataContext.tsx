import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserDataContextType {
  userProfile: any;
  redacoes: any[];
  isLoading: boolean;
  updateUserProfile: (data: any) => Promise<void>;
  addRedacao: (redacao: any) => Promise<void>;
  updateUserStats: (stats: any) => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  fetchRedacoes: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

// Todos os dados do usuário (perfil, estatísticas, redações) vivem no Supabase.
// Este contexto busca e mantém sincronizado com as tabelas `user_profiles`
// e `redacoes`, escopadas por RLS ao próprio usuário autenticado.
export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [redacoes, setRedacoes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const createUserProfile = useCallback(async (authUser: any) => {
    const { error } = await supabase.from('user_profiles').insert({
      id: authUser.id,
      name: authUser.user_metadata?.name || authUser.email,
    });
    // Ignora erro de chave duplicada: o trigger handle_new_user já pode ter criado o perfil
    if (error && error.code !== '23505') {
      console.error('Error creating user profile:', error);
    }

    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    setUserProfile(data);
  }, []);

  const fetchUserProfile = useCallback(async () => {
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
      await createUserProfile(user);
    }
  }, [user, createUserProfile]);

  const fetchRedacoes = useCallback(async () => {
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
  }, [user]);

  // Sempre que o usuário logado mudar (login/logout), sincroniza os dados com o Supabase
  useEffect(() => {
    let isActive = true;

    const load = async () => {
      if (!user) {
        setUserProfile(null);
        setRedacoes([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      await Promise.all([fetchUserProfile(), fetchRedacoes()]);
      if (isActive) setIsLoading(false);
    };

    load();

    return () => {
      isActive = false;
    };
  }, [user, fetchUserProfile, fetchRedacoes]);

  const updateUserProfile = async (data: any) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_profiles')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating user profile:', error);
      return;
    }

    setUserProfile((prev: any) => ({ ...prev, ...data, updated_at: new Date().toISOString() }));
  };

  const updateUserStats = async (stats: any) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_profiles')
      .update({ ...stats, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating user stats:', error);
      return;
    }

    setUserProfile((prev: any) => ({ ...prev, ...stats, updated_at: new Date().toISOString() }));
  };

  const addRedacao = async (redacao: any) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('redacoes')
      .insert({ ...redacao, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error('Error adding redacao:', error);
      return;
    }

    await updateUserStats({
      redacoes_corrigidas: (userProfile?.redacoes_corrigidas || 0) + 1,
      xp_total: (userProfile?.xp_total || 0) + (redacao.nota_total || 0),
    });

    setRedacoes((prev) => [data, ...prev]);
  };

  const value = {
    userProfile,
    redacoes,
    isLoading,
    updateUserProfile,
    addRedacao,
    updateUserStats,
    fetchUserProfile,
    fetchRedacoes,
  };

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};
