"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  TrendingUp, 
  Target, 
  Calendar, 
  Award,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    showSuccess('Logout realizado com sucesso!');
    navigate('/login');
  };

  const stats = [
    {
      title: 'Redações Corrigidas',
      value: '12',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Nota Média',
      value: '780',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'XP Total',
      value: '2,450',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Dias de Estudo',
      value: '7',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">AprimorAi</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">JD</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">João da Silva</p>
                  <div className="flex items-center space-x-1">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs text-gray-500">Mestre da Caneta</span>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta, João!</h2>
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

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Writing Correction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                Corretor de Redação
              </CardTitle>
              <CardDescription>
                Corrija sua redação e receba feedback detalhado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Cole seu texto ou envie uma imagem</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Colar Texto
                    </Button>
                    <Button variant="outline">
                      Enviar Imagem
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professor Carlinhos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white text-sm font-bold">C</span>
                </div>
                Professor Carlinhos
              </CardTitle>
              <CardDescription>
                Seu assistente de redação 24 horas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">C</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        "Opa! Tudo bem, meu caro aluno? Estou aqui para te ajudar a dominar a redação do ENEM! 😎"
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Input placeholder="Digite sua pergunta..." className="flex-1" />
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Enviar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;