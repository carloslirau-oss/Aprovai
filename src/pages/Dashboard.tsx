"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, MessageSquare, ChevronDown, ChevronRight, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/contexts/UserDataContext';
import { showSuccess, showError } from '@/utils/toast';

const Dashboard = () => {
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-card px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-500"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <User2 className="h-4 w-4" />
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Redações Corrigidas</h3>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 esta semana</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">XP Total</h3>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">450</div>
                <p className="text-xs text-muted-foreground">+50 esta semana</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Nível</h3>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Próximo nível em 150 XP</p>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Dias de Estudo</h3>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 esta semana</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-1 lg:col-span-2 bg-card border border-border rounded-lg p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">Progresso da Semana</h2>
                  <p className="text-sm text-muted-foreground">Seu desempenho nas últimas 7 dias</p>
                </div>
                <div className="h-[300px] flex items-center justify-center bg-muted rounded-lg">
                  <p className="text-muted-foreground">Gráfico de progresso</p>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">Redações Recentes</h2>
                  <p className="text-sm text-muted-foreground">Últimas redações corrigidas</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center p-3 hover:bg-muted rounded-lg transition-colors">
                    <FileText className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="font-medium">Tema: O papel da tecnologia na educação</p>
                      <p className="text-xs text-muted-foreground">Corrigida em 15/06/2023</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 hover:bg-muted rounded-lg transition-colors">
                    <FileText className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="font-medium">Tema: A importância da ética na política</p>
                      <p className="text-xs text-muted-foreground">Corrigida em 10/06/2023</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 hover:bg-muted rounded-lg transition-colors">
                    <FileText className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <p className="font-medium">Tema: Como combater o preconceito na sociedade</p>
                      <p className="text-xs text-muted-foreground">Corrigida em 05/06/2023</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;