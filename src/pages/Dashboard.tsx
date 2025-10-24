"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut,
  Sun,
  Moon,
  Menu,
  Bell,
  User,
  Trophy,
  Star,
  Calendar,
  FileText
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/contexts/UserDataContext';
import { showSuccess, showError } from '@/utils/toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px:6 lg:px-8">
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img 
                  src="https://ugdpjgftmhyurrmfzdux.supabase.co/storage/v1/object/public/imagens/logo%2001" 
                  alt="Logo" 
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.outerHTML = `
                      <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span class="text-white text-sm font-bold">A</span>
                      </div>
                    `;
                  }}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.user_metadata?.name || 'João da Silva'}
                  </p>
                  <div className="flex items-center space-x-1">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs text-gray-500">{userProfile?.patente || 'Iniciante'}</span>
                  </div>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
              <p className="text-gray-600">Bem-vindo de volta! Continue praticando redação para melhorar seu desempenho.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white border border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Redações Corrigidas</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userProfile?.redacoes_corrigidas || 0}</div>
                  <p className="text-xs text-muted-foreground">+2 esta semana</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">XP Total</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userProfile?.xp_total || 0}</div>
                  <p className="text-xs text-muted-foreground">+50 esta semana</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Nível</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userProfile?.nivel || 1}</div>
                  <p className="text-xs text-muted-foreground">Próximo nível em 150 XP</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Dias de Estudo</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userProfile?.dias_estudo || 0}</div>
                  <p className="text-xs text-muted-foreground">+2 esta semana</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle>Progresso da Semana</CardTitle>
                    <CardDescription>
                      Seu desempenho nas últimas 7 dias
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Gráfico de progresso</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="bg-white border border-gray-200">
                  <CardHeader>
                    <CardTitle>Redações Recentes</CardTitle>
                    <CardDescription>
                      Últimas redações corrigidas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <FileText className="h-5 w-5 text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Tema: O papel da tecnologia na educação</p>
                          <p className="text-xs text-gray-500">Corrigida em 15/06/2023</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <FileText className="h-5 w-5 text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Tema: A importância da ética na política</p>
                          <p className="text-xs text-gray-500">Corrigida em 10/06/2023</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <FileText className="h-5 w-5 text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Tema: Como combater o preconceito na sociedade</p>
                          <p className="text-xs text-gray-500">Corrigida em 05/06/2023</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;