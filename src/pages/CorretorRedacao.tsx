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
  Clock
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import Sidebar from '@/components/Sidebar';

const CorretorRedacao = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [redacaoText, setRedacaoText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [hasStartedRedacao, setHasStartedRedacao] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 hours in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [selectedTime, setSelectedTime] = useState(180); // Tempo selecionado nas configurações

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

  // Sample ENEM theme
  const redacaoTheme = {
    title: "Proposta de Redação",
    contextualizacao: [
      {
        texto: "A violência contra a mulher no Brasil atingiu níveis alarmantes. Segundo dados do Fórum Brasileiro de Segurança Pública, em 2022, 1.311 mulheres foram assassinadas no país, o que representa uma média de 3,6 mulheres por dia.",
        fonte: "Fórum Brasileiro de Segurança Pública"
      },
      {
        texto: "A Lei Maria da Penha, sancionada em 2006, foi um marco na legislação brasileira para combater a violência doméstica. No entanto, sua implementação ainda enfrenta desafios, como a falta de delegacias especializadas e a subnotificação de casos.",
        fonte: "ONU Mulheres"
      },
      {
        texto: "A cultura do silêncio perpetua a violência contra as mulheres. Muitas vítimas não denunciam por medo, vergonha ou falta de confiança no sistema de justiça.",
        fonte: "Revista Época"
      }
    ],
    tema: "A persistência da violência contra a mulher na sociedade brasileira.",
    instrucoes: "Com base na leitura dos textos motivadores e nos conhecimentos construídos ao longo de sua formação, redija um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema acima.\n\nApresente proposta de intervenção que respeite os direitos humanos.\n\nSelecione, organize e relacione, de forma coerente e coesa, argumentos e fatos para defender seu ponto de vista."
  };

  const handleLogout = () => {
    showSuccess('Logout realizado com sucesso!');
    navigate('/login');
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
    // Usa o tempo selecionado nas configurações
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

  const saveRedacao = () => {
    if (!analysisResult) return;
    
    showSuccess('Redação salva no seu histórico!');
  };

  const handleTimeChange = (minutes: number) => {
    setSelectedTime(minutes * 60); // Convert minutes to seconds
    setTimeRemaining(minutes * 60); // Atualiza o tempo restante imediatamente
  };

  // Timer effect
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onTimeChange={handleTimeChange}
        selectedTime={selectedTime}
      />

      {/* Main Content */}
      <div className="lg:pl-64">
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
                <BookOpen className="h-6 w-6" />
              </Button>
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
              
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 sm:px:6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Redações</h2>
            <p className="text-gray-600">Prepare-se para o ENEM com temas reais e correção inteligente</p>
          </div>

          {/* Professor Carlinhos Tips */}
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

          {/* Redação Theme Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                {redacaoTheme.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Contextualização Inicial */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contextualização Inicial</h3>
                  <div className="space-y-4">
                    {redacaoTheme.contextualizacao.map((item, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p className="text-gray-700 mb-2">{item.texto}</p>
                        <p className="text-sm text-gray-500">Fonte: {item.fonte}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delimitação do Tema */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Tema</h3>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-lg font-medium text-blue-900">{redacaoTheme.tema}</p>
                  </div>
                </div>

                {/* Instruções Oficiais */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Instruções</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-gray-700 whitespace-pre-line">{redacaoTheme.instrucoes}</p>
                  </div>
                </div>

                {/* Start Button */}
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

          {/* Redação Writing Area (only after clicking "Iniciar Redação") */}
          {hasStartedRedacao && (
            <div className="space-y-8">
              {/* Timer */}
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
                    <div className="text-sm text-gray-500">
                      {timeRemaining < 600 ? '⚠️ Atenção: Tempo acabando!' : 'Boa escrita!'}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Text Input */}
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

              {/* Image Upload */}
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

          {/* Analysis Results */}
          {analysisResult && (
            <div className="space-y-8">
              {/* Score Summary */}
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

              {/* Competency Details */}
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

              {/* Errors and Suggestions */}
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

              {/* Action Buttons */}
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
                  Nova Análise
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CorretorRedacao;