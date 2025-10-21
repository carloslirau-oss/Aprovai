"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePayment } from '@/contexts/PaymentContext';
import { showSuccess, showError } from '@/utils/toast';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { hasPaid, isLoading, checkPaymentStatus } = usePayment();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  useEffect(() => {
    // Verificar status de pagamento quando o componente carregar
    checkPaymentStatus();
  }, [checkPaymentStatus]);

  useEffect(() => {
    // Se o usuário já fez login e tem acesso, redirecionar para dashboard
    const token = localStorage.getItem('supabase.auth.token');
    if (token && hasPaid) {
      navigate('/dashboard');
    }
  }, [hasPaid, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingAuth(true);

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        // Se for erro de e-mail não verificado, oferecer opção de reenviar
        if (error.message?.includes('Email not confirmed')) {
          showError('Por favor, verifique seu e-mail antes de fazer login.');
          return;
        }
        throw error;
      }
      
      // Verificar status de pagamento após login
      await checkPaymentStatus();
      
      if (hasPaid) {
        showSuccess('Login realizado com sucesso!');
        navigate('/dashboard');
      } else {
        showSuccess('Login realizado! Por favor, complete seu pagamento para acessar a plataforma.');
        navigate('/payment');
      }
    } catch (error: any) {
      showError(error.message || 'E-mail ou senha incorretos. Tente novamente.');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingAuth(true);

    try {
      const { data, error } = await signUp(email, password, name);
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Se o usuário foi criado com sucesso, permitir login imediato
        showSuccess('Cadastro realizado com sucesso! Faça login para continuar.');
        setActiveTab('login');
      } else {
        // Caso contrário, mostrar mensagem de verificação
        showSuccess('Cadastro realizado! Verifique seu e-mail para confirmar o cadastro.');
        setEmailVerificationSent(true);
      }
    } catch (error: any) {
      showError(error.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-blue-600">AprimorAi</h1>
          </div>
          <p className="text-gray-600">Entre na sua conta e comece a treinar redação</p>
        </div>

        <Card className="shadow-lg">
          {/* Abas */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                activeTab === 'login'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                activeTab === 'register'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Cadastre-se
            </button>
          </div>

          <CardContent className="p-6">
            {/* Mensagem de verificação de e-mail */}
            {emailVerificationSent && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium text-blue-900">Verifique seu e-mail</h3>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  Enviamos um link de confirmação para {email}. Clique no link para ativar sua conta.
                </p>
                <p className="text-xs text-blue-600">
                  Verifique também sua caixa de spam.
                </p>
              </div>
            )}

            {/* Formulário de Login */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                    Esqueci minha senha
                  </a>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  disabled={isLoadingAuth}
                >
                  {isLoadingAuth ? 'Entrando...' : 'Entrar na Plataforma'}
                </Button>
              </form>
            )}

            {/* Formulário de Cadastro */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">E-mail</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  disabled={isLoadingAuth}
                >
                  {isLoadingAuth ? 'Criando Conta...' : 'Criar Conta'}
                </Button>
              </form>
            )}

            {/* Mensagem de link entre as abas */}
            <div className="mt-6 text-center">
              {activeTab === 'login' ? (
                <p className="text-sm text-gray-600">
                  Não tem uma conta?{' '}
                  <button 
                    onClick={() => setActiveTab('register')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Cadastre-se
                  </button>
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  Já tem uma conta?{' '}
                  <button 
                    onClick={() => setActiveTab('login')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Faça login
                  </button>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;