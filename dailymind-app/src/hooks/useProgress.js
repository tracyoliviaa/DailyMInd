import { useState, useEffect } from 'react';
import { initialProgress } from '../data/mockData';
import { calculateLevel } from '../utils/helpers';

// ============================================
// CUSTOM HOOK - Progress Management
// ============================================

/**
 * Hook für Progress-Verwaltung mit localStorage
 * In Production würde das mit einer API synchronisiert
 */
export function useProgress() {
  const [progress, setProgress] = useState(() => {
    // Initial State aus localStorage laden (falls vorhanden)
    const saved = localStorage.getItem('dailymind_progress');
    return saved ? JSON.parse(saved) : initialProgress;
  });

  // Speichere Progress bei jeder Änderung
  useEffect(() => {
    localStorage.setItem('dailymind_progress', JSON.stringify(progress));
  }, [progress]);

  /**
   * Fügt Punkte hinzu und updated Level
   */
  const addPoints = (points) => {
    setProgress(prev => {
      const newPoints = prev.points + points;
      return {
        ...prev,
        points: newPoints,
        level: calculateLevel(newPoints)
      };
    });
  };

  /**
   * Erhöht Streak um 1
   */
  const incrementStreak = () => {
    setProgress(prev => ({
      ...prev,
      streak: prev.streak + 1,
      lastSession: new Date().toISOString().split('T')[0]
    }));
  };

  /**
   * Updated Stärken in einer Kategorie
   */
  const updateStrength = (category, value) => {
    setProgress(prev => ({
      ...prev,
      strengths: {
        ...prev.strengths,
        [category]: Math.min(100, prev.strengths[category] + value)
      }
    }));
  };

  /**
   * Erhöht Session-Count
   */
  const incrementSessions = () => {
    setProgress(prev => ({
      ...prev,
      totalSessions: prev.totalSessions + 1
    }));
  };

  /**
   * Reset Progress (für Testing)
   */
  const resetProgress = () => {
    setProgress(initialProgress);
    localStorage.removeItem('dailymind_progress');
  };

  return {
    progress,
    addPoints,
    incrementStreak,
    updateStrength,
    incrementSessions,
    resetProgress
  };
}