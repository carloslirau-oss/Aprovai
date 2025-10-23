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

  // Sample ENEM themes - com contextualização expandida
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
    },
    {
      title: "Proposta de Redação",
      contextualizacao: [
        {
          texto: "O desmatamento na Amazônia atingiu níveis recordes em 2022. Segundo dados do INPE, foram perdidos 11.568 km² de floresta, o maior valor desde 2006. Essa perda impacta diretamente o clima global e a biodiversidade, comprometendo não apenas o ecossistema amazônico, mas também o equilíbrio climático mundial. A Amazônia, conhecida como o pulmão do mundo, está sofrendo uma destruição acelerada que ameaça a vida de milhões de pessoas e a sobrevivência de inúmeras espécies. A exploração predatória de recursos naturais, associada à expansão da agropecuária e à grilagem de terras, são os principais responsáveis por esse cenário alarmante.",
          fonte: "Instituto Nacional de Pesquisas Espaciais (INPE)",
          tamanho: "grande"
        },
        {
          texto: "A economia da região amazônica depende dos recursos naturais, mas o extrativismo sustentável ainda é pouco desenvolvido. Muitas comunidades tradicionais, como indígenas e ribeirinhos, dependem da floresta para sua subsistência, mas enfrentam pressões constantes de grileiros e madeireiros. A falta de políticas públicas que valorizem o conhecimento tradicional e promovam o uso sustentável dos recursos naturais agrava o conflito entre desenvolvimento econômico e conservação ambiental.",
          fonte: "Instituto Socioambiental (ISA)",
          tamanho: "medio"
        },
        {
          texto: "O Brasil tem compromissos internacionais para reduzir o desmatamento, mas a fiscalização e a implementação de políticas ambientais eficazes ainda enfrentam grandes desafios. A falta de recursos para o Ibama e a Polícia Ambiental, associada à impunidade dos crimes ambientais, permite que a destruição da floresta continue avançando sem maiores consequências para os responsáveis.",
          fonte: "Ministério do Meio Ambiente",
          tamanho: "pequeno"
        },
        {
          texto: "A conscientização da população sobre a importância da Amazônia para o planeta e a pressão internacional por ações concretas são fundamentais para reverter esse quadro. A transição para uma economia verde, que valorize a conservação e o uso sustentável dos recursos naturais, é o caminho mais promissor para garantir o futuro da região e do planeta.",
          fonte: "ONU Meio Ambiente",
          tamanho: "pequeno"
        }
      ],
      tema: "O desmatamento da Amazônia e seus impactos socioambientais.",
      instrucoes: "Com base na leitura dos textos motivadores e nos conhecimentos construídos ao longo de sua formação, redija um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema acima.\n\nApresente proposta de intervenção que respeite os direitos humanos.\n\nSelecione, organize e relacione, de forma coerente e coesa, argumentos e fatos para defender seu ponto de vista."
    },
    {
      title: "Proposta de Redação",
      contextualizacao: [
        {
          texto: "A educação a distância (EaD) expandiu-se significativamente durante a pandemia de COVID-19. Segundo o INEP, o número de matrículas na modalidade cresceu 25% em 2020, mas a desigualdade digital permanece como grande desafio. Milhões de estudantes, especialmente das camadas mais vulneráveis, enfrentam dificuldades de acesso à internet e a dispositivos adequados para o aprendizado online. Essa exclusão digital agrava as desigualdades educacionais e sociais, criando um fosso entre aqueles que têm acesso à tecnologia e aqueles que não têm. A pandemia expôs as fragilidades do sistema educacional brasileiro e a necessidade de investimentos urgentes em infraestrutura digital.",
          fonte: "Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira (INEP)",
          tamanho: "grande"
        },
        {
          texto: "A EaD oferece flexibilidade e acesso a educação de qualidade, mas exige investimento em infraestrutura digital e capacitação de professores. Muitas instituições de ensino não estavam preparadas para a transição para o modelo remoto, enfrentando problemas com plataformas tecnológicas, falta de treinamento docente e dificuldades de adaptação metodológica. A qualidade do ensino online depende de recursos adequados e de profissionais preparados para utilizar as ferramentas digitais de forma eficaz.",
          fonte: "Ministério da Educação",
          tamanho: "medio"
        },
        {
          texto: "A falta de acesso à internet de qualidade afeta diretivamente o desempenho dos estudantes, especialmente aqueles de baixa renda. Muitos precisam compartilhar dispositivos com outros membros da família ou dependem de redes Wi-Fi públicas, o que compromete a regularidade e a qualidade do aprendizado. A digitalização da educação sem políticas públicas que garantam acesso universal à tecnologia perpetua as desigualdades sociais.",
          fonte: "UNESCO",
          tamanho: "pequeno"
        },
        {
          texto: "A inclusão digital é fundamental para a democratização do conhecimento e para a redução das desigualdades sociais. Programas que fornecem dispositivos e acesso à internet para estudantes de baixa renda, associados à capacitação digital de professores e alunos, são essenciais para construir um sistema educacional mais justo e inclusivo para todos.",
          fonte: "Fórum Econômico Mundial",
          tamanho: "pequeno"
        }
      ],
      tema: "A expansão da educação a distância e a inclusão digital no Brasil.",
      instrucoes: "Com base na leitura dos textos motivadores e nos conhecimentos construídos ao longo de sua formação, redaja um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema acima.\n\nApresente proposta de intervenção que respeite os direitos humanos.\n\nSelecione, organize e relacione, de forma coerente e coesa, argumentos e fatos para defender seu ponto de vista."
    },
    {
      title: "Proposta de Redação",
      contextualizacao: [
        {
          texto: "O mercado de trabalho no Brasil enfrenta grandes desafios estruturais. Segundo o IBGE, a taxa de desemprego entre jovens de 18 a 24 anos é de 25%, quase o dobro da média nacional. Essa situação reflete uma lacuna significativa entre a formação oferecida pelas escolas e as habilidades demandadas pelo mercado de trabalho. Jovens saem da educação básica e superior sem as competências necessárias para se inserirem no mercado de trabalho formal, o que resulta em subemprego, informalidade e frustração profissional. A falta de oportunidades adequadas para os jovens compromete não apenas seu desenvolvimento individual, mas também o crescimento econômico do país.",
          fonte: "Instituto Brasileiro de Geografia e Estatística (IBGE)",
          tamanho: "grande"
        },
        {
          texto: "A lacuna entre formação e habilidades demandadas é um obstáculo para a empregabilidade. Muitos cursos superiores ainda focam em teorias e conceitos, sem preparar os alunos para as necessidades práticas do mercado de trabalho. A falta de estágios, programas de capacitação e parcerias entre instituições de ensino e empresas agrava esse problema, deixando os jovens despreparados para os desafios do mundo profissional.",
          fonte: "Fórum Econômico Mundial",
          tamanho: "medio"
        },
        {
          texto: "O empreendedorismo é uma alternativa para a geração de empregos e para a melhoria da renda, mas exige apoio político e investimento em educação. Muitos jovens optam por empreender por falta de oportunidades no mercado formal, mas enfrentam dificuldades de acesso a crédito, capacitação e redes de apoio. Programas que incentivam o empreendedorismo juvenil, associados à educação financeira e ao desenvolvimento de habilidades de negócios, são essenciais para fomentar a criação de novas empresas e empregos.",
          fonte: "Sebrae",
          tamanho: "pequeno"
        },
        {
          texto: "Investimento em educação é fundamental para a melhoria da renda e para a redução das desigualdades sociais. Cursos técnicos e profissionalizantes que atendam às demandas do mercado de trabalho, associados a programas de qualificação e reciclagem profissional, são essenciais para preparar os jovens para os desafios do mundo contemporâneo e para promover o desenvolvimento sustentável do país.",
          fonte: "Banco Mundial",
          tamanho: "pequeno"
        }
      ],
      tema: "Desemprego juvenil e a lacuna entre educação e mercado de trabalho.",
      instrucoes: "Com base na leitura dos textos motivadores e nos conhecimentos construídos ao longo de sua formação, redaja um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema acima.\n\nApresente proposta de intervenção que respeite os direitos humanos.\n\nSelecione, organize e relacione, de forma coerente e coesa, argumentos e fatos para defender seu ponto de vista."
    },
    {
      title: "Proposta de Redação",
      contextualizacao: [
        {
          texto: "A saúde mental dos jovens brasileiros tem se deteriorado significativamente. Segundo dados da OMS, 20% dos adolescentes sofrem de algum transtorno mental, mas apenas 30% recebem tratamento adequado. A pandemia de COVID-19 agravou ainda mais essa crise, com aumento de casos de ansiedade, depressão e isolamento social entre jovens. O estigma associado aos problemas de saúde mental continua sendo um grande obstáculo para que os jovens busquem ajuda, muitas vezes por medo de julgamento ou por falta de acesso a serviços especializados. A falta de políticas públicas de saúde mental e a precariedade dos serviços disponíveis deixam milhões de jovens desassistidos.",
          fonte: "Organização Mundial da Saúde (OMS)",
          tamanho: "grande"
        },
        {
          texto: "O estigma associado aos problemas de saúde mental ainda é um grande obstáculo para a busca por ajuda. Muitos jovens sentem-se envergonhados ou medo de serem julgados por seus pares ou pela sociedade. A falta de informação sobre saúde mental e a normalização do sofrimento psicológico contribuem para que os problemas se agravem sem intervenção adequada. A necessidade de campanhas de conscientização e de desestigmatização da saúde mental é cada vez mais evidente.",
          fonte: "Ministério da Saúde",
          tamanho: "medio"
        },
        {
          texto: "A pandemia agravou os problemas de saúde mental entre os jovens. O isolamento social, a incerteza sobre o futuro, as dificuldades escolares e a perda de entes queridos impactaram profundamente o bem-estar psicológico dos adolescentes e jovens adultos. A falta de apoio emocional e de acesso a serviços de saúde mental durante a pandemia deixou muitos jovens em situação de vulnerabilidade.",
          fonte: "Instituto de Pesquisa Econômica Aplicada",
          tamanho: "pequeno"
        },
        {
          texto: "Ações preventivas são essenciais para a promoção da saúde mental. Programas que promovem o bem-estar emocional, o desenvolvimento de habilidades socioemocionais e o acesso a apoio psicológico precoce são fundamentais para prevenir problemas mais graves. A integração da saúde mental nas políticas públicas de saúde e educação é essencial para construir uma sociedade mais saudável e resiliente.",
          fonte: "UNICEF",
          tamanho: "pequeno"
        }
      ],
      tema: "Saúde mental dos jovens brasileiros: desafios e soluções.",
      instrucoes: "Com base na leitura dos textos motivadores e nos conhecimentos construídos ao longo de sua formação, redaja um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema acima.\n\nApresente proposta de intervenção que respeite os direitos humanos.\n\nSelecione, organize e relacione, de forma coerente e coesa, argumentos e fatos para defender seu ponto de vista."
    },
    {
      title: "Proposta de Redação",
      contextualizacao: [
        {
          texto: "A discriminação racial no Brasil persiste de forma estrutural. Segundo dados do IPEA, negros têm 74% menos chances de chegar ao ensino superior que brancos, mesmo com mesma escolaridade. Essa desigualdade reflete um histórico de exclusão que se perpetua ao longo das gerações. As cotas raciais nas universidades têm sido uma ferramenta importante para promover a igualdade de oportunidades, mas ainda enfrentam resistência e desafios de implementação. A representação negra na mídia e nos cargos de poder ainda é insuficiente, perpetuando estereótipos e limitando a visibilidade da população negra.",
          fonte: "Instituto de Pesquisa Econômica Aplicada (IPEA)",
          tamanho: "grande"
        },
        {
          texto: "As cotas raciais são uma ferramenta importante para promover igualdade de oportunidades, mas precisam ser acompanhadas de políticas de qualidade na educação básica. A falta de investimento em escolas públicas de qualidade, especialmente em áreas predominantemente negras, perpetua a desigualdade de acesso ao ensino superior. A necessidade de ações afirmativas que garantam não apenas o acesso, mas também a permanência e o sucesso de estudantes negros nas instituições de ensino é cada vez mais evidente.",
          fonte: "Ministério da Educação",
          tamanho: "medio"
        },
        {
          texto: "A representação negra na mídia e nos cargos de poder ainda é insuficiente. A falta de diversidade nos meios de comunicação e na política perpetua estereótipos e limita a visibilidade das contribuições da população negra para a sociedade brasileira. A necessidade de políticas que incentivem a representação equitativa em todos os espaços de poder é fundamental para construir uma sociedade mais justa e inclusiva.",
          fonte: "Fundação Joaquim Nabuco",
          tamanho: "pequeno"
        },
        {
          texto: "A diversidade é essencial para uma sociedade justa e para o desenvolvimento pleno do país. A valorização da cultura negra, o combate ao racismo estrutural e a promoção da igualdade racial são fundamentais para construir uma nação que respeite e valorize todas as suas raízes e contribuições.",
          fonte: "ONU",
          tamanho: "pequeno"
        }
      ],
      tema: "Racismo estrutural no Brasil: combate e promoção da igualdade racial.",
      instrucoes: "Com base na leitura dos textos motivadores e nos conhecimentos construídos ao longo de sua formação, redaja um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema acima.\n\nApresente proposta de intervenção que respeite os direitos humanos.\n\nSelecione, organize e relacione, de forma coerente e coesa, argumentos e fatos para defender seu ponto de vista."
    },
    {
      title: "Proposta de Redação",
      contextualizacao: [
        {
          texto: "A crise hídrica no Sudeste brasileiro tem se agravado nos últimos anos. Segundo a ANA, 60% das regiões metropolitanas enfrentam racionamento de água, afetando milhões de pessoas. O desperdício de água no Brasil é alarmante, com o brasileiro consome 200 litros por dia, enquanto a média mundial é de 100 litros. A poluição dos rios e reservatórios compromete a qualidade da água disponível, tornando-a imprópria para o consumo humano e para a agricultura. Essa crise reflete uma gestão inadequada dos recursos hídricos e a necessidade de políticas públicas mais eficientes. A falta de investimentos em infraestrutura hídrica, associada à má distribuição dos recursos e ao desperdício, agrava a escassez de água em muitas regiões do país.",
          fonte: "Agência Nacional de Águas (ANA)",
          tamanho: "grande"
        },
        {
          texto: "A falta de conscientização sobre o uso da água é um grande problema. Muitas pessoas ainda não compreendem a importância da conservação dos recursos hídricos e continuam a desperdiçar água em atividades não essenciais. A necessidade de campanhas educativas que promovam a cultura do uso racional da água, associadas a tarifas que incentivem a economia, é fundamental para mudar esse cenário.",
          fonte: "Organização das Nações Unidas para a Alimentação e a Agricultura",
          tamanho: "medio"
        },
        {
          texto: "A gestão dos recursos hídricos precisa ser mais eficiente. A falta de planejamento adequado, a ausência de políticas públicas integradas e a corrupção na gestão dos recursos hídricos comprometem a disponibilidade de água para as atuais e futuras gerações. A necessidade de um modelo de gestão participativa e transparente, que envolva a sociedade civil e os diferentes setores da economia, é essencial para garantir a sustentabilidade dos recursos hídricos.",
          fonte: "Ministério do Meio Ambiente",
          tamanho: "pequeno"
        },
        {
          texto: "A sustentabilidade é essencial para a preservação da água e para o desenvolvimento sustentável do país. A transição para uma economia verde, que valorize a conservação dos recursos naturais e promova o uso sustentável da água, é o caminho mais promissor para garantir a segurança hídrica para as futuras gerações.",
          fonte: "WWF",
          tamanho: "pequeno"
        }
      ],
      tema: "Crise hídrica no Brasil: sustentabilidade e gestão dos recursos hídricos.",
      instrucoes: "Com base na leitura dos textos motivadores e nos conhecimentos construídos ao longo de sua formação, redaja um texto dissertativo
Vou continuar substituindo as logos nos demais arquivos:

<dyad-write path="src/pages/Dashboard.tsx" description="Substituindo logo no header do Dashboard">
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
  Trophy,
  ArrowRight,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/contexts/UserDataContext';
import { showSuccess, showError } from '@/utils/toast';
import Sidebar from '@/components/Sidebar';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { userProfile, redacoes, isLoading, updateUserStats, fetchUserProfile, fetchRedacoes } = useUserData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Função para atualizar os dados manualmente
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await fetchUserProfile();
      await fetchRedacoes();
      showSuccess('Dados atualizados com sucesso!');
    } catch (error) {
      showError('Erro ao atualizar dados. Tente novamente.');
    } finally {
      setIsRefreshing(false);
    }
  };

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

  // Sistema de patentes com requisitos (agora baseado em XP máximo de 250 por redação)
  const patentes = [
    {
      level: 1,
      title: 'Iniciante',
      xpRequired: 0,
      xpNext: 500,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: Star,
      description: 'Sua jornada começa aqui',
      professorTip: 'Ninguém nasce pronto, nem eu quando comecei a corrigir. Vamos começar com estilo, futuro 1000.'
    },
    {
      level: 2,
      title: 'Treineiro',
      xpRequired: 500,
      xpNext: 2000,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: Zap,
      description: 'Você está pegando o ritmo',
      professorTip: 'Está começando a esquentar! Continua assim que o Inep vai pedir o seu autógrafo.'
    },
    {
      level: 3,
      title: 'Competente',
      xpRequired: 2000,
      xpNext: 5000,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      icon: Award,
      description: 'Você escreve como um verdadeiro competente',
      professorTip: 'Agora sim, sua introdução está tão boa que eu quase levantei pra aplaudir. Quase.'
    },
    {
      level: 4,
      title: 'Mestre da Caneta',
      xpRequired: 5000,
      xpNext: 10000,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: Crown,
      description: 'Sua caneta vale ouro',
      professorTip: 'Se escrever mais bonito que isso, o corretor vai querer emoldurar sua redação.'
    },
    {
      level: 5,
      title: 'Nota 1000',
      xpRequired: 10000,
      xpNext: null,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: Trophy,
      description: 'Você alcançou o ápice da redação',
      professorTip: 'Agora você é praticamente uma lenda da caneta. Se Platão visse isso, te chamava pra tomar café.'
    }
  ];

  // Determinar patente atual do usuário
  const determinarPatenteAtual = (xp: number) => {
    for (let i = patentes.length - 1; i >= 0; i--) {
      if (xp >= patentes[i].xpRequired) {
        return patentes[i];
      }
    }
    return patentes[0]; // Padrão: Iniciante
  };

  // Determinar patente atual e próxima
  const patenteAtual = determinarPatenteAtual(userProfile?.xp_total || 0);
  const patenteProxima = patentes[patenteAtual.level] || null;

  // Calcular progresso para a próxima patente
  const progressoProximaPatente = patenteProxima ? 
    Math.min(100, ((userProfile?.xp_total || 0 - patenteAtual.xpRequired) / (patenteProxima.xpRequired - patenteAtual.xpRequired)) * 100) : 100;

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

  // Dados para gráficos (agora com base em XP máximo de 250)
  const notasData = redacoes.map((redacao, index) => ({
    name: `Redação ${index + 1}`,
    nota: redacao.nota_total || 0,
    data: redacao.created_at ? new Date(redacao.created_at).toLocaleDateString() : 'Data não disponível'
  }));

  const competenciasData = redacoes.length > 0 ? [
    {
      name: 'Domínio da Modalidade',
      media: redacoes.reduce((sum, r) => sum + (r.competencia_1 || 0), 0) / redacoes.length,
      max: 50 // Agora cada competência vale no máximo 50 pontos
    },
    {
      name: 'Compreensão da Tarefa',
      media: redacoes.reduce((sum, r) => sum + (r.competencia_2 || 0), 0) / redacoes.length,
      max: 50
    },
    {
      name: 'Coerência e Coesão',
      media: redacoes.reduce((sum, r) => sum + (r.competencia_3 || 0), 0) / redacoes.length,
      max: 50
    },
    {
      name: 'Recursos de Linguagem',
      media: redacoes.reduce((sum, r) => sum + (r.competencia_4 || 0), 0) / redacoes.length,
      max: 50
    },
    {
      name: 'Proposta de Intervenção',
      media: redacoes.reduce((sum, r) => sum + (r.competencia_5 || 0), 0) / redacoes.length,
      max: 50
    }
  ] : [];

  const evolucaoXP = redacoes.map((redacao, index) => ({
    redacao: index + 1,
    xp: redacao.nota_total || 0,
    acumulado: redacoes.slice(0, index + 1).reduce((sum, r) => sum + (r.nota_total || 0), 0)
  }));

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
                {/* Logo do Supabase */}
                <img 
                  src="https://ugdpjgftmhyurrmfzdux.supabase.co/storage/v1/object/public/imagens/logo%2001" 
                  alt="Logo" 
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDJDNi40OCAyIDIgNi40OCAySDEyVjIwSDEyVjIwWiIgZmlsbD0iIzAwMCIvPgo8cGF0aCBkPSJNMTIgMkM3LjQ4IDEgNy40OCA3LjQ4IDEgMTIgMTJDMTIgNy40OCAxMiA3LjQ4IDEyIDEyWiIgZmlsbD0iIzAwMCIvPgo8L3N2Zz4K';
                  }}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.user_metadata?.name || 'João da Silva'}
                  </p>
                  <div className="flex items-center space-x-1">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs text-gray-500">{patenteAtual.title}</span>
                  </div>
                </div>
              </div>
              
              {/* Barra de progresso de patente */}
              {patenteAtual.level < 5 && patenteProxima && (
                <div className="flex-1 max-w-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Progresso:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressoProximaPatente}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-blue-600">
                      {Math.round(progressoProximaPatente)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {userProfile?.xp_total?.toLocaleString() || '0'} / {patenteProxima.xpRequired.toLocaleString()} XP
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
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
        <main className="flex-1 flex flex-col">
          <div className="px-4 sm:px:6 lg:px-8 py-8">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta, {user?.user_metadata?.name?.split(' ')[0] || 'João'}!</h2>
                  <p className="text-gray-600">Continue seu treinamento e alcance a nota 1000 no ENEM</p>
                </div>
                <Button
                  onClick={handleRefreshData}
                  disabled={isRefreshing}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isRefreshing ? 'Atualizando...' : 'Atualizar Dados'}</span>
                </Button>
              </div>
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

            {/* Gráficos de Desempenho */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Gráfico de Evolução de Notas (agora com base em 250 pontos) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="h-5 w-5 mr-2 text-blue-600" />
                    Evolução das Notas (XP)
                  </CardTitle>
                  <CardDescription>
                    Sua progressão ao longo das redações (máx. 250 XP por redação)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 overflow-x-auto">
                    {notasData.length > 0 ? (
                      <div className="min-w-max space-y-2">
                        {notasData.map((nota, index) => (
                          <div key={index} className="flex items-center justify-between min-w-max">
                            <span className="text-sm text-gray-600 whitespace-nowrap">{nota.name}</span>
                            <div className="flex items-center space-x-2 min-w-max">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${(nota.nota / 250) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-blue-600 whitespace-nowrap">{nota.nota}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        Nenhuma redação corrigida ainda. Comece a praticar!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de Competências (agora com base em 50 pontos) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                    Desempenho por Competência
                  </CardTitle>
                  <CardDescription>
                    Média de desempenho em cada competência (máx. 50 XP por competência)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {competenciasData.length > 0 ? (
                      <div className="space-y-3">
                        {competenciasData.map((competencia, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-700">{competencia.name}</span>
                              <span className="font-medium">{Math.round(competencia.media)}/{competencia.max}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${(competencia.media / competencia.max) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        Complete redações para ver seu desempenho por competência.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de XP Acumulado (agora com base em 250) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-purple-600" />
                    XP Acumulado
                  </CardTitle>
                  <CardDescription>
                    Seu progresso de experiência ao longo do tempo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 overflow-x-auto">
                    {evolucaoXP.length > 0 ? (
                      <div className="min-w-max space-y-2">
                        {evolucaoXP.map((item, index) => (
                          <div key={index} className="flex items-center justify-between min-w-max">
                            <span className="text-sm text-gray-600 whitespace-nowrap">Redação {item.redacao}</span>
                            <div className="flex items-center space-x-2 min-w-max">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-600 h-2 rounded-full" 
                                  style={{ width: `${(item.acumulado / 10000) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-purple-600 whitespace-nowrap">{item.acumulado}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        Complete redações para ver seu progresso de XP.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de Distribuição de Notas (agora com base em 250) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-orange-600" />
                    Distribuição de Notas (XP)
                  </CardTitle>
                  <CardDescription>
                    Faixa de notas mais frequentes (máx. 250 XP por redação)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notasData.length > 0 ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">0-150 XP</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-600 h-2 rounded-full" 
                                style={{ width: `${(notasData.filter(n => n.nota < 150).length / notasData.length) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{notasData.filter(n => n.nota < 150).length}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">150-200 XP</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-600 h-2 rounded-full" 
                                style={{ width: `${(notasData.filter(n => n.nota >= 150 && n.nota < 200).length / notasData.length) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{notasData.filter(n => n.nota >= 150 && n.nota < 200).length}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">200-250 XP</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${(notasData.filter(n => n.nota >= 200).length / notasData.length) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{notasData.filter(n => n.nota >= 200).length}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        Complete redações para ver a distribuição de notas.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Rank Section - Simplificado */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Sua Patente Atual</h3>
              <Card className={`border-2 ${patenteAtual.borderColor} ${patenteAtual.bgColor}`}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${patenteAtual.bgColor}`}>
                      <patenteAtual.icon className={`h-8 w-8 ${patenteAtual.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-2xl flex items-center">
                        {patenteAtual.title}
                        {patenteAtual.level < 5 && (
                          <span className="ml-2 text-sm text-gray-500">
                            (Patente {patenteAtual.level} de 5)
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription className="text-base">{patenteAtual.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Professor Tip */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-blue-600">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-bold">C</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-800 mb-1">Professor Carlinhos:</p>
                          <p className="text-blue-700 italic">"{patenteAtual.professorTip}"</p>
                        </div>
                      </div>
                    </div>

                    {/* Next Rank Info - Simplificado */}
                    {patenteAtual.level < 5 && patenteProxima && (
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <h4 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center">
                          <ArrowRight className="h-5 w-5 mr-2" />
                          Próxima Patente: {patenteProxima.title}
                        </h4>
                        <p className="text-yellow-700">
                          Para alcançar a patente <strong>{patenteProxima.title}</strong>, acumule <strong>{patenteProxima.xpRequired.toLocaleString()} pontos de XP</strong>.
                        </p>
                        <p className="text-yellow-600 text-sm mt-2">
                          Cada redação vale até 250 XP (50 XP por competência). Continue praticando para melhorar seu desempenho!
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;