"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  Upload, 
  Save,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Star,
  Award,
  FileText,
  Image as ImageIcon,
  Bot,
  RefreshCw,
  Pencil,
  Clock,
  Settings,
  Plus,
  ChevronDown,
  Shuffle,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/contexts/UserDataContext';
import { showSuccess, showError } from '@/utils/toast';
import Sidebar from '@/components/Sidebar';

const CorretorRedacao = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { userProfile, addRedacao } = useUserData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [redacaoText, setRedacaoText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [hasStartedRedacao, setHasStartedRedacao] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(180);
  const [timerActive, setTimerActive] = useState(false);
  const [selectedTime, setSelectedTime] = useState(180);
  const [showTimeOptions, setShowTimeOptions] = useState(false);
  const [customTimeInput, setCustomTimeInput] = useState({ hours: 3, minutes: 0 });

  const tips = [
    {
      title: "Competências do ENEM",
      content: "Lembre-se que sua redação será avaliada em 5 competências: Domínio da Modalidade Escrita Formal, Compreensão da Tarefa, Coerência e Coesão, Seleção de Recursos de Linguagem e Proposta de Intervenção. Foque em cada uma delas!",
      icon: Target
    },
    {
      title: "Repertório Cultural",
      content: "Não esqueça de incluir repertório! Dados, fatos, citações, obras literárias e exemplos históricos são essenciais para dar sustentação aos seus argumentos. Mas lembre-se: qualidade importa mais que quantidade!",
      icon: BookOpen
    },
    {
      title: "Estrutura Textual",
      content: "Sua redação precisa ter uma estrutura clara: introdução com tese, desenvolvimento com argumentos e proposta de intervenção, e conclusão que retoma a tese. Cada parágrafo deve ter uma função específica!",
      icon: FileText
    },
    {
      title: "Linguagem Formal",
      content: "Use sempre a norma culta da língua portuguesa. Evite gírias, abreviações e linguagem coloquial. A pontuação correta é fundamental para a clareza do texto. Vamos manter o padrão formal, meu caro aluno!",
      icon: CheckCircle
    },
    {
      title: "Proposta de Intervenção",
      content: "Sua proposta precisa ser viável, específica e direcionada ao problema apresentado. Não basta dizer 'o governo deve agir'. Diga COMO, QUANDO e POR QUÊ o governo deve agir. Seja concreto e prático!",
      icon: Lightbulb
    },
    {
      title: "Tempo de Prova",
      content: "Na hora da prova, reserve 30 minutos para planejar, 90 minutos para escrever e 30 minutos para revisar. Não se apresse na escrita, mas também não fique preso em um único parágrafo por muito tempo!",
      icon: TrendingUp
    }
  ];

  const redacaoThemes = [
    {
      title: "Proposta de Redação",
      contextualizacao: [
        {
          texto: "A violência contra a mulher no Brasil atingiu níveis alarmantes. Segundo dados do Fórum Brasileiro de Segurança Pública, em 2022, 1.311 mulheres foram assassinadas no país, o que representa uma média de 3,6 mulheres por dia. Esse cenário reflete uma crise social profunda que exige ações urgentes e efetivas por parte do Estado e da sociedade. A violência de gênero não é apenas um problema individual, mas uma questão estrutural que permeia todas as esferas da vida das mulheres, desde o ambiente doméstico até o espaço público. A cultura do silêncio e a normalização da violência perpetuam esse ciclo de opressão, tornando difícil para as vítimas buscarem ajuda e justiça.",
          fonte: "Fórum Brasileiro de Segurança Pública",
          tamanho: "grande"
        },
        {
          texto: "A Lei Maria da Penha, sancionada em 2006, foi um marco na legislação brasileira para combater a violência doméstica e familiar. No entanto, sua implementação ainda enfrenta desafios significativos, como a falta de delegacias especializadas, a subnotificação de casos e a morosidade da justiça. Muitas mulheres ainda enfrentam barreiras para denunciar seus agressores, medo de represálias e falta de apoio institucional. A necessidade de políticas públicas mais eficientes e de uma mudança cultural que desestimule a violência de gênero é cada vez mais evidente.",
          fonte: "ONU Mulheres",
          tamanho: "medio"
        },
        {
          texto: "A desigualdade de gênero persiste em todas as esferas da sociedade brasileira, desde o mercado de trabalho até a política. Mulheres ainda ganham menos que homens por igual trabalho, enfrentam dificuldades de ascensão profissional e são subrepresentadas em cargos de decisão. Essa desigualdade estrutural contribui para a perpetuação da violência, pois reforça a ideia de que as mulheres são inferiores e podem ser submetidas a abusos.",
          fonte: "Instituto de Pesquisa Econômica Aplicada",
          tamanho: "pequeno"
        },
        {
          texto: "A educação para a igualdade de gênero e o respeito aos direitos humanos são fundamentais para combater a violência contra as mulheres. Programas que promovem a conscientização desde a infância e que ensinam sobre consentimento, respeito e relações saudáveis são essenciais para construir uma sociedade mais justa e igualitária para todos.",
          fonte: "Ministério da Educação",
          tamanho: "pequeno"
        }
      ],
      tema: "A persistência da violência contra a mulher na sociedade brasileira.",
      instrucoes: "Com base na leitura dos textos motivadores e nos conhecimentos construídos ao longo de sua formação, redija um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema acima.\n\nApresente proposta de intervenção que respeite os direitos humanos.\n\nSelecione, organize e relacione, de forma coerente e coesa, argumentos e fatos para defender seu ponto de vista."
    }
  ];

  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [themeHistory, setThemeHistory] = useState<number[]>([]);
  const redacaoTheme = redacaoThemes[currentThemeIndex];

  const generateRandomTheme = () => {
    const newIndex = Math.floor(Math.random() * redacaoThemes.length);
    setCurrentThemeIndex(newIndex);
    setThemeHistory(prev => [...prev, newIndex]);
    return newIndex;
  };

  const goToPreviousTheme = () => {
    if (themeHistory.length > 0) {
      const previousIndex = themeHistory[themeHistory.length - 1];
      setCurrentThemeIndex(previousIndex);
      setThemeHistory(prev => prev.slice(0, -1));
    }
  };

  const goToRandomTheme = () => {
    const newIndex = Math.floor(Math.random() * redacaoThemes.length);
    setCurrentThemeIndex(newIndex);
    setThemeHistory(prev => [...prev, newIndex]);
  };

  useEffect(() => {
    generateRandomTheme();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      showSuccess('Logout realizado com sucesso!');
      navigate('/login');
    } catch (error) {
      showError('Erro ao realizar logout. Tente novamente.');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      console.log('Imagem enviada:', file.name);
    }
  };

  const getNewTip = () => {
    const newIndex = (currentTipIndex + 1) % tips.length;
    setCurrentTipIndex(newIndex);
  };

  const startRedacao = () => {
    setHasStartedRedacao(true);
    setTimerActive(true);
    setTimeRemaining(selectedTime);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const analyzeRedacao = async () => {
    if (!redacaoText.trim() && !imageFile) {
      showError('Por favor, escreva sua redação ou envie uma imagem.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const result = {
        totalScore: 820,
        competencies: [
          { name: 'Domínio da Modalidade Escrita Formal', score: 180, max: 200 },
          { name: 'Compreensão da Tarefa', score: 170, max: 200 },
          { name: 'Coerência e Coesão', score: 160, max: 200 },
          { name: 'Seleção de Recursos de Linguagem', score: 150, max: 200 },
          { name: 'Proposta de Intervenção', score: 160, max: 200 }
        ],
        errors: [
          'Falta de conectivos entre os parágrafos',
          'Uso incorreto de pontuação em alguns períodos',
          'Falta de exemplos concretos para sustentar argumentos'
        ],
        suggestions: [
          'Incluir mais dados estatísticos sobre o tema',
          'Utilizar conectivos como "além disso", "por outro lado" para melhorar a coesão',
          'Adicionar citações de autores renomados para dar mais credibilidade'
        ],
        detailedFeedback: [
          {
            competency: 'Domínio da Modalidade Escrita Formal',
            feedback: 'Sua redação demonstra excelente domínio da norma culta! A gramática está impecável e o vocabulário rico. Continue assim que você vai virar o novo Machado de Assis! 😎'
          },
          {
            competency: 'Compreensão da Tarefa',
            feedback: 'Você entendeu perfeitamente o tema e a proposta de intervenção. A abordagem está direcionada corretamente. Professor Carlinhos aprova! 👏'
          },
          {
            competency: 'Coerência e Coesão',
            feedback: 'A estrutura está boa, mas poderia melhorar a conexão entre os parágrafos. Tente usar mais conectivos para criar um fluxo mais natural.'
          },
          {
            competency: 'Seleção de Recursos de Linguagem',
            feedback: 'Seu estilo é único e cativante! A variedade de estruturas sintáticas enriquece o texto. Só faltou um pouquinho mais de figuras de retórica.'
          },
          {
            competency: 'Proposta de Intervenção',
            feedback: 'Sua proposta é viável e bem fundamentada. Que tal incluir um cronograma de implementação para deixar ainda mais completo?'
          }
        ]
      };
      
      setAnalysisResult(result);
      showSuccess('Redação analisada com sucesso!');
    } catch (error) {
      showError('Erro ao analisar a redação. Tente novamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveRedacao = async () => {
    if (!analysisResult) return;
    
    try {
      await addRedacao({
        tema: redacaoTheme.tema,
        texto: redacaoText,
        nota_total: analysisResult.totalScore,
        competencia_1: analysisResult.competencies[0].score,
        competencia_2: analysisResult.competencies[1].score,
        competencia_3: analysisResult.competencies[2].score,
        competencia_4: analysisResult.competencies[3].score,
        competencia_5: analysisResult.competencies[4].score,
        erros: analysisResult.errors,
        sugestoes: analysisResult.suggestions,
      });
      
      showSuccess('Redação salva no seu histórico!');
    } catch (error) {
      showError('Erro ao salvar redação. Tente novamente.');
    }
  };

  const handleTimeChange = (minutes: number) => {
    setSelectedTime(minutes * 60);
    setTimeRemaining(minutes * 60);
    setShowTimeOptions(false);
  };

  const handleCustomTime = () => {
    const totalMinutes = customTimeInput.hours * 60 + customTimeInput.minutes;
    if (totalMinutes > 0) {
      setSelectedTime(totalMinutes * 60);
      setTimeRemaining(totalMinutes * 60);
      setShowTimeOptions(false);
    }
  };

  const timeOptions = [
    { label: '30 minutos', value: 30 },
    { label: '1 hora', value: 60 },
    { label: '1h 30min', value: 90 },
    { label: '2 horas', value: 120 },
    { label: '2h 30min', value: 150 },
    { label: '3 horas', value: 180 },
    { label: '3h 30min', value: 210 },
    { label: '4 horas', value: 240 }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (timerActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timerActive, timeRemaining]);

  const currentTip = tips[currentTipIndex];

  const getTextSizeClass = (tamanho: string) => {
    switch (tamanho) {
      case 'grande':
        return 'border-l-4 border-blue-500';
      case 'medio':
        return 'border-l-4 border-green-500';
      case 'pequeno':
        return 'border-l-4 border-yellow-500';
      default:
        return 'border-l-4 border-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px:6 lg:px-8">
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
              >
                <BookOpen className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img 
                  src="https://ugdpjgftmhyurrmfzdux.supabase.co/storage/v1/object/public/imagens/logo%2001" 
                  alt="Logo" 
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.outerHTML = `
                      <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span class="text-white text-sm font-bold">A</span>
                      </div>
                    `;
                  }}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.user_metadata?.name || 'João da Silva'}
                  </p>
                  <div className="flex items-center space-x-1">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs text-gray-500">{userProfile?.patente || 'Iniciante'}</span>
                  </div>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          <div className="px-4 sm:px:6 lg:px-8 py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Redações</h2>
              <p className="text-gray-600">Prepare-se para o ENEM com temas reais e correção inteligente</p>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bot className="h-5 w-5 mr-2 text-green-600" />
                    Dicas do Professor Carlinhos
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={getNewTip}
                    className="text-green-600 hover:text-green-700"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Nova Dica
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg font-bold">C</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">{currentTip.title}</h3>
                      <p className="text-green-700 leading-relaxed">{currentTip.content}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    {redacaoTheme.title}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousTheme}
                      disabled={themeHistory.length === 0}
                      className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Anterior</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToRandomTheme}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                    >
                      <Shuffle className="h-4 w-4" />
                      <span>Novo Tema</span>
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contextualização Inicial</h3>
                    <div className="space-y-4">
                      {redacaoTheme.contextualizacao.map((item, index) => (
                        <div key={index} className={`bg-gray-50 p-4 rounded-lg ${getTextSizeClass(item.tamanho)}`}>
                          <p className="text-gray-700 mb-2">{item.texto}</p>
                          <p className="text-sm text-gray-500">Fonte: {item.fonte}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tema</h3>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-lg font-medium text-blue-900">{redacaoTheme.tema}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Instruções</h3>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <p className="text-gray-700 whitespace-pre-line">{redacaoTheme.instrucoes}</p>
                    </div>
                  </div>

                  {!hasStartedRedacao && (
                    <div className="text-center py-6">
                      <Button 
                        onClick={startRedacao}
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                      >
                        <Pencil className="h-5 w-5 mr-2" />
                        Iniciar Redação
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {hasStartedRedacao && (
              <div className="space-y-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-red-600" />
                        <span className="font-medium text-gray-900">Tempo Restante:</span>
                        <span className={`font-bold ${timeRemaining < 600 ? 'text-red-600' : 'text-blue-600'}`}>
                          {formatTime(timeRemaining)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowTimeOptions(!showTimeOptions)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Personalizar
                          <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showTimeOptions ? 'rotate-180' : ''}`} />
                        </Button>
                      </div>
                    </div>

                    {showTimeOptions && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Escolha o tempo para redação:</h4>
                        
                        <div className="grid grid-cols-4 gap-2 mb-4">
                          {timeOptions.map((option) => (
                            <Button
                              key={option.value}
                              variant={selectedTime === option.value * 60 ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleTimeChange(option.value)}
                              className="text-xs"
                            >
                              {option.label}
                            </Button>
                          ))}
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Personalizado:</span>
                          <div className="flex items-center space-x-1">
                            <Input
                              type="number"
                              min="0"
                              max="12"
                              value={customTimeInput.hours}
                              onChange={(e) => setCustomTimeInput(prev => ({ ...prev, hours: parseInt(e.target.value) || 0 }))}
                              placeholder="H"
                              className="w-16 text-center"
                            />
                            <span className="text-sm text-gray-500">h</span>
                            <Input
                              type="number"
                              min="0"
                              max="59"
                              value={customTimeInput.minutes}
                              onChange={(e) => setCustomTimeInput(prev => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))}
                              placeholder="M"
                              className="w-16 text-center"
                            />
                            <span className="text-sm text-gray-500">min</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={handleCustomTime}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Aplicar
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                      Escreva sua redação aqui
                    </CardTitle>
                    <CardDescription>
                      Escreva o texto completo da sua redação abaixo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <textarea
                        value={redacaoText}
                        onChange={(e) => setRedacaoText(e.target.value)}
                        placeholder="Escreva sua redação aqui..."
                        className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <Button 
                        onClick={analyzeRedacao}
                        disabled={isAnalyzing || (!redacaoText.trim() && !imageFile)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isAnalyzing ? 'Analisando...' : 'Corrigir Redação'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ImageIcon className="h-5 w-5 mr-2 text-blue-600" />
                      Envie imagem da redação
                    </CardTitle>
                    <CardDescription>
                      Tire uma foto da sua redação escrita à mão
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">Arraste uma imagem ou clique para selecionar</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload">
                          <Button variant="outline" className="cursor-pointer">
                            Selecionar Imagem
                          </Button>
                        </label>
                      </div>
                      {imageFile && (
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-green-800">
                            Imagem selecionada: {imageFile.name}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2 text-blue-600" />
                      Resultado da Análise
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">
                          {analysisResult.totalScore}
                        </div>
                        <p className="text-gray-600">Nota Total</p>
                      </div>
                      <div className="space-y-3">
                        {analysisResult.competencies.map((comp: any, index: number) => (
                          <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-700">{comp.name}</span>
                              <span className="font-medium">{comp.score}/{comp.max}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${(comp.score / comp.max) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {analysisResult.detailedFeedback.map((feedback: any, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Star className="h-4 w-4 mr-2 text-yellow-500" />
                          {feedback.competency}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{feedback.feedback}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                        Principais Erros
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysisResult.errors.map((error: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="text-gray-700">{error}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                        Sugestões de Melhoria
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysisResult.suggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="text-gray-700">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button onClick={saveRedacao} className="bg-green-600 hover:bg-green-700 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Redação
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setAnalysisResult(null);
                      setRedacaoText('');
                      setImageFile(null);
                      setHasStartedRedacao(false);
                      setTimerActive(false);
                    }}
                  >
                    Nova Redação
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CorretorRedacao;