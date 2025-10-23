"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Target, Trophy, ArrowRight, ArrowLeft, ArrowUpRight, ArrowDownLeft, User, Calendar, Star, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/contexts/UserDataContext';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';

interface DashboardProps {
  user: any;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const { user: authUser, signOut } = useAuth();
  const { userData, loading, error } = useUserData();
  const [progress, setProgress] = useState(0);
  const [patenteAtual, setPatenteAtual] = useState<any>(null);
  const [patentes, setPatentes] = useState<any[]>([]);
  const [patenteProxima, setPatenteProxima] = useState<any>(null);
  const [redacoesConcluidas, setRedacoesConcluidas] = useState(0);
  const [redacoesCorrigidas, setRedacoesCorrigidas] = useState(0);
  const [xpTotal, setXpTotal] = useState(0);
  const [diasEstudo, setDiasEstudo] = useState(0);
  const [notaMedia, setNotaMedia] = useState(0);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingData(true);
      try {
        if (authUser) {
          // Buscar dados do usuário
          const { data: userData, error: userError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();
          
          if (userError) throw userError;
          
          setUserData(userData);
        }
      } catch (error) {
        showError('Erro ao carregar dados do usuário');
      } finally {
        setLoadingData(false);
      }
    };

    fetchUserData();
  }, [authUser]);

  useEffect(() => {
    if (userData) {
      // Calcular progresso
      const progress = Math.min(
        100, 
        (redacoesCorrigidas / Math.max(1, redacoesConcluidas)) * 100
      );
      setProgress(progress);
    }
  }, [redacoesConcluidas, redacoesCorrigidas]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      showError('Erro ao fazer logout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Bem-vindo, {userData?.name || 'Carregando...'}</span>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-600"
            >
              Sair
            </Button>
          </div>
        </header>

        {loadingData ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Erro ao carregar dados: {error.message}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Perfil */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{userData?.name}</h2>
                  <p className="text-gray-600">{userData?.email}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span className="text-gray-600">Patente</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {patenteAtual?.title || 'Carregando...'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-600">Redações</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {redacoesConcluidas} concluídas / {redacoesCorrigidas} corrigidas
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-green-500" />
                    <span className="text-gray-600">XP Total</span>
                  </div>
                  <span className="font-medium text-gray-900">{xpTotal} XP</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    <span className="text-gray-600">Dias de Estudo</span>
                  </div>
                  <span className="font-medium text-gray-900">{diasEstudo} dias</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-orange-500" />
                    <span className="text-gray-600">Média de Notas</span>
                  </div>
                  <span className="font-medium text-gray-900">{notaMedia.toFixed(1)} / 1000</span>
                </div>
              </div>
            </div>

            {/* Progresso */}
            <div className="bg-white rounded-xl shadow-sm p-6 col-span-1 md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Progresso da Patente</h3>
                <span className="text-sm text-gray-600">
                  {redacoesCorrigidas} de {patenteAtual?.redacoes_para_proxima || 0} redações
                </span>
              </div>
              <Progress value={progress} className="h-2 mb-4" />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Redações Concluídas</span>
                    <span className="font-medium text-gray-900">{redacoesConcluidas}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Redações Corrigidas</span>
                    <span className="font-medium text-gray-900">{redacoesCorrigidas}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">XP Total</span>
                    <span className="font-medium text-gray-900">{xpTotal} XP</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">XP Restante</span>
                    <span className="font-medium text-gray-900">
                      {patenteAtual?.xp_para_proxima - xpTotal} XP
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Próxima Patente */}
            {patenteAtual.level < 5 && patenteProxima && (
              <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-300">
                <h4 className="text-lg font-semibold text-yellow-900 mb-2 flex items-center">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Próxima Patente: {patenteProxima.title}
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Redações para Próxima Patente</span>
                    <span className="font-medium text-gray-900">
                      {patenteProxima.redacoes_para_proxima}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">XP para Próxima Patente</span>
                    <span className="font-medium text-gray-900">
                      {patenteProxima.xp_para_proxima} XP
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Estatísticas */}
            <div className="bg-white rounded-xl shadow-sm p-6 col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Redações Concluídas</span>
                    <span className="font-medium text-gray-900">{redacoesConcluidas}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Redações Corrigidas</span>
                    <span className="font-medium text-gray-900">{redacoesCorrigidas}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">XP Total</span>
                    <span className="font-medium text-gray-900">{xpTotal} XP</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Média de Notas</span>
                    <span className="font-medium text-gray-900">{notaMedia.toFixed(1)} / 1000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="bg-white rounded-xl shadow-sm p-6 col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Nova Redação
                </Button>
                <Button 
                  variant="outline" 
                  className="text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Trophy className="h-5 w-5 mr-2" />
                  Ver Patentes
                </Button>
                <Button 
                  variant="outline" 
                  className="text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Target className="h-5 w-5 mr-2" />
                  Metas
                </Button>
                <Button 
                  variant="outline" 
                  className="text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Configurações
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;