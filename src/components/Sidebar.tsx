"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  TrendingUp,
  Bot,
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
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isDesktop = false }) => {
  const [desktopCollapsed, setDesktopCollapsed] = React.useState(false);
  const { theme, toggleTheme } = useTheme();

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

  const handleNavigation = (href: string) => {
    window.location.href = href;
    onClose();
  };

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon;
    const active = window.location.pathname === item.href;
    const collapsed = isDesktop && desktopCollapsed;

    return (
      <div key={item.title} className="mb-1">
        <button
          type="button"
          title={collapsed ? item.title : undefined}
          onClick={() => handleNavigation(item.href)}
          className={cn(
            "w-full flex items-center rounded-md py-2 text-sm font-medium transition-colors",
            "hover:bg-slate-700 hover:text-white",
            collapsed ? "justify-center px-2" : "px-3",
            active ? "bg-blue-600 text-white" : "text-gray-300"
          )}
        >
          <Icon className={cn("h-5 w-5 flex-shrink-0", !collapsed && "mr-3")} />
          {!collapsed && <span className="flex-1 text-left truncate">{item.title}</span>}
        </button>
      </div>
    );
  };

  const logoUrl = 'https://ugdpjgftmhyurrmfzdux.supabase.co/storage/v1/object/public/imagens/escreve%20ai%20branca.png';
  const collapsed = isDesktop && desktopCollapsed;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 bg-slate-800 shadow-lg transform transition-all duration-300 ease-in-out lg:static lg:inset-auto",
          isDesktop
            ? "hidden lg:flex lg:translate-x-0"
            : "w-64",
          isDesktop && (desktopCollapsed ? "lg:w-20" : "lg:w-64"),
          !isDesktop && (isOpen ? "translate-x-0" : "-translate-x-full")
        )}
      >
        <div className="flex h-full w-full flex-col min-h-0">
          <div className={cn(
            "flex items-center h-16 border-b border-slate-700",
            collapsed ? "justify-center px-2" : "justify-between px-4"
          )}>
            {!collapsed && (
              <div className="flex items-center min-w-0">
                <img
                  src={logoUrl}
                  alt="Escreve AI"
                  className="w-40 h-10 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}

            {isDesktop ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setDesktopCollapsed((value) => !value)}
                className="text-gray-400 hover:text-white flex-shrink-0"
                aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
              >
                {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          <nav className={cn(
            "flex-1 px-4 py-6 space-y-1 overflow-y-auto overflow-x-hidden",
            collapsed && "px-2"
          )}>
            {menuItems.map(renderMenuItem)}
          </nav>

          <div className={cn(
            "p-4 border-t border-slate-700",
            collapsed && "px-2"
          )}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              title={collapsed ? (theme === 'light' ? 'Modo Escuro' : 'Modo Claro') : undefined}
              className={cn(
                "text-gray-300 hover:text-white mb-2",
                collapsed ? "w-full justify-center px-2" : "w-full justify-start"
              )}
            >
              {theme === 'light' ? (
                <Moon className={cn("h-4 w-4", !collapsed && "mr-3")} />
              ) : (
                <Sun className={cn("h-4 w-4", !collapsed && "mr-3")} />
              )}
              {!collapsed && (theme === 'light' ? 'Modo Escuro' : 'Modo Claro')}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => { window.location.href = '/login'; }}
              title={collapsed ? 'Sair' : undefined}
              className={cn(
                "text-gray-300 hover:text-white",
                collapsed ? "w-full justify-center px-2" : "w-full justify-start"
              )}
            >
              <LogOut className={cn("h-4 w-4", !collapsed && "mr-3")} />
              {!collapsed && 'Sair'}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
