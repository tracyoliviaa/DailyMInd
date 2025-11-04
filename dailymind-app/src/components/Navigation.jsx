import React from 'react';
import { Brain, BookOpen, TrendingUp, User } from 'lucide-react';
import { NavButton } from './UI';

// ============================================
// NAVIGATION COMPONENT
// Bottom Tab Navigation
// ============================================

export default function Navigation({ activeView, onNavigate }) {
  const navItems = [
    { id: 'dashboard', icon: Brain, label: 'Dashboard' },
    { id: 'paths', icon: BookOpen, label: 'Lernpfade' },
    { id: 'stats', icon: TrendingUp, label: 'Statistiken' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-around">
        {navItems.map(item => (
          <NavButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeView === item.id}
            onClick={() => onNavigate(item.id)}
          />
        ))}
      </div>
    </nav>
  );
}