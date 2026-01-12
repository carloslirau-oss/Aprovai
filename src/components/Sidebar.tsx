"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  TrendingUp, 
  Target, 
  Bot,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  LogOut,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle?: () => void;
  isDesktop?: boolean;
}

interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  children?: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onToggle, isDesktop = false }) => {
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({});
  const { theme, toggleTheme } = useTheme();

  const handleNavigation = (href: string) => {
    window.location.href = href;
    onClose();
  };

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: TrendingUp,
      description: 'Visão geral do seu progresso'
    },
    {
      title: 'Redações',
      href: '/redacoes',
      icon: BookOpen,
      description: 'Pratique com temas reais do ENEM'
    },
    {
      title: 'Professor Carlinhos',
      href: '/professor-carlinhos',
      icon: Bot,
      description: 'Converse com o Professor Carlinhos'
    }
  ];

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const Icon = item.icon;

    return (
      <div key={item.title} className="mb-1">
        <button
          onClick={() => handleNavigation(item.href)}
          className={cn(
            "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
            "hover:bg-slate-700 hover:text-white",
            level === 0 ? "text-gray-300" : "text-gray-400 ml-4",
            window.location.pathname === item.href && "bg-blue-600 text-white"
          )}
        >
          <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
          <span className="flex-1 text-left">{item.title}</span>
        </button>
      </div>
    );
  };

  // URL da imagem "escreve ai branca" do Supabase Storage
  const logoUrl = 'https://ugdpjgftmhyurrmfzdux.supabase.co/storage/v1/object/public/imagens/escreve%20ai%20branca.png';

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-slate-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header com botão de toggle para desktop */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700">
            <div className="flex items-center">
              {/* Logo branca para ambos os temas */}
              <img 
                src={logoUrl}
                alt="Escreve AI"
                className="w-40 h-10 object-contain"
                onError={(e) => {
                  // Fallback para uma logo genérica se a imagem não carregar
                  e.currentTarget.outerHTML = `
                    <div class="w-40 h-10 bg-blue-600 rounded flex items-center justify-center">
                      <span class="text-white text-lg font-bold">A</span>
                    </div>
                  `;
                }}
              />
            </div>
            
            {/* Botão de toggle apenas para desktop */}
            {isDesktop && onToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="text-gray-400 hover:text-white"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
            
            {/* Botão de fechar apenas para mobile */}
            {!isDesktop && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Conteúdo da sidebar - sempre visível quando isOpen for true */}
          <nav className={cn(
            "flex-1 px-4 py-6 space-y-1 overflow-y-auto",
            !isOpen && "hidden" // Esconde apenas quando isOpen for false
          )}>
            {menuItems.map(renderMenuItem)}
          </nav>

          {/* Rodapé com botões - sempre visível quando isOpen for true */}
          <div className={cn(
            "p-4 border-t border-slate-700",
            !isOpen && "hidden" // Esconde apenas quando isOpen for false
          )}>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-full justify-start text-gray-300 hover:text-white mb-2"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="mr-3 h-4 w-4" />
                  Modo Escuro
                </>
              ) : (
                <>
                  <Sun className="mr-3 h-4 w-4" />
                  Modo Claro
                </>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                window.location.href = '/login';
              }}
              className="w-full justify-start text-gray-300 hover:text-white"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;