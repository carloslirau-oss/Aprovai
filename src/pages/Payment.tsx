"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  ArrowLeft,
  Crown,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePayment } from '@/contexts/PaymentContext';
import { showSuccess, showError } from '@/utils/toast';
import Sidebar from '@/components/Sidebar';

const Payment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasPaid, isLoading, createPayment } = usePayment();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Exemplo: R$ 29,90 por acesso à plataforma
      const amount = 29.90;
      const paymentMethod = 'credit_card';
      
      const result = await createPayment(amount, paymentMethod);
      
      if (result.success && result.url) {
        // Redirecionar para o checkout externo
        window.location.href = result.url;
      } else {
        showError('Erro ao criar pagamento. Tente novamente.');
      }
    } catch (error) {
      showError('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verificando status de pagamento...</p>
        </div>
      </div>
    );
  }

  if (hasPaid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pagamento Aprovado!</h2>
            <p className="text-gray-600 mb-6">
              Parabéns! Você agora tem acesso completo à plataforma AprimorAi.
            </p>
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Crown className="h-6 w-6 text-yellow-500" />
                <span className="font-semibold text-green-800">Acesso Premium Liberado</span>
              </div>
              <p className="text-sm text-green-700">
                Você pode acessar todas as funcionalidades da plataforma, incluindo correção de redações e chat com o Professor Carlinhos.
              </p>
            </div>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Acessar Plataforma
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        isOpen={false} 
        onClose={() => {}} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px:8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
            
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
                  <p className="text-xs text-gray-500">Acesso Pendente</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">AprimorAi</h1>
              <p className="text-gray-600">Acesso Premium à Plataforma de Redação ENEM</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Plano Premium */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400 rounded-bl-full opacity-20"></div>
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-8 w-8 text-yellow-600" />
                  </div>
                  <CardTitle className="text-2xl">Plano Premium</CardTitle>
                  <CardDescription>Acesso completo à plataforma</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <span className="text-4xl font-bold text-gray-900">R$ 29,90</span>
                    <span className="text-gray-600">/mês</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">Correção de redações por IA</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">Acesso ao Professor Carlinhos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">Temas reais do ENEM</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">Estatísticas detalhadas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">Certificados de conclusão</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3"
                  >
                    {isProcessing ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pagar R$ 29,90
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Benefícios */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    Benefícios do Premium
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Correção Inteligente</h3>
                    <p className="text-sm text-blue-700">
                      Nossa IA analisa sua redação em 5 competências do ENEM e dá feedback detalhado para melhorar sua nota.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">Professor Carlinhos</h3>
                    <p className="text-sm text-green-700">
                      Chat com especialista em redação do ENEM para tirar dúvidas e receber orientações personalizadas.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-2">Temas Atualizados</h3>
                    <p className="text-sm text-purple-700">
                      Acesso a temas reais das últimas edições do ENEM com contextualização completa e instruções oficiais.
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-orange-900 mb-2">Estatísticas Avançadas</h3>
                    <p className="text-sm text-orange-700">
                      Acompanhe seu progresso, veja suas notas por competência e compare com outros alunos.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Informações de segurança */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Pagamento Seguro</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CreditCard className="h-4 w-4 text-blue-500" />
                  <span>Cartões Aceitos</span>
                </div>
                <div className="flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span>Cancelamento a Qualquer Momento</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Payment;