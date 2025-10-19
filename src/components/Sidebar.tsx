"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  BookOpen, 
  Bot, 
  Sun, 
  Moon,
  LogOut,
  Settings,
  Clock
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onTimeChange?: (minutes: number) => void;
}

const Sidebar = ({ isOpen, onClose, onTimeChange }: SidebarProps) => {
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = React.useState(180); // 3 hours in minutes

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      color: 'text-blue-600'
    },
    {
      title: 'Redações',
      icon: BookOpen,
      href: '/corretor',
      color: 'text-blue-600'
    },
    {
      title: 'Professor Carlinhos',
      icon: Bot,
      href: '/carlinhos',
      color: 'text-blue-600'
    }
  ];

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

  const handleNavigation = (href: string) => {
    navigate(href);
    onClose();
  };

  const handleLogout = () => {
    navigate('/login');
    onClose();
  };

  const handleTimeSelect = (minutes: number) => {
    setSelectedTime(minutes);
    if (onTimeChange) {
      onTimeChange(minutes);
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
        "fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-50",
        "lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-blue-600">AprimorAi</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.title}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  "text-gray-700 hover:bg-blue-50 hover:text-blue-600",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                )}
              >
                <item.icon className={cn("h-5 w-5 mr-3", item.color)} />
                {item.title}
              </button>
            ))}
          </nav>

          {/* Settings Section */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Configurações
              </h3>
              
              {/* Timer Settings */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Tempo para Redação</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {timeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleTimeSelect(option.value)}
                      className={cn(
                        "px-3 py-2 text-xs font-medium rounded-md transition-colors",
                        selectedTime === option.value
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                
                <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded-md">
                  Tempo selecionado: {Math.floor(selectedTime / 60)}h {selectedTime % 60}min
                </div>
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="px-4 py-4 border-t border-gray-200 space-y-2">
            <button
              onClick={() => {
                // Toggle theme functionality will be implemented later
                console.log('Toggle theme');
              }}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Sun className="h-5 w-5 mr-3 text-blue-600" />
              Mudar Tema
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;