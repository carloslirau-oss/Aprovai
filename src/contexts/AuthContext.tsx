import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser, onAuthStateChange } from '@/integrations/supabase/auth';

interface AuthContextType {
  user: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Chave para localStorage
  const AUTH_STORAGE_KEY = 'aprimorai_auth_data';

  // Função para salvar dados de autenticação
  const saveAuthData = (authData: any) => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        user: authData,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  };

  // Função para carregar dados de autenticação
  const loadAuthData = () => {
    try {
      const storedData = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedData) {
        const data = JSON.parse(storedData);
        // Verificar se os dados não estão muito antigos (24 horas)
        const lastUpdated = new Date(data.timestamp);
        const now = new Date();
        const hoursDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          setUser(data.user);
          setLoading(false);
          return true;
        } else {
          // Dados muito antigos, remover
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    }
    return false;
  };

  // Função para limpar dados de autenticação
  const clearAuthData = () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  useEffect(() => {
    // Tentar carregar dados salvos primeiro
    const hasStoredAuth = loadAuthData();
    if (!hasStoredAuth) {
      // Se não tiver dados salvos, verificar usuário atual
      const getUser = async () => {
        const { user, error } = await getCurrentUser();
        if (error) {
          console.error('Error getting user:', error);
        }
        setUser(user);
        setLoading(false);
      };

      getUser();
    }

    // Escutar mudanças de estado de autenticação
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        const userData = session?.user || null;
        setUser(userData);
        saveAuthData(userData);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        clearAuthData();
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (result.data.user) {
      saveAuthData(result.data.user);
    }
    return result;
  };

  const signUp = async (email: string, password: string, name: string) => {
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
        emailRedirectTo: undefined,
      },
    });
    if (result.data.user) {
      saveAuthData(result.data.user);
    }
    return result;
  };

  const signOut = async () => {
    const result = await supabase.auth.signOut();
    clearAuthData();
    return result;
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};