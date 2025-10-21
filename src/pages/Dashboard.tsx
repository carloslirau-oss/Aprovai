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
  Trophy
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

  // Determinar patente com base no XP
  const determinarPatente = (xp: number) => {
    if (xp >= 4500) return { title: 'Nota 1000', level: 5, color: 'text-red-600', bgColor: 'bg-red-50' };
    if (xp >= 3000) return { title: 'Mestre da Caneta', level: 4, color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    if (xp >= 1500) return { title: 'Competente', level: 3, color: 'text-purple-600', bgColor: 'bg-purple-50' };
    if (xp >= 500) return { title: 'Treineiro', level: 2, color: 'text-green-600', bgColor: 'bg-green-50' };
    return { title: 'Iniciante', level: 1, color: 'text-blue-600', bgColor: 'bg-blue-50' };
  };

  const patente = determinarPatente(userProfile?.xp_total || 0);

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

  const ranks = [
    {
      level: 1,
      title: 'Iniciante',
      subtitle: 'Sua jornada começa aqui',
      description: 'Todo mestre começou escrevendo sua primeira redação. Este é o seu ponto de partida rumo à nota 1000.',
      card: 'Patente atual: Iniciante. Complete sua primeira redação para ganhar sua primeira medalha e desbloquear as estatísticas.',
      nextSteps: [
        'Envie sua primeira redação no corretor.',
        'Converse com o Professor Carlinhos para receber dicas e incentivo.',
        'Pratique as cinco competências do ENEM e refine seu texto com base no feedback da IA.'
      ],
      quote: 'Ninguém nasce pronto, nem eu quando comecei a corrigir. Vamos começar com estilo, futuro 1000.',
      icon: Star,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      level: 2,
      title: 'Treineiro',
      subtitle: 'Você está pegando o ritmo',
      description: 'Agora que já deu o primeiro passo, é hora de treinar a constância e fortalecer sua base argumentativa.',
      card: 'Patente atual: Treineiro. Corrija três redações seguidas e mantenha notas acima de 700 para subir de patente.',
      nextSteps: [
        'Produza novas redações com temas atualizados.',
        'Reveja seus erros e explore o modo "Dicas do Carlinhos".',
        'Use o Dashboard para acompanhar sua evolução.'
      ],
      quote: 'Está começando a esquentar! Continua assim que o Inep vai pedir o seu autógrafo.',
      icon: Zap,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      level: 3,
      title: 'Competente',
      subtitle: 'Você está escrevendo como um verdadeiro competente',
      description: 'Suas ideias estão fluindo com clareza, e sua escrita ganhou consistência. O caminho para a nota máxima está mais próximo.',
      card: 'Patente atual: Competente. Alcance cinco redações com nota acima de 850 para avançar ao próximo nível.',
      nextSteps: [
        'Treine com tempo cronometrado.',
        'Aprimore a coesão e argumentação.',
        'Solicite feedback direto do Professor Carlinhos.',
        'Acompanhe suas métricas por competência no Dashboard.'
      ],
      quote: 'Agora sim, sua introdução está tão boa que eu quase levantei pra aplaudir. Quase.',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      level: 4,
      title: 'Mestre da Caneta',
      subtitle: 'Sua caneta vale ouro',
      description: 'Você domina a estrutura textual e possui estilo próprio. É hora de lapidar os detalhes e atingir a excelência.',
      card: 'Patente atual: Mestre da Caneta. Mantenha média acima de 900 em três redações consecutivas para alcançar o topo.',
      nextSteps: [
        'Produza uma redação com tema surpresa.',
        'Treine com modelos nota 1000.',
        'Revise conectivos e explore o modo de simulação completa.'
      ],
      quote: 'Se escrever mais bonito que isso, o corretor vai querer emoldurar sua redação.',
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      level: 5,
      title: 'Nota 1000',
      subtitle: 'Você alcançou o ápice da redação',
      description: 'Parabéns, sua escrita é referência e sua argumentação exemplar. Sua jornada inspira outros estudantes a evoluírem.',
      card: 'Patente atual: Nota 1000. Continue praticando semanalmente para manter o desempenho e inspire novos alunos.',
      nextSteps: [
        'Revise suas redações anteriores.',
        'Participe dos desafios "Rumo à Nota 1000".',
        'Contribua com a comunidade.',
        'Mantenha o hábito da escrita.'
      ],
      quote: 'Agora você é praticamente uma lenda da caneta. Se Platão visse isso, te chamava pra tomar café.',
      icon: Trophy,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
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
                    <span className="text-xs text-gray-500">{patente.title}</span>
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

            {/* Journey Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Jornada do Aluno</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ranks.map((rank) => (
                  <Card key={rank.level} className={`relative overflow-hidden ${userProfile?.nivel >= rank.level ? 'ring-2 ring-blue-500' : 'opacity-75'}`}>
                    <div className={`absolute top-0 right-0 w-20 h-20 ${rank.bgColor} rounded-bl-full opacity-20`}></div>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg ${rank.bgColor}`}>
                          <rank.icon className={`h-6 w-6 ${rank.color}`} />
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-500">Patente {rank.level}</div>
                          <div className="text-lg font-bold text-gray-900">{rank.title}</div>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{rank.subtitle}</CardTitle>
                      <CardDescription>{rank.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-blue-800 font-medium">{rank.card}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Próximos passos:</h4>
                          <ul className="space-y-1">
                            {rank.nextSteps.map((step, stepIndex) => (
                              <li key={stepIndex} className="text-sm text-gray-600 flex items-start">
                                <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600">
                          <p className="text-sm text-gray-700 italic">
                            <span className="font-medium text-blue-600">Professor Carlinhos:</span> {rank.quote}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;