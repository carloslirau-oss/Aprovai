"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { ICONE_BRANCO, ICONE_PRETO } from '@/assets/logoIcon';
import {
  ArrowLeft,
  Menu,
  ExternalLink,
  Target,
  Scale,
  Link2,
  Flag,
  BarChart3,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/Sidebar';

interface Competencia {
  nome: string;
  nota: number;
  comentario?: string;
}

interface RepertorioUsado {
  nome: string;
  descricao?: string;
}

interface RedacaoDetalhe {
  id: string;
  titulo: string;
  ano: number;
  tema: string;
  categoria: string;
  nota: number;
  autor: string | null;
  resumo: string;
  tese: string | null;
  argumentos: string[] | null;
  repertorios: RepertorioUsado[] | null;
  conectivos_destaque: string[] | null;
  proposta_intervencao: string | null;
  competencias: Competencia[] | null;
  fonte_nome: string | null;
  fonte_url: string | null;
}

const BibliotecaRedacaoDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const logoUrl = theme === 'dark' ? ICONE_BRANCO : ICONE_PRETO;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [redacao, setRedacao] = useState<RedacaoDetalhe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [naoEncontrada, setNaoEncontrada] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      if (!id) return;
      setIsLoading(true);
      const { data, error } = await supabase
        .from('biblioteca_redacoes')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        setNaoEncontrada(true);
      } else {
        setRedacao(data);
      }
      setIsLoading(false);
    };
    carregar();
  }, [id]);

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
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/biblioteca')} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
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
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full space-y-6">
          {isLoading && <p className="text-sm text-gray-500 text-center py-12">Carregando redação...</p>}

          {naoEncontrada && (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">Não encontramos essa redação na biblioteca.</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/biblioteca')}>
                Voltar para a Biblioteca
              </Button>
            </div>
          )}

          {redacao && (
            <>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">{redacao.ano} · {redacao.tema}</span>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                    redacao.nota >= 1000 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {redacao.nota}/1000
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{redacao.titulo}</h1>
                {redacao.autor && <p className="text-sm text-gray-600 mt-1">Autor(a): {redacao.autor}</p>}
                <p className="text-sm text-gray-700 mt-3">{redacao.resumo}</p>
                {redacao.fonte_url && (
                  <a
                    href={redacao.fonte_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Ler a redação completa em {redacao.fonte_nome || 'fonte original'}
                  </a>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  A análise abaixo é um resumo pedagógico; o texto completo está disponível na fonte original.
                </p>
              </div>

              {redacao.competencias && redacao.competencias.length > 0 && (
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-green-600" />
                      <h2 className="text-sm font-semibold text-gray-900">Desempenho por competência</h2>
                    </div>
                    <div className="space-y-3">
                      {redacao.competencias.map((c, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs sm:text-sm mb-1">
                            <span className="text-gray-700">{c.nome}</span>
                            <span className="font-medium">{c.nota}/200</span>
                          </div>
                          <div className="w-full overflow-hidden bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${Math.min(100, Math.max(0, (c.nota / 200) * 100))}%` }}
                            />
                          </div>
                          {c.comentario && <p className="text-xs text-gray-500 mt-1">{c.comentario}</p>}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {redacao.tese && (
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <h2 className="text-sm font-semibold text-gray-900">Tese</h2>
                    </div>
                    <p className="text-sm text-gray-700">{redacao.tese}</p>
                  </CardContent>
                </Card>
              )}

              {redacao.argumentos && redacao.argumentos.length > 0 && (
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <h2 className="text-sm font-semibold text-gray-900">Argumentos principais</h2>
                    <ul className="space-y-1.5">
                      {redacao.argumentos.map((a, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {redacao.repertorios && redacao.repertorios.length > 0 && (
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Scale className="h-4 w-4 text-purple-600" />
                      <h2 className="text-sm font-semibold text-gray-900">Repertórios utilizados</h2>
                    </div>
                    <div className="space-y-2">
                      {redacao.repertorios.map((r, i) => (
                        <div key={i} className="bg-purple-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-900">{r.nome}</p>
                          {r.descricao && <p className="text-xs text-gray-600 mt-0.5">{r.descricao}</p>}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {redacao.conectivos_destaque && redacao.conectivos_destaque.length > 0 && (
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Link2 className="h-4 w-4 text-orange-600" />
                      <h2 className="text-sm font-semibold text-gray-900">Conectivos em destaque</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {redacao.conectivos_destaque.map((c, i) => (
                        <span key={i} className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-full">{c}</span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {redacao.proposta_intervencao && (
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Flag className="h-4 w-4 text-green-600" />
                      <h2 className="text-sm font-semibold text-gray-900">Proposta de intervenção</h2>
                    </div>
                    <p className="text-sm text-gray-700">{redacao.proposta_intervencao}</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default BibliotecaRedacaoDetalhe;
