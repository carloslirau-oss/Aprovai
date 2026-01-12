"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Award,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  BookOpen,
  Star,
  Target as TargetIcon,
  Zap,
  Crown,
  Trophy,
  ArrowRight,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  RefreshCw,
  User,
  Medal,
  Shield,
  Star as StarIcon,
  Flag,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/contexts/UserDataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { showSuccess, showError } from '@/utils/toast';
import Sidebar from '@/components/Sidebar';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { userProfile, redacoes, isLoading, updateUserStats, fetchUserProfile, fetchRedacoes } = useUserData();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Função para atualizar os dados manualmente
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await fetchUserProfile();
      await fetchRedacoes();
      showSuccess('Dados atualizados com sucesso!');
    } catch (error) {
      showError('Erro ao atualizar dados. Tente novamente.');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Calcular estatísticas se não estiverem disponíveis
    if (userProfile && redacoes.length > 0) {
      const totalRedacoes = redacoes.length;
      const totalXP = redacoes.reduce((sum, redacao) => sum + (redacao.nota_total || 0), 0);
      const notaMedia = redacoes.reduce((sum, redacao) => sum + (redacao.nota_total || 0), 0) / totalRedacoes;
      
      // Atualizar estatísticas se forem diferentes das salvas
      if (userProfile.redacoes_corrigidas !== totalRedacoes || 
          userProfile.xp_total !== totalXP || 
          userProfile.nota_media !== notaMedia) {
        updateUserStats({
          redacoes_corrigidas: totalRedacoes,
          xp_total: totalXP,
          nota_media: parseFloat(notaMedia.toFixed(2)),
        });
      }
    }
  }, [userProfile, redacoes, updateUserStats]);

  const handleLogout = async () => {
    try {
      await signOut();
      showSuccess('Logout realizado com sucesso!');
      navigate('/login');
    } catch (error) {
      showError('Erro ao realizar logout. Tente novamente.');
    }
  };

  // Sistema de patentes com 7 níveis
  const patentes = [
    {
      level: 1,
      title: 'Recruta',
      emoji: '🎯',
      xpRequired: 0,
      xpNext: 1000,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: User,
      description: 'Começando sua jornada',
      professorTip: 'Bem-vindo à academia! Cada redação é um passo adiante.'
    },
    {
      level: 2,
      title: 'Soldado',
      emoji: '⚔️',
      xpRequired: 1000,
      xpNext: 2500,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: Shield,
      description: 'Dominando as técnicas',
      professorTip: 'Sua escrita está ficando mais forte! Continue treinando.'
    },
    {
      level: 3,
      title: 'Cabo',
      emoji: '🏅',
      xpRequired: 2500,
      xpNext: 5000,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: Medal,
      description: 'Adquirindo experiência',
      professorTip: 'Você está se destacando! Suas ideias estão mais claras.'
    },
    {
      level: 4,
      title: 'Sargento',
      emoji: '🎖️',
      xpRequired: 5000,
      xpNext: 10000,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      icon: StarIcon,
      description: 'Liderando o pelotão',
      professorTip: 'Agora você é referência! Continue inspirando outros.'
    },
    {
      level: 5,
      title: 'Tenente',
      emoji: '👑',
      xpRequired: 10000,
      xpNext: 20000,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      icon: Crown,
      description: 'Comandando com excelência',
      professorTip: 'Sua liderança é inspiradora! Você está quase no topo.'
    },
    {
      level: 6,
      title: 'Capitão',
      emoji: '🏆',
      xpRequired: 20000,
      xpNext: 50000,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: Trophy,
      description: 'Mestre da arte',
      professorTip: 'Você é um mestre! Suas redações são obras de arte.'
    },
    {
      level: 7,
      title: 'General',
      emoji: '⭐',
      xpRequired: 50000,
      xpNext: null,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      icon: Flag,
      description: 'Lenda da escrita',
      professorTip: 'Você alcançou o topo! Agora você é uma lenda da redação.'
    }
  ];

  // Determinar patente atual do usuário
  const determinarPatenteAtual = (xp: number) => {
    for (let i = patentes.length - 1; i >= 0; i--) {
      if (xp >= patentes[i].xpRequired) {
        return patentes[i];
      }
    }
    return patentes[0]; // Padrão: Recruta
  };

  // Determinar patente atual e próxima
  const patenteAtual = determinarPatenteAtual(userProfile?.xp_total || 0);
  const patenteProxima = patentes[patenteAtual.level] || null;

  // Calcular progresso para a próxima patente
  const progressoProximaPatente = patenteProxima ? 
    Math.min(100, ((userProfile?.xp_total || 0 - patenteAtual.xpRequired) / (patenteProxima.xpRequired - patenteAtual.xpRequired)) * 100) : 100;

  const stats = [
    {
      title: 'Redações Corrigidas',
      value: userProfile?.redacoes_corrigidas || '0',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Nota Média',
      value: userProfile?.nota_media || '0.0',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'XP Total',
      value: userProfile?.xp_total?.toLocaleString() || '0',
      icon: TargetIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Dias de Estudo',
      value: userProfile?.dias_estudo || '0',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  // Dados para gráficos (agora com base em XP máximo de 250)
  const notasData = redacoes.map((redacao, index) => ({
    name: `Redação ${index + 1}`,
    nota: redacao.nota_total || 0,
    data: redacao.created_at ? new Date(redacao.created_at).toLocaleDateString() : 'Data não disponível'
  }));

  const competenciasData = redacoes.length > 0 ? [
    {
      name: 'Domínio da Modalidade',
      media: redacoes.reduce((sum, r) => sum + (r.competencia_1 || 0), 0) / redacoes.length,
      max: 50 // Agora cada competência vale no máximo 50 pontos
    },
    {
      name: 'Compreensão da Tarefa',
      media: redacoes.reduce((sum, r) => sum + (r.competencia_2 || 0), 0) / redacoes.length,
      max: 50
    },
    {
      name: 'Coerência e Coesão',
      media: redacoes.reduce((sum, r) => sum + (r.competencia_3 || 0), 0) / redacoes.length,
      max: 50
    },
    {
      name: 'Recursos de Linguagem',
      media: redacoes.reduce((sum, r) => sum + (r.competencia_4 || 0), 0) / redacoes.length,
      max: 50
    },
    {
      name: 'Proposta de Intervenção',
      media: redacoes.reduce((sum, r) => sum + (r.competencia_5 || 0), 0) / redacoes.length,
      max: 50
    }
  ] : [];

  const evolucaoXP = redacoes.map((redacao, index) => ({
    redacao: index + 1,
    xp: redacao.nota_total || 0,
    acumulado: redacoes.slice(0, index + 1).reduce((sum, r) => sum + (r.nota_total || 0), 0)
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        isDesktop={true}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header - Otimizado para mobile */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Avatar do usuário - melhorado para mobile */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs sm:text-sm font-medium">
                    {user?.user_metadata?.name?.split(' ').map(n => n[0]).join('') || 'JD'}
                  </span>
                </div>
                
                {/* Informações do usuário - melhorado para mobile */}
                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                    {user?.user_metadata?.name || 'João da Silva'}
                  </p>
                  <div className="flex items-center space-x-1">
                    <Award className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                    <span className="text-xs text-gray-500 truncate">{patenteAtual.title}</span>
                  </div>
                </div>
              </div>
              
              {/* Barra de progresso de patente - escondida em mobile */}
              {patenteAtual.level < 7 && patenteProxima && (
                <div className="hidden sm:block flex-1 max-w-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Progresso:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressoProximaPatente}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-blue-600">
                      {Math.round(progressoProximaPatente)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {userProfile?.xp_total?.toLocaleString() || '0'} / {patenteProxima.xpRequired.toLocaleString()} XP
                  </div>
                </div>
              )}
              
              {/* Botões de tema e logout - melhorados para mobile */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button variant="ghost" size="sm" onClick={toggleTheme} className="p-1 sm:p-2">
                  {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Button>
                
                <Button variant="ghost" size="sm" onClick={handleLogout} className="p-1 sm:p-2">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            {/* Welcome Section - Otimizado para mobile */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Bem-vindo de volta, {user?.user_metadata?.name?.split(' ')[0] || 'João'}!
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Continue seu treinamento e alcance o topo da jornada das patentes
                  </p>
                </div>
                <Button
                  onClick={handleRefreshData}
                  disabled={isRefreshing}
                  variant="outline"
                  className="flex items-center space-x-2 w-full sm:w-auto"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isRefreshing ? 'Atualizando...' : 'Atualizar Dados'}</span>
                </Button>
              </div>
            </div>

            {/* Stats Grid - Otimizado para mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-lg sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-4 w-4 sm:h-6 sm:w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Gráficos de Desempenho - Otimizado para mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Gráfico de Evolução de Notas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <LineChart className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                    Evolução das Notas (XP)
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Sua progressão ao longo das redações (máx. 250 XP por redação)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4 overflow-x-auto">
                    {notasData.length > 0 ? (
                      <div className="min-w-max space-y-2">
                        {notasData.map((nota, index) => (
                          <div key={index} className="flex items-center justify-between min-w-max">
                            <span className="text-xs text-gray-600 whitespace-nowrap">{nota.name}</span>
                            <div className="flex items-center space-x-2 min-w-max">
                              <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${(nota.nota / 250) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium text-blue-600 whitespace-nowrap">{nota.nota}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4 text-xs sm:text-sm">
                        Nenhuma redação corrigida ainda. Comece a praticar!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de Competências */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600" />
                    Desempenho por Competência
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Média de desempenho em cada competência (máx. 50 XP por competência)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {competenciasData.length > 0 ? (
                      <div className="space-y-2 sm:space-y-3">
                        {competenciasData.map((competencia, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-xs sm:text-sm mb-1">
                              <span className="text-gray-700">{competencia.name}</span>
                              <span className="font-medium">{Math.round(competencia.media)}/{competencia.max}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${(competencia.media / competencia.max) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4 text-xs sm:text-sm">
                        Complete redações para ver seu desempenho por competência.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de XP Acumulado */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-600" />
                    XP Acumulado
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Seu progresso de experiência ao longo do tempo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4 overflow-x-auto">
                    {evolucaoXP.length > 0 ? (
                      <div className="min-w-max space-y-2">
                        {evolucaoXP.map((item, index) => (
                          <div key={index} className="flex items-center justify-between min-w-max">
                            <span className="text-xs text-gray-600 whitespace-nowrap">Redação {item.redacao}</span>
                            <div className="flex items-center space-x-2 min-w-max">
                              <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-600 h-2 rounded-full" 
                                  style={{ width: `${(item.acumulado / 100000) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium text-purple-600 whitespace-nowrap">{item.acumulado}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4 text-xs sm:text-sm">
                        Complete redações para ver seu progresso de XP.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de Distribuição de Notas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <PieChart className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-orange-600" />
                    Distribuição de Notas (XP)
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Faixa de notas mais frequentes (máx. 250 XP por redação)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {notasData.length > 0 ? (
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">0-150 XP</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-600 h-2 rounded-full" 
                                style={{ width: `${(notasData.filter(n => n.nota < 150).length / notasData.length) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium">{notasData.filter(n => n.nota < 150).length}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">150-200 XP</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-600 h-2 rounded-full" 
                                style={{ width: `${(notasData.filter(n => n.nota >= 150 && n.nota < 200).length / notasData.length) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium">{notasData.filter(n => n.nota >= 150 && n.nota < 200).length}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">200-250 XP</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${(notasData.filter(n => n.nota >= 200).length / notasData.length) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium">{notasData.filter(n => n.nota >= 200).length}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4 text-xs sm:text-sm">
                        Complete redações para ver a distribuição de notas.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Jornada das Patentes - Otimizado para mobile */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Jornada das Patentes</h3>
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <Trophy className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600" />
                    Sua Posição Atual: {patenteAtual.title} {patenteAtual.emoji}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Avance através das 7 patentes para se tornar uma lenda da redação
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Progresso da patente atual */}
                  {patenteAtual.level < 7 && patenteProxima && (
                    <div className="mb-4 sm:mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                          Para {patenteProxima.title} {patenteProxima.emoji}
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-blue-600">
                          {Math.round(progressoProximaPatente)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 sm:h-3 rounded-full transition-all duration-500"
                          style={{ width: `${progressoProximaPatente}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {userProfile?.xp_total?.toLocaleString() || '0'} / {patenteProxima.xpRequired.toLocaleString()} XP
                      </div>
                    </div>
                  )}

                  {/* Linha do tempo das patentes */}
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                    
                    <div className="space-y-3 sm:space-y-4">
                      {patentes.map((patente, index) => {
                        const isUnlocked = userProfile?.xp_total >= patente.xpRequired;
                        const isCurrent = patente.title === patenteAtual.title;
                        
                        return (
                          <div key={patente.title} className="relative flex items-center">
                            <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                              isCurrent ? 'bg-blue-600 ring-4 ring-blue-300' : 
                              isUnlocked ? 'bg-green-500' : 'bg-gray-300'
                            }`}>
                              <span className="text-white text-lg">{patente.emoji}</span>
                            </div>
                            
                            <div className={`ml-12 flex-1 p-3 sm:p-4 rounded-lg border-2 ${
                              isCurrent ? 'border-blue-500 bg-blue-100 shadow-md' :
                              isUnlocked ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                            }`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className={`font-semibold text-sm sm:text-base ${
                                    isCurrent ? 'text-blue-800' : 
                                    isUnlocked ? 'text-green-800' : 'text-gray-700'
                                  }`}>
                                    {patente.title} {patente.emoji}
                                  </h4>
                                  <p className={`text-xs sm:text-sm ${
                                    isCurrent ? 'text-blue-600' : 
                                    isUnlocked ? 'text-green-600' : 'text-gray-500'
                                  }`}>
                                    {patente.description}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className={`text-xs sm:text-sm font-medium ${
                                    isCurrent ? 'text-blue-600' : 
                                    isUnlocked ? 'text-green-600' : 'text-gray-400'
                                  }`}>
                                    {isUnlocked ? '✓ Conquistado' : 
                                     isCurrent ? '🎯 Atual' : 
                                     `${patente.xpRequired.toLocaleString()} XP`}
                                  </div>
                                  {index < patentes.length - 1 && (
                                    <ChevronRight className={`h-3 w-3 sm:h-4 sm:w-4 mt-1 ${
                                      isUnlocked ? 'text-green-500' : 'text-gray-300'
                                    }`} />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;