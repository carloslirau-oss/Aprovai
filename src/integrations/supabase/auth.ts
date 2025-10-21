import { createClient } from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ugdpjgftmhyurrmfzdux.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnZHBqZ2Z0bWh5dXJybWZ6ZHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5Mjk5ODEsImV4cCI6MjA3NjUwNTk4MX0.zDJLGIVWDwHCOk36Zy8YSpgX7WZGGxyi_Gc2iJ_tYc8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Funções de autenticação
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
      // Não exige verificação de e-mail
      emailRedirectTo: undefined,
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};

// Função para atualizar perfil do usuário
export const updateUserProfile = async (name: string) => {
  const { error } = await supabase.auth.updateUser({
    data: {
      name,
    },
  });
  return { error };
};

// Função para enviar e-mail de verificação
export const sendVerificationEmail = async () => {
  const { error } = await supabase.auth.reauthenticate({
    emailRedirectTo: undefined,
  });
  return { error };
};