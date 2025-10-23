import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserDataContextType {
  userProfile: any;
  redacoes: any[];
  isLoading: boolean;
  updateUserProfile: (data: any) => Promise<void>;
  addRedacao: (redacao: any) => Promise<void>;
  updateUserStats: (stats: any) => Promise<void>;
  saveUserDataToStorage: (data: any) => void;
  loadUserDataFromStorage: () => void;
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

  // Chave para localStorage
  const STORAGE_KEY = 'aprimorai_user_data';

  // Função para salvar dados no localStorage
  const saveUserDataToStorage = (data: any) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving user data to localStorage:', error);
    }
  };

  // Função para carregar dados do localStorage
  const loadUserDataFromStorage = () => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const data = JSON.parse(storedData);
        setUserProfile(data.userProfile);
        setRedacoes(data.redacoes);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Error loading user data from localStorage:', error);
    }
    return false;
  };

  // Função para limpar dados do localStorage (logout)
  const clearUserDataFromStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing user data from localStorage:', error);
    }
  };

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const hasStoredData = loadUserDataFromStorage();
    if (!hasStoredData) {
      setIsLoading(false);
    }
  }, []);

  // Salvar dados sempre que mudarem
  useEffect(() => {
    if (userProfile || redacoes.length > 0) {
      const dataToSave = {
        userProfile,
        redacoes,
        lastUpdated: new Date().toISOString()
      };
      saveUserDataToStorage(dataToSave);
    }
  }, [userProfile, redacoes]);

  // Função para buscar dados do Supabase
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

  // Função para sincronizar dados do localStorage com o Supabase
  const syncDataWithSupabase = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Sincronizar perfil
      if (userProfile) {
        await updateUserProfile(userProfile);
      }

      // Sincronizar redações
      if (redacoes.length > 0) {
        for (const redacao of redacoes) {
          if (!redacao.id) { // Se a redação não tem ID, significa que ainda não foi salva no Supabase
            await addRedacao(redacao);
          }
        }
      }
    } catch (error) {
      console.error('Error syncing data with Supabase:', error);
    }
  };

  const value = {
    userProfile,
    redacoes,
    isLoading,
    updateUserProfile,
    addRedacao,
    updateUserStats,
    saveUserDataToStorage,
    loadUserDataFromStorage,
    syncDataWithSupabase,
    clearUserDataFromStorage,
  };

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};