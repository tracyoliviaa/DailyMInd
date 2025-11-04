import React from 'react';
import { Brain, Clock, ChevronRight, Flame, Award, TrendingUp } from 'lucide-react';
import { StatCard, StrengthBar, Button } from './UI';

// ============================================
// DASHBOARD COMPONENT
// Zeigt Übersicht, Statistiken und heutige Aufgabe
// ============================================

export default function Dashboard({ progress, onStartSession }) {
  return (
    <div className="space-y-6">
      {/* Hero Section mit Statistiken */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Willkommen zurück!</h2>
            <p className="text-purple-100">Bereit für deine tägliche Herausforderung?</p>
          </div>
          <Brain className="w-12 h-12 opacity-80" />
        </div>
        
        {/* Statistik-Karten */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <StatCard 
            icon={Flame} 
            value={progress.streak} 
            label="Tage Streak" 
          />
          <StatCard 
            icon={Award} 
            value={progress.points} 
            label="Punkte" 
          />
          <StatCard 
            icon={TrendingUp} 
            value={`Level ${progress.level}`} 
            label="Dein Level" 
          />
        </div>
      </div>

      {/* Heutige Einheit - Call to Action */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Heutige Einheit</h3>
              <p className="text-sm text-gray-600">5 Aufgaben • ~10 Minuten</p>
            </div>
          </div>
          
          <Button onClick={onStartSession}>
            Start <ChevronRight className="w-4 h-4 ml-2 inline" />
          </Button>
        </div>
        
        {/* Fortschritts-Indikatoren */}
        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div 
              key={i} 
              className="flex-1 h-2 bg-gray-200 rounded-full" 
            />
          ))}
        </div>
      </div>

      {/* Stärken-Übersicht */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Deine Stärken</h3>
        <div className="space-y-3">
          {Object.entries(progress.strengths).map(([key, value]) => (
            <StrengthBar 
              key={key} 
              name={key} 
              value={value} 
            />
          ))}
        </div>
      </div>

      {/* Motivations-Card */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🎯</div>
          <div>
            <h4 className="font-bold text-gray-800">Dein heutiges Ziel</h4>
            <p className="text-sm text-gray-600">
              Halte deinen {progress.streak}-Tage-Streak aufrecht!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}