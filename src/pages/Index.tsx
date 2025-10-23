"use client";

import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';

function Index() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Bem-vindo ao AprimorAi
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Comece sua jornada de aprendizado hoje mesmo!
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Index;