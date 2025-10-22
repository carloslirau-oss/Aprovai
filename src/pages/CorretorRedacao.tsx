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
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 hours in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [selectedTime, setSelectedTime] = useState(180); // Tempo selecionado nas configurações
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

  // Sample ENEM themes - expandido com mais temas
  const redacaoThemes = [
    {
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
    },
    {
      title: "Proposta de Redação",
      contextualizacao: [
        {
          texto: "O desmatamento na Amazônia atingiu níveis recordes em 2022. Segundo dados do INPE, foram perdidos 11.568 km² de floresta, o maior valor desde 2006. Essa perda impacta diretamente o clima global e a biodiversidade.",
          fonte: "Instituto Nacional de Pesquisas Espaciais (INPE)"
        },
        {
          texto: "A economia da região amazônica depende dos recursos naturais, mas o extrativismo sustentável ainda é pouco desenvolvido. Muitas comunidades tradicionais dependem da floresta para sua subsistência.",
          fonte: "Instituto Socioambiental (ISA)"
        },
        {
          texto: "O Brasil tem compromissos internacionais para reduzir o desmatamento, mas a fiscalização e a implementação de políticas ambientais eficazes ainda enfrentam grandes desafios.",
          fonte: "Ministério do Meio Ambiente"
        }
      ],
      tema: "O desmatamento da Amazônia e seus impactos socioambientais.",
      instrucoes: "Com base na leitura dos textos motivadores e nos conhecimentos construídos ao longo de sua formação, redija um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema acima.\n\nApresente proposta de intervenção que respeite os direitos humanos.\n\nSelecione, organize e relacione, de forma coerente e coesa, argumentos e fatos para defender seu ponto de vista."
    },
    {
      title: "Proposta de Redação",
      contextualizacao: [
        {
          texto: "A educação a distância (EaD) expandiu-se significativamente durante a pandemia de COVID-19. Segundo o INEP, o número de matrículas na modalidade cresceu 25% em 2020, mas a desigualdade digital permanece como grande desafio.",
          fonte: "Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira (INEP)"
        },
        {
          texto: "Muitos estudantes, especialmente das camadas mais vulneráveis, enfrentam dificuldades de acesso à internet e a dispositivos adequados para o aprendizado online. Essa exclusão digital agrava as desigualdades educacionais.",
          fonte: "UNESCO"
        },
        {
          texto: "A EaD oferece flexibilidade e acesso a educação de qualidade, mas exige investimento em infraestrutura digital e capacitação de professores para garantir efetividade pedagógica.",
          fonte: "Ministério da Educação"
        }
      ],
      tema: "A expansão da educação a distância e a inclusão digital no Brasil.",
      instrucoes: "Com base na leitura dos textos motivadores e nos conhecimentos construídos ao longo de sua formação, redaja um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema acima.\n\nApresente proposta de intervenção que respeite os direitos humanos.\n\nSelecione, organize e relacione, de forma coerente e coesa, argumentos e fatos para defender seu ponto de vista."
    },
    {
      title: "Proposta de Redação",
      contextualizacao: [
        {
          texto: "O mercado de trabalho no Brasil enfrenta grandes desafios estruturais. Segundo o IBGE, a taxa de desemprego entre jovens de 18 a 24 anos é de 25%, quase o dobro da média nacional.",
          fonte: "Instituto Brasileiro de Geografia e Estatística (IBGE)"
        },
        {
          texto: "A lacuna entre a formação oferecida pelas escolas e as habilidades demandadas pelo mercado de trabalho é um dos principais obstáculos para a empregabilidade dos jovens.",
          fonte: "Fórum Econômico Mundial"
        },
        {
          texto: "O empreendedorismo e a qualificação profissional são caminhos importantes para a geração de empregos e a melhoria da renda, mas exigem apoio político e investimento em educação.",
          fonte: "Sebrae"
        }
      ],
      tema: "Desemprego juvenil e a lacuna entre educação e mercado de trabalho.",
      instrucoes: "Com base na leitura dos textos motivadores e nos conhecimentos construídos ao longo de sua formação, redaja um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema acima.\n\nApresente proposta de intervenção que respeite os direitos humanos.\n\nSelecione, organize e relacione, de forma coerente e coesa, argumentos e fatos para defender seu ponto de vista."
    },
    {
      title: "Proposta de Redação",
      contextualizacao: [
        {
          texto: "A saúde mental dos jovens brasileiros tem se deteriorado significativamente. Segundo dados da OMS, 20% dos adolescentes sofrem de algum transtorno mental, mas apenas 30% recebem tratamento adequado.",
          fonte: "Organização Mundial da Saúde (OMS)"
        },
        {
          texto: "O estigma associado aos problemas de saúde mental ainda é um grande obstáculo para que os jovens busquem ajuda. Muitos sentem-se envergonhados ou medo de julgamento.",
          fonte: "Ministério da Saúde"
        },
        {
          texto: "A pandemia de COVID-19 agravou os problemas de saúde mental, com aumento de casos de ansiedade, depressão e isolamento social entre jovens.",
          fonte: "Instituto de Pesquisa Econômica Aplicada (IPEA)"
        }
      ],
      tema: "Saúde mental dos jovens brasileiros: desafios e soluções.",
      instrucoes: "Com base na leitura dos textos motivadores e nos conhecimentos construídos ao longo de sua formação, redaja um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema acima.\n\nApresente proposta de intervenção que respeite os direitos humanos.\n\nSelecione, organize e relacione, de forma coerente e coesa, argumentos e fatos para defender seu ponto de vista."
    },
    {
      title: "Proposta de Redação",
      contextualizacao: [
        {
          texto: "A discriminação racial no Brasil persiste de forma estrutural. Segundo dados do IPEA, negros têm 74% menos chances de chegar ao ensino superior que brancos, mesmo com mesma escolaridade.",
          fonte: "Instituto de Pesquisa Econômica Aplicada (IPEA)"
        },
        {
          texto: "As cotas raciais nas universidades têm sido uma ferramenta importante para promover a igualdade de oportunidades, mas ainda enfrentam resistência e desafios de implementação.",
          fonte: "Ministério da Educação"
        },
        {
          texto: "A representação negra na mídia e nos cargos de poder ainda é insuficiente, perpetuando estereótipos e limitando a visibilidade da população negra.",
          fonte: "Fundação Joaquim Nabuco"
        }
      ],
      tema: "Racismo estrutural no Brasil: combate e promoção da igualdade racial.",
      instrucoes: "Com base na leitura dos textos motivadores e nos conhecimentos construídos ao longo de sua formação, redaja um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema acima.\n\nApresente proposta de intervenção que respeite os direitos humanos.\n\nSelecione, organize e relacione, de forma coerente e coesa, argumentos e fatos para defender seu ponto de vista."
    },
    {
      title: "Proposta de Redação",
      contextualizacao: [
        {
          texto: "A crise hídrica no Sudeste brasileiro tem se agravado nos últimos anos. Segundo a ANA, 60% das regiões metropolitanas enfrentam racionamento de água, afetando milhões de pessoas.",
          fonte: "Agência Nacional de Águas (ANA)"
        },
        {
          texto: "O desperdício de água no Brasil é alarmante. O brasileiro consome 200 litros por dia, enquanto a média mundial é de 100 litros. A falta de conscientização é um grande problema.",
          fonte: "Organização das Nações Unidas para a Alimentação e a Agricultura (FAO)"
        },
        {
          texto: "A poluição dos rios e reservatórios compromete a qualidade da água disponível, tornando-a imprópria para o consumo humano e para a agricultura.",
          fonte: "Ministério do Meio Ambiente"
        }
      ],
      tema: "Crise hídrica no Brasil: sustentabilidade e gestão dos recursos hídricos.",
      instrucoes: "Com base na leitura dos textos motivadores e nos conhecimentos construídos ao longo de sua formação, redaja um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema acima.\n\nApresente proposta de intervenção que respeite os direitos humanos.\n\nSelecione, organize e relacione, de forma coerente e coesa, argumentos e fatos para defender seu ponto de vista."
    },
    {
      title: "Proposta de Redação",
      contextualizacao: [
        {
          texto: "A evasão escolar no Brasil atingiu níveis preocupantes. Segundo o INEP, 1,5 milhão de jovens abandonaram a escola em 2022, principalmente por dificuldades financeiras e falta de motivação.",
          fonte: "Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira (INEP)"
        },
        {
          texto: "A pandemia agravou o problema, com o ensino remoto não sendo acessível a todos os estudantes, especialmente os de baixa renda.",
          fonte: "UNESCO"
        },
        {
          texto: "Programas de inclusão social e bolsas de estudo têm ajudado a reduzir a evasão, mas ainda são insuficientes para cobrir todas as necessidades.",
          fonte: "Ministério da Educação"
        }
      ],
      tema: "Evasão escolar no Brasil: causas e estratégias de permanência.",
      instrucoes: "Com base na leitura dos textos motivadores e nos conhecimentos construidos ao longo de sua formação, redaja um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema acima.\n\nApresente proposta de intervenção que respeite os direitos humanos.\n\nSelecione, organize e relacione, de forma coerente e coesa, argumentos e fatos para defender seu ponto de vista."
    },
    {
      title: "Proposta de Redação",
      contextualizacao: [
        {
          texto: "A violência urbana nas grandes cidades brasileiras continua sendo um grave problema. Segundo o Fórum Brasileiro de Segurança Pública, o Brasil registrou mais de 43 mil homicídios dolosos em 2022.",
          fonte: "Fórum Brasileiro de Segurança Pública"
        },
        {
          texto: "A desigualdade social é um dos principais fatores que contribuem para a violência. Jovens de baixa renda são as maiores vítimas e, muitas vezes, os autores de crimes.",
          fonte: "Instituto de Pesquisa Econômica Aplicada (IPEA)"
        },
        {
          texto: "Políticas de prevenção da violência, como programas de inclusão social e esporte, têm mostrado resultados positivos, mas ainda são pouco implementadas em larga escala.",
          fonte: "Ministério da Justiça"
        }
      ],
      tema: "Violência urbana no Brasil: prevenção e políticas de segurança.",
      instrucoes: "Com base na leitura dos textos motivadores e nos conhecimentos construídos ao longo de sua formação, redaja um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema acima.\n\nApresente proposta de intervenção que respeite os direitos humanos.\n\nSelecione, organize e relacione, de forma coerente e coesa, argumentos e fatos para defender seu ponto de vista."
    },
    {
      title: "Proposta de Redação",
      contextualizacao: [
        {
          texto: "A corrupção no Brasil continua sendo um desafio estrutural. Segundo a Transparência Internacional, o Brasil ocupa a 94ª posição no Índice de Percepção de Corrupção 2023.",
          fonte: "Transparência Internacional"
        },
        {
          texto: "Operações como a Lava Jato mostraram a dimensão da corrupno país, mas a cultura da impunidade ainda persiste em muitos setores.",
          fonte: "Ministério da Justiça"
        },
        {
          texto: "A educação para a cidadania e a ética são fundamentais para combater a corrupção, precisando ser trabalhadas desde a educação básica.",
          fonte: "Ministério da Educação"
        }
      ],
      tema: "Corrupção no Brasil: combate e fortalecimento da ética pública.",
      instrucoes: "Com base na leitura dos textos motivadores e nos conhecimentos construídos ao longo de sua formação, redaja um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema acima.\n\nApresente proposta de intervenção que respeite os direitos humanos.\n\nSelecione, organize e relacione, de forma coerente e coesa, argumentos e fatos para defender seu ponto de vista."
    }
  ];

  // Estados para controle de temas
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [themeHistory, setThemeHistory] = useState<number[]>([]);
  const redacaoTheme = redacaoThemes[currentThemeIndex];

  // Função para gerar um tema aleatório
  const generateRandomTheme = () => {
    const newIndex = Math.floor(Math.random() * redacaoThemes.length);
    setCurrentThemeIndex(newIndex);
    setThemeHistory(prev => [...prev, newIndex]);
    return newIndex;
  };

  // Função para voltar ao tema anterior
  const goToPreviousTheme = () => {
    if (themeHistory.length > 0) {
      const previousIndex = themeHistory[themeHistory.length - 1];
      setCurrentThemeIndex(previousIndex);
      setThemeHistory(prev => prev.slice(0, -1));
    }
  };

  // Função para mudar para um tema aleatório
  const goToRandomTheme = () => {
    const newIndex = Math.floor(Math.random() * redacaoThemes.length);
    setCurrentThemeIndex(newIndex);
    setThemeHistory(prev => [...prev, newIndex]);
  };

  // Gerar tema aleatório ao carregar a página
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

  const saveRedacao = async () => {
    if (!analysisResult) return;
    
    try {
      // Salvar a redação no Supabase
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
    setSelectedTime(minutes * 60); // Convert minutes to seconds
    setTimeRemaining(minutes * 60); // Atualiza o tempo restante imediatamente
    setShowTimeOptions(false); // Fecha as opções de tempo
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
                <BookOpen className="h-6 w-6" />
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

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <div className="px-4 sm:px:6 lg:px-8 py-8">
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
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    {redacaoTheme.title}
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Botão para voltar ao tema anterior */}
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
                    {/* Botão para mudar para tema aleatório */}
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
                {/* Timer with Time Options */}
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

                    {/* Time Options Bar */}
                    {showTimeOptions && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Escolha o tempo para redação:</h4>
                        
                        {/* Quick Time Options */}
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

                        {/* Custom Time Input */}
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
                      // Gera um novo tema automaticamente
                      goToRandomTheme();
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