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

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
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
      description: 'Dicas e orientações personalizadas',
      children: [
        {
          title: 'Dicas do Professor',
          href: '/professor-carlinhos/dicas',
          icon: Target,
          description: 'Dicas diárias para melhorar sua redação'
        },
        {
          title: 'Conversar com o Professor',
          href: '/professor-carlinhos/chat',
          icon: MessageSquare,
          description: 'Envie suas dúvidas e receba orientações'
        }
      ]
    },
    {
      title: 'Certificados',
      href: '/certificados',
      icon: Award,
      description: 'Seus certificados de conclusão'
    }
  ];

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.title];
    const Icon = item.icon;

    return (
      <div key={item.title} className="mb-1">
        <button
          onClick={() => hasChildren ? toggleExpanded(item.title) : handleNavigation(item.href)}
          className={cn(
            "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
            "hover:bg-gray-100 hover:text-gray-900",
            level === 0 ? "text-gray-700" : "text-gray-600 ml-4",
            window.location.pathname === item.href && "bg-blue-50 text-blue-700"
          )}
        >
          <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
          <span className="flex-1 text-left">{item.title}</span>
          {hasChildren && (
            isExpanded ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
          )}
        </button>
        
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
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
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900">Redação ENEM</span>
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