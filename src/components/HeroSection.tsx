"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <GraduationCap className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
                Você está a um passo da nota 1000
              </h1>
            </div>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed">
              Treine com correções inteligentes, ajustes detalhados e o professor mais divertido do ENEM.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3">
                <BookOpen className="mr-2 h-5 w-5" />
                Entrar na Plataforma
              </Button>
              <Button size="lg" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 text-lg px-8 py-3">
                Ver Demonstração
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                <div className="w-72 h-72 bg-white rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📝</div>
                    <div className="text-2xl font-bold text-blue-600">Redação</div>
                    <div className="text-lg text-gray-600">ENEM</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                Nota 1000
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;