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
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();

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

  const handleNavigation = (href: string) => {
    navigate(href);
    onClose();
  };

  const handleLogout = () => {
    navigate('/login');
    onClose();
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