import React from 'react';

// ============================================
// REUSABLE UI COMPONENTS
// ============================================

/**
 * Statistik-Karte für Dashboard
 */
export function StatCard({ icon: Icon, value, label, className = '' }) {
  return (
    <div className={`bg-white/10 backdrop-blur rounded-lg p-4 ${className}`}>
      <Icon className="w-5 h-5 mb-2 opacity-80" />
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-purple-100">{label}</div>
    </div>
  );
}

/**
 * Fortschrittsbalken
 */
export function ProgressBar({ value, maxValue = 100, color = 'purple' }) {
  const percentage = (value / maxValue) * 100;
  
  const colorClasses = {
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`${colorClasses[color]} h-2 rounded-full transition-all duration-500`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

/**
 * Stärken-Balken mit Label
 */
export function StrengthBar({ name, value }) {
  return (
    <div>
      <div className="flex justify-between mb-1 text-sm">
        <span className="font-medium capitalize">{name}</span>
        <span className="text-gray-600">{value}%</span>
      </div>
      <ProgressBar value={value} color="purple" />
    </div>
  );
}

/**
 * Navigation Button
 */
export function NavButton({ icon: Icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
        active 
          ? 'text-purple-600 bg-purple-50' 
          : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

/**
 * Kategorie-Badge
 */
export function CategoryBadge({ category }) {
  const colors = {
    logic: 'bg-purple-100 text-purple-700',
    language: 'bg-blue-100 text-blue-700',
    knowledge: 'bg-green-100 text-green-700',
    memory: 'bg-orange-100 text-orange-700',
    creativity: 'bg-pink-100 text-pink-700'
  };

  return (
    <span className={`inline-block ${colors[category]} text-sm font-semibold px-4 py-1 rounded-full`}>
      {category.toUpperCase()}
    </span>
  );
}

/**
 * Loading Spinner
 */
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
    </div>
  );
}

/**
 * Button Component
 */
export function Button({ children, variant = 'primary', onClick, disabled, className = '' }) {
  const variants = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}