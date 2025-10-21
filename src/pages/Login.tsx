"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  BookOpen, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock,
  User,
  ArrowRight,
  Shield,
  GraduationCap,
  Target,
  Users,
  CheckCircle
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Validate inputs
      if (!email || !password) {
        throw new Error('Por favor, preencha todos os campos');
      }

      if (!email.includes('@')) {
        throw new Error('Por favor, insira um email válido');
      }

      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      // Simulate successful login
      showSuccess('Login realizado com sucesso!');
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      showError(error.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Features */}
        <div className="space-y-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              {/* Aqui você pode adicionar sua imagem */}
              <img 
                src="/src/assets/logo.png" 
                alt="AprimorAi Logo" 
                className="h-12 w-auto mr-3" 
              />
              <h1 className="text-3xl font-bold text-blue-600">AprimorAi</h1>
            </div>
            <p className="text-gray-600 text-lg">
              Sua plataforma definitiva para dominar a redação do ENEM
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Correção Inteligente</h3>
                <p className="text-gray-600">Análise detalhada de suas redações com feedback personalizado baseado nas competências do ENEM.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Temas Reais do ENEM</h3>
                <p className="text-gray-600">Acesse temas de redação dos últimos anos e prepare-se para os desafios reais da prova.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Professor Carlinhos</h3>
                <p className="text-gray-600">Converse com nosso assistente de IA especialista em redação do ENEM para tirar dúvidas e receber dicas.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Progresso Rastreável</h3>
                <p className="text-gray-600">Monitore sua evolução, veja estatísticas detalhadas e alcance a nota 1000 com nosso sistema gamificado.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">O que nossos alunos dizem:</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 italic">"AprimorAi mudou completamente meu jeito de escrever. Minha nota subiu de 680 para 890 em 3 meses!"</p>
                  <p className="text-sm text-gray-500 mt-1">- Maria S., Aluna nota 1000</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 italic">"O Professor Carlinhos é incrível! Sempre tem a resposta certa para minhas dúvidas."</p>
                  <p className="text-sm text-gray-500 mt-1">- Pedro L., Aluno nota 950</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">Bem-vindo de volta!</CardTitle>
              <CardDescription>
                Faça login para acessar sua conta e continuar seus estudos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Lembrar de mim
                    </label>
                  </div>
                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                      Esqueceu a senha?
                    </a>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Entrando...
                    </div>
                  ) : (
                    <>
                      Entrar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Ou continue com</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full">
                    <User className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  <Button variant="outline" className="w-full">
                    <User className="mr-2 h-4 w-4" />
                    Facebook
                  </Button>
                </div>
              </div>

              <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">Não tem uma conta? </span>
                <button
                  type="button"
                  onClick={handleRegister}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Cadastre-se
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;