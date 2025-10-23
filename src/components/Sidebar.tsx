"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  TrendingUp, 
  Target, 
  Award, 
  Bot,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  children?: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({});

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
    },
    {
      title: 'Certificados',
      href: '/certificados',
      icon: Award,
      description: 'Seus certificados de conclusão'
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
            "hover:bg-gray-100 hover:text-gray-900",
            level === 0 ? "text-gray-700" : "text-gray-600 ml-4",
            window.location.pathname === item.href && "bg-blue-50 text-blue-700"
          )}
        >
          <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
          <span className="flex-1 text-left">{item.title}</span>
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              {/* Logo real do Supabase */}
              <img 
                src="https://ugdpjgftmhyurrmfzdux.supabase.co/storage/v1/object/public/imagens/logo%201.png" 
                alt="AprimorAi" 
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  // Fallback para SVG se a imagem não carregar
                  e.currentTarget.outerHTML = `
                    <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span class="text-white text-sm font-bold">A</span>
                    </div>
                  `;
                }}
              />
              <span className="ml-2 text-lg font-semibold text-gray-900">AprimorAi</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {menuItems.map(renderMenuItem)}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                window.location.href = '/login';
              }}
              className="w-full justify-start text-gray-600 hover:text-gray-900"
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