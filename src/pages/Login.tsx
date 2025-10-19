"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Aqui você integrará com o Supabase para autenticação
      // Por enquanto, vamos simular um login bem-sucedido
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccess('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      showError('E-mail ou senha incorretos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Entrar</CardTitle>
            <CardDescription>
              Digite seu e-mail e senha para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar na Plataforma'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Cadastre-se
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;