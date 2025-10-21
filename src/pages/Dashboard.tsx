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
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/contexts/UserDataContext';
import { showSuccess, showError } from '@/utils/toast';
import Sidebar from '@/components/Sidebar';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { userProfile, redacoes, isLoading, updateUserStats } = useUserData();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Sistema de patentes com requisitos
  const patentes = [
    {
      level: 1,
      title: 'Iniciante',
      xpRequired: 0,
      xpNext: 500,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: Star,
      description: 'Sua jornada começa aqui',
      requirements: [
        'Complete sua primeira redação',
        'Converse com o Professor Carlinhos',
        'Pratique as cinco competências do ENEM'
      ],
      professorTip: 'Ninguém nasce pronto, nem eu quando comecei a corrigir. Vamos começar com estilo, futuro 1000.'
    },
    {
      level: 2,
      title: 'Treineiro',
      xpRequired: 500,
      xpNext: 2000,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: Zap,
      description: 'Você está pegando o ritmo',
      requirements: [
        'Corrija 3 redações seguidas',
        'Mantenha notas acima de 700',
        'Revise seus erros e explore as dicas'
      ],
      professorTip: 'Está começando a esquentar! Continua assim que o Inep vai pedir o seu autógrafo.'
    },
    {
      level: 3,
      title: 'Competente',
      xpRequired: 2000,
      xpNext: 5000,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      icon: Award,
      description: 'Você escreve como um verdadeiro competente',
      requirements: [
        'Alcance 5 redações com nota acima de 850',
        'Treine com tempo cronometrado',
        'Aprimore coesão e argumentação'
      ],
      professorTip: 'Agora sim, sua introdução está tão boa que eu quase levantei pra aplaudir. Quase.'
    },
    {
      level: 4,
      title: 'Mestre da Caneta',
      xpRequired: 5000,
      xpNext: 10000,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: Crown,
      description: 'Sua caneta vale ouro',
      requirements: [
        'Mantenha média acima de 900 em 3 redações',
        'Produza redações com tema surpresa',
        'Revise conectivos e explore modos avançados'
      ],
      professorTip: 'Se escrever mais bonito que isso, o corretor vai querer emoldurar sua redação.'
    },
    {
      level: 5,
      title: 'Nota 1000',
      xpRequired: 10000,
      xpNext: null,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: Trophy,
      description: 'Você alcançou o ápice da redação',
      requirements: [
        'Continue praticando semanalmente',
        'Participe dos desafios "Rumo à Nota 1000"',
        'Contribua com a comunidade'
      ],
      professorTip: 'Agora você é praticamente uma lenda da caneta. Se Platão visse isso, te chamava pra tomar café.'
    }
  ];

  // Determinar patente atual do usuário
  const determinarPatenteAtual = (xp: number) => {
    for (let i = patentes.length - 1; i >= 0; i--) {
      if (xp >= patentes[i].xpRequired) {
        return patentes[i];
      }
    }
    return patentes[0]; // Padrão: Iniciante
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
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px:6 lg:px-8">
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
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.user_metadata?.name?.split(' ').map(n => n[0]).join('') || 'JD'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.user_metadata?.name || 'João da Silva'}
                  </p>
                  <div className="flex items-center space-x-1">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs text-gray-500">{patenteAtual.title}</span>
                  </div>
                </div>
              </div>
              
              <Button variant="ghost" size="sm">
                <Sun className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <div className="px-4 sm:px:6 lg:px-8 py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta, {user?.user_metadata?.name?.split(' ')[0] || 'João'}!</h2>
              <p className="text-gray-600">Continue seu treinamento e alcance a nota 1000 no ENEM</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Current Rank Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Sua Patente Atual</h3>
              <Card className={`border-2 ${patenteAtual.borderColor} ${patenteAtual.bgColor}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${patenteAtual.bgColor}`}>
                        <patenteAtual.icon className={`h-8 w-8 ${patenteAtual.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl flex items-center">
                          {patenteAtual.title}
                          {patenteAtual.level < 5 && (
                            <span className="ml-2 text-sm text-gray-500">
                              (Patente {patenteAtual.level} de 5)
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription className="text-base">{patenteAtual.description}</CardDescription>
                      </div>
                    </div>
                    {patenteAtual.level < 5 && (
                      <div className="text-right">
                        <div className="text-sm text-gray-600">XP para próxima patente</div>
                        <div className="text-lg font-bold text-blue-600">
                          {patenteProxima?.xpRequired?.toLocaleString() || '0'} XP
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Progress Bar */}
                    {patenteAtual.level < 5 && (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Progresso para {patenteProxima?.title}</span>
                          <span className="font-medium text-blue-600">{Math.round(progressoProximaPatente)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progressoProximaPatente}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{patenteAtual.xpRequired.toLocaleString()} XP</span>
                          <span>{patenteProxima?.xpRequired?.toLocaleString()} XP</span>
                        </div>
                      </div>
                    )}

                    {/* Requirements */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                        Requisitos para {patenteAtual.level < 5 ? 'manter esta patente' : 'permanecer no topo'}
                      </h4>
                      <ul className="space-y-2">
                        {patenteAtual.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="text-gray-700">{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Professor Tip */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-blue-600">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-bold">C</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-800 mb-1">Professor Carlinhos:</p>
                          <p className="text-blue-700 italic">"{patenteAtual.professorTip}"</p>
                        </div>
                      </div>
                    </div>

                    {/* Next Rank Info */}
                    {patenteAtual.level < 5 && patenteProxima && (
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <h4 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center">
                          <ArrowRight className="h-5 w-5 mr-2" />
                          Próxima Patente: {patenteProxima.title}
                        </h4>
                        <p className="text-yellow-700 mb-3">
                          Para alcançar a patente <strong>{patenteProxima.title}</strong>, você precisa acumular <strong>{patenteProxima.xpRequired.toLocaleString()} pontos de XP</strong>.
                        </p>
                        <div className="bg-white p-3 rounded border border-yellow-300">
                          <h5 className="font-medium text-yellow-800 mb-2">Requisitos específicos:</h5>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            {patenteProxima.requirements.map((requirement, index) => (
                              <li key={index} className="flex items-start">
                                <Clock className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                                {requirement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
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