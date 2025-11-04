import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { CategoryBadge, Button } from './UI';
import { formatTime, getMotivationMessage, calculateAccuracy } from '../utils/helpers';
import { dailyTasks } from '../data/mockData';

// ============================================
// DAILY SESSION COMPONENT
// Interaktive Quiz-Session mit Timer
// ============================================

export default function DailySession({ 
  onComplete,    // Callback wenn Session fertig
  onAddPoints,   // Callback zum Punkte hinzufügen
  onUpdateStrength  // Callback für Stärken-Update
}) {
  // ========== STATE ==========
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [sessionAnswers, setSessionAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 Minuten
  const [userAnswer, setUserAnswer] = useState('');

  const currentTask = dailyTasks[currentTaskIndex];

  // ========== TIMER EFFECT ==========
  useEffect(() => {
    if (!sessionComplete && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      
      // Cleanup: Timer stoppen bei Component Unmount
      return () => clearInterval(timer);
    }
    
    // Zeit abgelaufen
    if (timeLeft === 0 && !sessionComplete) {
      handleSessionComplete();
    }
  }, [sessionComplete, timeLeft]);

  // ========== EVENT HANDLERS ==========
  
  /**
   * Antwort auswählen (Multiple Choice)
   */
  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return; // Verhindere doppelte Klicks
    
    const isCorrect = answerIndex === currentTask.correctAnswer;
    
    // Answer speichern
    const newAnswer = {
      taskId: currentTask.id,
      category: currentTask.category,
      answer: answerIndex,
      isCorrect,
      points: isCorrect ? currentTask.points : 0
    };
    
    setSessionAnswers(prev => [...prev, newAnswer]);
    setShowResult(true);
    
    // Punkte sofort hinzufügen
    if (isCorrect) {
      onAddPoints(currentTask.points);
      onUpdateStrength(currentTask.category, 5);
    }
    
    // Nach 2 Sekunden zur nächsten Frage
    setTimeout(() => {
      if (currentTaskIndex < dailyTasks.length - 1) {
        setCurrentTaskIndex(prev => prev + 1);
        setShowResult(false);
      } else {
        handleSessionComplete();
      }
    }, 2000);
  };

  /**
   * Textantwort submitten (Open Questions)
   */
  const handleTextSubmit = () => {
    if (!userAnswer.trim()) return;
    
    // Bei kreativen Fragen gibt es keine "falsche" Antwort
    const newAnswer = {
      taskId: currentTask.id,
      category: currentTask.category,
      answer: userAnswer,
      isCorrect: true,
      points: currentTask.points
    };
    
    setSessionAnswers(prev => [...prev, newAnswer]);
    onAddPoints(currentTask.points);
    onUpdateStrength(currentTask.category, 5);
    
    setShowResult(true);
    
    setTimeout(() => {
      if (currentTaskIndex < dailyTasks.length - 1) {
        setCurrentTaskIndex(prev => prev + 1);
        setShowResult(false);
        setUserAnswer('');
      } else {
        handleSessionComplete();
      }
    }, 2000);
  };

  /**
   * Session abschließen
   */
  const handleSessionComplete = () => {
    setSessionComplete(true);
    
    // Callback an Parent
    const totalPoints = sessionAnswers.reduce((sum, ans) => sum + ans.points, 0);
    const accuracy = calculateAccuracy(sessionAnswers);
    
    onComplete({
      answers: sessionAnswers,
      totalPoints,
      accuracy,
      timeSpent: 600 - timeLeft
    });
  };

  // ========== COMPLETION SCREEN ==========
  if (sessionComplete) {
    const totalPoints = sessionAnswers.reduce((sum, ans) => sum + ans.points, 0);
    const correctAnswers = sessionAnswers.filter(ans => ans.isCorrect).length;
    const accuracy = calculateAccuracy(sessionAnswers);

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h2 className="text-3xl font-bold mb-2">Session abgeschlossen! 🎉</h2>
          <p className="text-gray-600 mb-8">
            {getMotivationMessage(accuracy)}
          </p>
          
          {/* Statistiken */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-purple-50 rounded-xl p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {correctAnswers}/{dailyTasks.length}
              </div>
              <div className="text-sm text-gray-600">Richtige Antworten</div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                +{totalPoints}
              </div>
              <div className="text-sm text-gray-600">Punkte verdient</div>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {accuracy}%
              </div>
              <div className="text-sm text-gray-600">Genauigkeit</div>
            </div>
          </div>
          
          {/* Antworten-Review */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
            <h3 className="font-bold mb-4">Deine Antworten:</h3>
            <div className="space-y-3">
              {sessionAnswers.map((ans, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className={`text-xl ${ans.isCorrect ? '✅' : '❌'}`}>
                    {ans.isCorrect ? '✅' : '❌'}
                  </span>
                  <span className="text-sm text-gray-700 capitalize">
                    {ans.category} - {ans.points} Punkte
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <Button onClick={() => window.location.reload()}>
            Zurück zum Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // ========== ACTIVE QUIZ SCREEN ==========
  return (
    <div className="max-w-3xl mx-auto">
      {/* Timer und Fortschritt */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center justify-between">
          {/* Fortschrittsbalken */}
          <div className="flex gap-2 flex-1">
            {dailyTasks.map((_, idx) => (
              <div 
                key={idx} 
                className={`flex-1 h-2 rounded-full transition-all ${
                  idx < currentTaskIndex ? 'bg-green-500' : 
                  idx === currentTaskIndex ? 'bg-purple-500' : 
                  'bg-gray-200'
                }`} 
              />
            ))}
          </div>
          
          {/* Timer */}
          <div className="flex items-center gap-2 text-gray-600 ml-4">
            <Clock className="w-4 h-4" />
            <span className="font-mono font-semibold">
              {formatTime(timeLeft)}