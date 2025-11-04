import React from 'react';
import { TrendingUp, Award, Target, Calendar } from 'lucide-react';
import { ProgressBar } from './UI';

// ============================================
// STATISTICS COMPONENT
// Detaillierte Fortschritts-Visualisierung
// ============================================

export default function Statistics({ progress }) {
  // Berechne zusätzliche Metriken
  const averageScore = Object.values(progress.strengths).reduce((a, b) => a + b, 0) / 
                       Object.values(progress.strengths).length;
  
  const totalMinutes = progress.totalSessions * 10; // Je Session 10 Minuten
  const daysActive = progress.streak;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Deine Statistiken</h2>
        <p className="text-gray-600">
          Verfolge deinen Lernfortschritt im Detail
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={Calendar}
          value={progress.totalSessions}
          label="Sessions"
          color="purple"
        />
        <MetricCard
          icon={TrendingUp}
          value={`${daysActive} Tage`}
          label="Streak"
          color="orange"
        />
        <MetricCard
          icon={Award}
          value={progress.points}
          label="Punkte"
          color="blue"
        />
        <MetricCard
          icon={Target}
          value={`${Math.round(averageScore)}%`}
          label="Durchschnitt"
          color="green"
        />
      </div>

      {/* Learning Time */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Lernzeit</h3>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-4xl font-bold text-purple-600">
            {totalMinutes}
          </span>
          <span className="text-gray-600 mb-2">Minuten insgesamt</span>
        </div>
        <p className="text-sm text-gray-500">
          Das entspricht {Math.round(totalMinutes / 60)} Stunden aktives Lernen! 🎉
        </p>
      </div>

      {/* Category Progress */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Fortschritt nach Kategorie</h3>
        <div className="space-y-4">
          {Object.entries(progress.strengths).map(([category, value]) => (
            <CategoryProgress 
              key={category}
              category={category}
              value={value}
            />
          ))}
        </div>
      </div>

      {/* Level Progress */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-purple-100 text-sm mb-1">Aktuelles Level</p>
            <h3 className="text-3xl font-bold">Level {progress.level}</h3>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>
        </div>
        
        {/* Progress to next level */}
        <div className="bg-white/10 rounded-full h-3 mb-2">
          <div 
            className="bg-white h-3 rounded-full transition-all"
            style={{ width: `${(progress.points % 200) / 2}%` }}
          />
        </div>
        <p className="text-sm text-purple-100">
          {200 - (progress.points % 200)} Punkte bis Level {progress.level + 1}
        </p>
      </div>

      {/* Achievement Badges (Future Feature) */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Errungenschaften</h3>
        <div className="grid grid-cols-3 gap-4">
          <AchievementBadge 
            emoji="🔥" 
            title="Auf Feuer" 
            unlocked={progress.streak >= 7}
            description="7 Tage Streak"
          />
          <AchievementBadge 
            emoji="⭐" 
            title="Aufsteiger" 
            unlocked={progress.level >= 3}
            description="Level 3 erreicht"
          />
          <AchievementBadge 
            emoji="🎯" 
            title="Fleißig" 
            unlocked={progress.totalSessions >= 20}
            description="20 Sessions"
          />
          <AchievementBadge 
            emoji="🧠" 
            title="Denker" 
            unlocked={progress.strengths.logic >= 80}
            description="80% Logik"
          />
          <AchievementBadge 
            emoji="📚" 
            title="Polyglott" 
            unlocked={progress.strengths.language >= 80}
            description="80% Sprache"
          />
          <AchievementBadge 
            emoji="💎" 
            title="Meister" 
            unlocked={progress.points >= 1000}
            description="1000 Punkte"
          />
        </div>
      </div>

      {/* Weekly Activity (Mock Data) */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4">Wöchentliche Aktivität</h3>
        <div className="flex items-end justify-between gap-2 h-32">
          {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day, idx) => {
            const height = Math.random() * 100; // Mock data
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gray-100 rounded-t relative" style={{ height: '100%' }}>
                  <div 
                    className="w-full bg-gradient-to-t from-purple-500 to-purple-300 rounded-t absolute bottom-0 transition-all"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600">{day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function MetricCard({ icon: Icon, value, label, color }) {
  const colorClasses = {
    purple: 'bg-purple-50 text-purple-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className={`w-10 h-10 ${colorClasses[color]} rounded-lg flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function CategoryProgress({ category, value }) {
  // Emoji mapping
  const categoryEmojis = {
    logic: '🧩',
    language: '📚',
    creativity: '🎨',
    memory: '🧠',
    knowledge: '🌍'
  };

  // Rating basierend auf Wert
  const getRating = (val) => {
    if (val >= 80) return { text: 'Exzellent', color: 'text-green-600' };
    if (val >= 60) return { text: 'Gut', color: 'text-blue-600' };
    if (val >= 40) return { text: 'Okay', color: 'text-orange-600' };
    return { text: 'Ausbaufähig', color: 'text-gray-600' };
  };

  const rating = getRating(value);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{categoryEmojis[category]}</span>
          <span className="font-medium capitalize">{category}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${rating.color}`}>
            {rating.text}
          </span>
          <span className="text-sm font-bold text-gray-900">{value}%</span>
        </div>
      </div>
      <ProgressBar value={value} color="purple" />
    </div>
  );
}

function AchievementBadge({ emoji, title, description, unlocked }) {
  return (
    <div className={`text-center p-4 rounded-xl border-2 transition-all ${
      unlocked 
        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300' 
        : 'bg-gray-50 border-gray-200 opacity-50'
    }`}>
      <div className={`text-3xl mb-2 ${unlocked ? '' : 'grayscale'}`}>
        {emoji}
      </div>
      <div className="font-bold text-sm mb-1">{title}</div>
      <div className="text-xs text-gray-600">{description}</div>
      {unlocked && (
        <div className="text-xs text-green-600 font-semibold mt-2">
          ✓ Freigeschaltet
        </div>
      )}
    </div>
  );
}