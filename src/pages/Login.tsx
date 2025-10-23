"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/contexts/UserDataContext';
import { showSuccess, showError } from '@/utils/toast';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { clearUserDataFromStorage } = useUserData();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  useEffect(() => {
    // Limpar dados de usuário antigos ao acessar a página de login
    clearUserDataFromStorage();
    
    // Verificar se usuário já está logado
    const token = localStorage.getItem('supabase.auth.token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate, clearUserDataFromStorage]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingAuth(true);

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      showSuccess('Login realizado com sucesso!');
      navigate('/dashboard');
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
        showSuccess('Cadastro realizado com sucesso! Faça login para continuar.');
        setActiveTab('login');
      } else {
        showSuccess('Cadastro realizado! Faça login para continuar.');
        setActiveTab('login');
      }
    } catch (error: any) {
      showError(error.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {/* Logo real do Supabase */}
          <div className="flex items-center justify-center mb-4">
            <img 
              src="https://ugdpjgftmhyurrmfzdux.supabase.co/storage/v1/object/public/imagens/logo%2001" 
              alt="AprimorAi" 
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                // Fallback para SVG se a imagem não carregar
                e.currentTarget.outerHTML = `
                  <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <span class="text-white text-xl font-bold">A</span>
                  </div>
                `;
              }}
            />
          </div>
          <h1 className="text-3xl font-bold text-blue-600">AprimorAi</h1>
          <p className="text-gray-600 mt-1">Entre na sua conta e comece a treinar redação</p>
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