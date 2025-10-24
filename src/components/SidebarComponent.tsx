"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut,
  X,
  Home,
  User,
  Award,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/contexts/UserDataContext';
import { useTheme } from '@/contexts/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { userProfile } = useUserData();
  const { theme } = useTheme();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/dashboard',
      color: 'text-blue-600'
    },
    {
      title: 'Redações',
      icon: BookOpen,
      href: '/redacoes',
      color: 'text-green-600'
    },
    {
      title: 'Professor Carlinhos',
      icon: MessageSquare,
      href: '/professor-carlinhos',
      color: 'text-purple-600'
    },
    {
      title: 'Estatísticas',
      icon: BarChart3,
      href: '/estatisticas',
      color: 'text-orange-600'
    }
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">AprimorAI</h1>
                <p className="text-xs text-gray-500">Redação ENEM</p>
              </div>
            </div>
            
            {/* Close button for mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User profile */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user?.user_metadata?.name?.split(' ').map(n => n[0]).join('') || 'J'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.user_metadata?.name || 'João da Silva'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userProfile?.patente || 'Iniciante'}
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-600 font-medium">Redações</p>
                <p className="text-lg font-bold text-blue-900">
                  {userProfile?.redacoes_corrigidas || 0}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-green-600 font-medium">XP Total</p>
                <p className="text-lg font-bold text-green-900">
                  {userProfile?.xp_total || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate(item.href);
                    onClose();
                  }}
                >
                  <item.icon className={`h-5 w-5 mr-3 ${item.color}`} />
                  <span className="text-gray-700">{item.title}</span>
                </Button>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-3 text-red-600" />
                <span className="text-red-600">Sair</span>
              </Button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Versão 1.0.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;