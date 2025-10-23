"use client";

import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Sidebar from './components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

function App() {
  const { user, isLoading } = useAuth();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* O redirecionamento para login será feito pelo componente de login */}
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 lg:ml-64">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Dashboard
              </h1>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <p className="text-gray-600 dark:text-gray-300">
                  Bem-vindo ao seu dashboard! Aqui você pode acompanhar seu progresso e acessar todas as ferramentas de aprendizado.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;