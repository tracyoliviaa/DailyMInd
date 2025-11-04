import React, { useState } from 'react';
import { Brain } from 'lucide-react';

// Components
import Dashboard from './components/Dashboard';
import DailySession from './components/DailySession';
import LearningPaths from './components/LearningPaths';
import Statistics from './components/Statistics';
import Navigation from './components/Navigation';

// Custom Hook
import { useProgress } from './hooks/useProgress';

// ============================================
// MAIN APP COMPONENT
// Orchestriert alle Components und State
// ============================================

function App() {
  // ========== STATE MANAGEMENT ==========
  const [activeView, setActiveView] = useState('dashboard');
  
  // Custom Hook für Progress-Management
  const {
    progress,
    addPoints,
    incrementStreak,
    updateStrength,
    incrementSessions,
    resetProgress
  } = useProgress();

  // ========== EVENT HANDLERS ==========

  /**
   * Startet eine neue Daily Session
   */
  const handleStartSession = () => {
    setActiveView('session');
  };

  /**
   * Session wurde abgeschlossen
   */
  const handleSessionComplete = (sessionData) => {
    console.log('Session completed:', sessionData);
    
    // Update Progress
    incrementSessions();
    incrementStreak();
    
    // Nach 3 Sekunden zurück zum Dashboard
    setTimeout(() => {
      setActiveView('dashboard');
    }, 3000);
  };

  /**
   * Navigation zwischen Views
   */
  const handleNavigate = (view) => {
    setActiveView(view);
  };

  // ========== RENDER LOGIC ==========

  /**
   * Rendert den aktiven View basierend auf activeView State
   */
  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard 
            progress={progress}
            onStartSession={handleStartSession}
          />
        );
      
      case 'session':
        return (
          <DailySession
            onComplete={handleSessionComplete}
            onAddPoints={addPoints}
            onUpdateStrength={updateStrength}
            userStrengths={progress.strengths}
          />
        );
      
      case 'paths':
        return <LearningPaths />;
      
      case 'stats':
        return <Statistics progress={progress} />;
      
      default:
        return <Dashboard progress={progress} onStartSession={handleStartSession} />;
    }
  };

  // ========== MAIN RENDER ==========
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pb-20">
      {/* ===== HEADER ===== */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">DailyMind</h1>
              <p className="text-xs text-gray-500">10 Minuten täglich intelligenter</p>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">
                {progress.points} Punkte
              </div>
              <div className="text-xs text-gray-500">
                Level {progress.level}
              </div>
            </div>
            
            {/* Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
              U
            </div>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {renderActiveView()}
      </main>

      {/* ===== NAVIGATION (nur wenn nicht in Session) ===== */}
      {activeView !== 'session' && (
        <Navigation 
          activeView={activeView}
          onNavigate={handleNavigate}
        />
      )}

      {/* ===== DEBUG PANEL (nur Development) ===== */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-20 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs">
          <div className="font-bold mb-2">🔧 Debug Info</div>
          <div>View: {activeView}</div>
          <div>Points: {progress.points}</div>
          <div>Streak: {progress.streak}</div>
          <button 
            onClick={resetProgress}
            className="mt-2 bg-red-500 px-3 py-1 rounded text-xs hover:bg-red-600"
          >
            Reset Progress
          </button>
        </div>
      )}
    </div>
  );
}

export default App;