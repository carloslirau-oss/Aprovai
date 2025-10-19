"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-blue-600">AprimorAi</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Início
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Funcionalidades
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Planos
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Entrar
              </a>
              <Button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 text-white">
                Começar Agora
              </Button>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 p-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <a href="/" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
              Início
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
              Funcionalidades
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
              Planos
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
              Entrar
            </a>
            <Button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2">
              Começar Agora
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;