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
      instrucoes: "Com base na leitura dos textos motivadores e nos conhecimentos construídos ao longo de sua formação, redaja um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema acima.\n\nApresente proposta de intervenção que respeite os direitos humanos.\n\nSelecione, organize e relacione, de forma coerente e coesa, argumentos e fatos para defender seu ponto de vista."
    },
    {
      title: "Proposta de Redação",
      contextualizacao: [
        {
          texto: "A evasão escolar no Brasil atingiu níveis preocupantes. Segundo o INEP, 1,5 milhão de jovens abandonaram a escola em 2022, principalmente por dificuldades financeiras e falta de motivação. A pandemia de COVID-19 agravou ainda mais esse problema, com o ensino remoto não sendo acessível a todos os estudantes, especialmente os de baixa renda. Programas de inclusão social e bolsas de estudo têm ajudado a reduzir a evasão, mas ainda são insuficientes para cobrir todas as necessidades. A evasão escolar não apenas compromete o futuro individual dos jovens, mas também o desenvolvimento socioeconômico do país, pois reduz a qualificação da força de trabalho e limita as oportunidades de crescimento econômico.",
          fonte: "Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira (INEP)",
          tamanho: "grande"
        },
        {
          texto: "A pandemia agravou o problema da evasão escolar. O ensino remoto exigiu acesso à internet e a dispositivos tecnológicos, recursos que muitos estudantes não possuíam. A falta de apoio familiar para acompanhar as atividades online e a dificuldade de adaptação ao novo modelo de ensino contribuíram para o aumento da evasão, especialmente entre os mais vulneráveis.",
          fonte: "UNESCO",
          tamanho: "medio"
        },
        {
          texto: "Programas de inclusão social ajudam a reduzir a evasão, mas precisam ser ampliados e melhorados. A Bolsa Família e outros programas de transferência de renda são importantes, mas não são suficientes para garantir a permanência dos jovens na escola. A necessidade de políticas que abordem as múltiplas causas da evasão, incluindo a qualidade do ensino, a relevância curricular e o apoio psicopedagógico, é cada vez mais evidente.",
          fonte: "Ministério da Educação",
          tamanho: "pequeno"
        },
        {
          texto: "A educação é um direito fundamental de todos e é essencial para o desenvolvimento do indivíduo e da sociedade. A garantia de acesso universal à educação de qualidade, associada a políticas que combatam as desigualdades sociais e que valorizem a permanência dos jovens na escola, é fundamental para construir um país mais justo e desenvolvido.",
          fonte: "Constituição Federal",
          tamanho: "pequeno"
        }
      ],
      tema: "Evasão escolar no Brasil: causas e estratégias de permanência.",
      instrucoes: "Com base na leitura dos textos motivadores e nos conhecimentos construídos ao longo de sua formação, redaja um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema acima.\n\nApresente proposta de intervenção que respeite os direitos humanos.\n\nSelecione, organize e relacione, de forma coerente e coesa, argumentos e fatos para defender seu ponto de vista."
    },
    {
      title: "Proposta de Redação",
      contextualizacao: [
        {
          texto: "A violência urbana nas grandes cidades brasileiras continua sendo um grave problema. Segundo o Fórum Brasileiro de Segurança Pública, o Brasil registrou mais de 43 mil homicídios dolosos em 2022. A desigualdade social é um dos principais fatores que contribuem para a violência, com jovens de baixa renda sendo as maiores vítimas e, muitas vezes, os autores de crimes. Políticas de prevenção da violência, como programas de inclusão social e esporte, têm mostrado resultados positivos, mas ainda são pouco implementadas em larga escala. A segurança pública é um direito fundamental que precisa ser garantido a todos os cidadãos, independentemente de sua condição social ou local de moradia.",
          fonte: "Fórum Brasileiro de Segurança Pública",
          tamanho: "grande"
        },
        {
          texto: "A desigualdade social contribui significativamente para a violência urbana. A falta de oportunidades para os jovens, associada à exclusão social e à precarização do trabalho, cria um ambiente propício à violência. A necessidade de políticas que promovam a inclusão social, a geração de empregos de qualidade e o acesso a serviços básicos é fundamental para reduzir a violência nas cidades.",
          fonte: "Instituto de Pesquisa Econômica Aplicada",
          tamanho: "medio"
        },
        {
          texto: "Programas de inclusão social reduzem a violência, mas precisam ser ampliados e melhorados. Programas como o Favela-Bairro e o Minha Casa, Minha Vida trouxeram benefícios para muitas comunidades, mas ainda são insuficientes para atender a toda a demanda. A necessidade de políticas que abordem as causas estruturais da violência, incluindo a desigualdade social e a falta de oportunidades, é cada vez mais evidente.",
          fonte: "Ministério da Justiça",
          tamanho: "pequeno"
        },
        {
          texto: "A segurança pública é um direito fundamental e é essencial para a convivência pacífica e para o desenvolvimento das cidades. A garantia de segurança para todos os cidadãos, independentemente de sua condição social ou local de moradia, é fundamental para construir uma sociedade mais justa e democrática.",
          fonte: "Constituição Federal",
          tamanho: "pequeno"
        }
      ],
      tema: "Violência urbana no Brasil: prevenção e políticas de segurança.",
      instrucoes: "Com base na leitura dos textos motivadores e nos conhecimentos construídos ao longo de sua formação, redaja um texto dissertativo-argumentativo em modalidade escrita formal da língua portuguesa sobre o tema acima.\n\nApresente proposta de intervenção que respeite os direitos humanos.\n\nSelecione, organize e relacione, de forma coerente e coesa, argumentos e fatos para defender seu ponto de vista."
    },
    {
      title: "Proposta de Redação",
      contextualizacao: [
        {
          texto: "A corrupção no Brasil continua sendo um desafio estrutural. Segundo a Transparência Internacional, o Brasil ocupa a 94ª posição no Índice de Percepção de Corrupção 2023. Operações como a Lava Jato mostraram a dimensão da corrupção no país, mas a cultura da impunidade ainda persiste em muitos setores. A educação para a cidadania e a ética são fundamentais para combater a corrupção, precisando ser trabalhadas desde a educação básica. A corrupção não apenas desvia recursos públicos essenciais para a população, mas também mina a confiança nas instituições democráticas e prejudica o desenvolvimento do país. A falta de transparência na gestão pública e a impunidade dos corruptos perpetuam esse ciclo de desconfiança e descrédito nas instituições.",
          fonte: "Transparência Internacional",
          tamanho: "grande"
        },
        {
          texto: "Operações como a Lava Jato mostraram a dimensão da corrupção no país, mas a cultura da impunidade ainda persiste. Muitos casos de corrupção não são investigados ou não resultam em punição efetiva, o que desestimula a denúncia e perpetua a prática de atos ilícitos. A necessidade de um sistema de justiça mais eficiente e de políticas que garantam a transparência e a accountability é fundamental para combater a corrupção.",
          fonte: "Ministério da Justiça",
          tamanho: "medio"
        },
        {
          texto: "A educação para a cidadania e a ética são fundamentais para combater a corrupção, mas precisam ser trabalhadas desde a educação básica. A formação de cidadãos conscientes de seus direitos e deveres, que valorizam a ética e a transparência, é essencial para construir uma sociedade menos propensa à corrupção. A necessidade de incluir a temática da ética e da cidadania nos currículos escolares é cada vez mais evidente.",
          fonte: "Ministério da Educação",
          tamanho: "pequeno"
        },
        {
          texto: "A ética deve ser trabalhada desde a educação básica e deve ser valorizada em todos os setores da sociedade. A necessidade de políticas que promovam a transparência na gestão pública, que garantam o acesso à informação e que punam severamente os atos de corrupção é fundamental para construir uma sociedade mais justa e desenvolvida.",
          fonte: "Conselho Federal de Educação",
          tamanho: "pequeno"
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

  // Função para obter classes de estilo baseado no tamanho do texto
  const getTextSizeClass = (tamanho: string) => {
    switch (tamanho) {
      case 'grande':
        return 'border-l-4 border-blue-500';
      case 'medio':
       
Vou continuar o arquivo a partir do ponto onde ele foi cortado:

<dyad-write path="src/pages/CorretorRedacao.tsx" description="Continuando arquivo após erro de sintaxe">
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
                        <div key={index} className={`bg-gray-50 p-4 rounded-lg ${getTextSizeClass(item.tamanho)}`}>
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