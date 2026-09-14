"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BookOpen, TrendingUp, Bot, LogOut, Sun, Moon, Menu, X } from 'lucide-react';
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
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const { theme, toggleTheme } = useTheme();
  const open = isOpen || internalOpen;

  const menuItems: MenuItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: TrendingUp },
    { title: 'Redações', href: '/redacoes', icon: BookOpen },
    { title: 'Professor Carlinhos', href: '/professor-carlinhos', icon: Bot }
  ];

  const closeMenu = () => {
    setInternalOpen(false);
    onClose();
  };

  const handleNavigation = (href: string) => {
    closeMenu();
    window.location.href = href;
  };

  const logoUrl = 'https://ugdpjgftmhyurrmfzdux.supabase.co/storage/v1/object/public/imagens/escreve%20ai%20branca.png';

  return (
    <>
      {/* No desktop o botão fica sozinho à esquerda do cabeçalho. */}
      {!open && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setInternalOpen(true)}
          className="fixed left-4 top-3 z-50 hidden h-10 w-10 rounded-md p-0 text-gray-700 hover:bg-gray-100 hover:text-gray-900 lg:flex"
          aria-label="Abrir menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-800 shadow-2xl transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-700 px-4">
          <div className="flex min-w-0 items-center">
            <img
              src={logoUrl}
              alt="Escreve AI"
              className="h-10 w-40 object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={closeMenu}
            className="flex-shrink-0 text-gray-400 hover:text-white"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-x-hidden overflow-y-auto px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = window.location.pathname === item.href;

            return (
              <button
                key={item.title}
                type="button"
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  "hover:bg-slate-700 hover:text-white",
                  active ? "bg-blue-600 text-white" : "text-gray-300"
                )}
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                <span className="text-left">{item.title}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-700 p-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="mb-2 w-full justify-start text-gray-300 hover:text-white"
          >
            {theme === 'light' ? <Moon className="mr-3 h-4 w-4" /> : <Sun className="mr-3 h-4 w-4" />}
            {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => { window.location.href = '/login'; }}
            className="w-full justify-start text-gray-300 hover:text-white"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
