"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { ICONE_BRANCO, ICONE_PRETO } from '@/assets/logoIcon';
import {
  Library,
  Menu,
  Search,
  Trophy,
  BookMarked,
  Scale,
  GraduationCap,
  ExternalLink,
  CalendarDays,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/Sidebar';

interface Redacao {
  id: string;
  titulo: string;
  ano: number;
  tema: string;
  categoria: string;
  nota: number;
  autor: string | null;
  resumo: string;
  fonte_nome: string | null;
  fonte_url: string | null;
}

interface TemaOficial {
  id: string;
  ano: number;
  tema: string;
  eixo_tematico: string | null;
  aplicacao?: string | null;
}

interface Repertorio {
  id: string;
  nome: string;
  tipo: string;
  descricao: string;
  temas_relacionados: string[] | null;
  fonte_url: string | null;
}

interface Modelo {
  id: string;
  tipo: string;
  titulo: string;
  conteudo: string;
  exemplo: string | null;
}

type Aba = 'redacoes' | 'temas' | 'repertorios' | 'modelos';

const CATEGORIA_LABEL: Record<string, string> = {
  nota_1000: 'Nota 1000',
  nota_alta: 'Nota alta',
  modelo_didatico: 'Modelo didático',
};

const Biblioteca = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const logoUrl = theme === 'dark' ? ICONE_BRANCO : ICONE_PRETO;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [aba, setAba] = useState<Aba>('redacoes');
  const [busca, setBusca] = useState('');
  const [filtroAno, setFiltroAno] = useState<string>('todos');
  const [filtroNota, setFiltroNota] = useState<string>('todas');

  const [redacoes, setRedacoes] = useState<Redacao[]>([]);
  const [temas, setTemas] = useState<TemaOficial[]>([]);
  const [repertorios, setRepertorios] = useState<Repertorio[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      setIsLoading(true);
      const [r1, r2, r3, r4] = await Promise.all([
        supabase.from('biblioteca_redacoes').select('*').order('nota', { ascending: false }),
        supabase.from('biblioteca_temas').select('*').order('ano', { ascending: false }),
        supabase.from('biblioteca_repertorios').select('*').order('nome', { ascending: true }),
        supabase.from('biblioteca_modelos').select('*').order('titulo', { ascending: true }),
      ]);
      setRedacoes(r1.data || []);
      setTemas(r2.data || []);
      setRepertorios(r3.data || []);
      setModelos(r4.data || []);
      setIsLoading(false);
    };
    carregar();
  }, []);

  const anosDisponiveis = useMemo(() => {
    const anos = new Set<number>([...redacoes.map(r => r.ano), ...temas.map(t => t.ano)]);
    return Array.from(anos).sort((a, b) => b - a);
  }, [redacoes, temas]);

  const redacoesFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return redacoes.filter(r => {
      if (filtroAno !== 'todos' && String(r.ano) !== filtroAno) return false;
      if (filtroNota === '1000' && r.nota < 1000) return false;
      if (filtroNota === '900' && r.nota < 900) return false;
      if (termo && !(`${r.titulo} ${r.tema} ${r.autor || ''}`.toLowerCase().includes(termo))) return false;
      return true;
    });
  }, [redacoes, busca, filtroAno, filtroNota]);

  const temasFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return temas.filter(t => {
      if (filtroAno !== 'todos' && String(t.ano) !== filtroAno) return false;
      if (termo && !(`${t.tema} ${t.eixo_tematico || ''}`.toLowerCase().includes(termo))) return false;
      return true;
    });
  }, [temas, busca, filtroAno]);

  const repertoriosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return repertorios.filter(r => {
      if (!termo) return true;
      const temasRel = (r.temas_relacionados || []).join(' ');
      return `${r.nome} ${r.descricao} ${temasRel}`.toLowerCase().includes(termo);
    });
  }, [repertorios, busca]);

  const modelosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return modelos.filter(m => {
      if (!termo) return true;
      return `${m.titulo} ${m.conteudo}`.toLowerCase().includes(termo);
    });
  }, [modelos, busca]);

  const abas: { id: Aba; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'redacoes', label: 'Redações', icon: Trophy },
    { id: 'temas', label: 'Temas anteriores', icon: CalendarDays },
    { id: 'repertorios', label: 'Repertórios', icon: Scale },
    { id: 'modelos', label: 'Guias e modelos', icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="lg:hidden">
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src={logoUrl}
                alt="Logo"
                className="w-6 h-6 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.outerHTML = `
                    <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span class="text-white text-xs font-bold">A</span>
                    </div>
                  `;
                }}
              />
              <p className="text-xs font-medium text-gray-900 hidden sm:block">Biblioteca</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Library className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Biblioteca de Redações</h1>
              <p className="text-sm text-gray-600">
                Redações nota alta, temas de edições anteriores, repertórios e guias — explore e aprenda com exemplos reais.
              </p>
            </div>
          </div>

          {/* Abas */}
          <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
            {abas.map((a) => {
              const Icon = a.icon;
              const ativo = aba === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => { setAba(a.id); setBusca(''); setFiltroAno('todos'); setFiltroNota('todas'); }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    ativo ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{a.label}</span>
                </button>
              );
            })}
          </div>

          {/* Busca e filtros */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder={
                  aba === 'redacoes' ? 'Buscar por título, tema ou autor...' :
                  aba === 'temas' ? 'Buscar por tema ou eixo temático...' :
                  aba === 'repertorios' ? 'Buscar por repertório...' :
                  'Buscar por guia...'
                }
                className="pl-9"
              />
            </div>
            {(aba === 'redacoes' || aba === 'temas') && (
              <select
                value={filtroAno}
                onChange={(e) => setFiltroAno(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-700"
              >
                <option value="todos">Todos os anos</option>
                {anosDisponiveis.map((ano) => (
                  <option key={ano} value={ano}>{ano}</option>
                ))}
              </select>
            )}
            {aba === 'redacoes' && (
              <select
                value={filtroNota}
                onChange={(e) => setFiltroNota(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-700"
              >
                <option value="todas">Qualquer nota</option>
                <option value="1000">Nota 1000</option>
                <option value="900">900 ou mais</option>
              </select>
            )}
          </div>

          {isLoading ? (
            <p className="text-sm text-gray-500 text-center py-12">Carregando biblioteca...</p>
          ) : (
            <>
              {/* Redações */}
              {aba === 'redacoes' && (
                redacoesFiltradas.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-12">Nenhuma redação encontrada com esses filtros.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {redacoesFiltradas.map((r) => (
                      <Card
                        key={r.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => navigate(`/biblioteca/redacao/${r.id}`)}
                      >
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500">{r.ano}</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              r.nota >= 1000 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {r.nota}/1000
                            </span>
                          </div>
                          <h3 className="text-sm font-semibold text-gray-900 leading-snug">{r.titulo}</h3>
                          <p className="text-xs text-gray-500 line-clamp-2">{r.tema}</p>
                          <p className="text-xs text-gray-600 line-clamp-3">{r.resumo}</p>
                          {r.fonte_nome && (
                            <p className="text-xs text-blue-600 flex items-center gap-1">
                              <ExternalLink className="h-3 w-3" /> {r.fonte_nome}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )
              )}

              {/* Temas anteriores */}
              {aba === 'temas' && (
                temasFiltrados.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-12">Nenhum tema encontrado com esses filtros.</p>
                ) : (
                  <div className="space-y-2">
                    {temasFiltrados.map((t) => (
                      <div key={t.id} className="flex items-start justify-between bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex items-start space-x-3">
                          <span className="text-sm font-bold text-blue-600 w-12 flex-shrink-0">{t.ano}</span>
                          <div>
                            <p className="text-sm text-gray-900">{t.tema}</p>
                            {t.eixo_tematico && (
                              <p className="text-xs text-gray-500 mt-0.5">{t.eixo_tematico}{t.aplicacao && t.aplicacao !== 'regular' ? ` · ${t.aplicacao}` : ''}</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => { setAba('redacoes'); setBusca(t.tema); }}
                          className="text-xs text-blue-600 hover:underline flex-shrink-0 ml-2"
                        >
                          Ver redações
                        </button>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* Repertórios */}
              {aba === 'repertorios' && (
                repertoriosFiltrados.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-12">Nenhum repertório encontrado.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {repertoriosFiltrados.map((r) => (
                      <Card key={r.id}>
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-center space-x-2">
                            <BookMarked className="h-4 w-4 text-purple-600 flex-shrink-0" />
                            <h3 className="text-sm font-semibold text-gray-900">{r.nome}</h3>
                          </div>
                          <p className="text-xs text-gray-600">{r.descricao}</p>
                          {r.temas_relacionados && r.temas_relacionados.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {r.temas_relacionados.map((tag, i) => (
                                <span key={i} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{tag}</span>
                              ))}
                            </div>
                          )}
                          {r.fonte_url && (
                            <a href={r.fonte_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1 pt-1">
                              <ExternalLink className="h-3 w-3" /> Ver fonte
                            </a>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )
              )}

              {/* Guias e modelos */}
              {aba === 'modelos' && (
                modelosFiltrados.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-12">Nenhum guia encontrado.</p>
                ) : (
                  <div className="space-y-4">
                    {modelosFiltrados.map((m) => (
                      <Card key={m.id}>
                        <CardContent className="p-4 space-y-2">
                          <h3 className="text-sm font-semibold text-gray-900">{m.titulo}</h3>
                          <p className="text-sm text-gray-600">{m.conteudo}</p>
                          {m.exemplo && (
                            <div className="bg-gray-50 border-l-4 border-blue-400 rounded-r-lg p-3 mt-2">
                              <p className="text-xs text-gray-500 font-medium mb-1">Exemplo</p>
                              <p className="text-xs text-gray-700 italic">{m.exemplo}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Biblioteca;
