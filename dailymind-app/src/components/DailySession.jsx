import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { CategoryBadge, Button } from './UI';
import { formatTime, getMotivationMessage, calculateAccuracy } from '../utils/helpers';

// ❗ NEU: dynamischer Fragen-Generator
import { generateDailySession } from '../services/questionGenerator';

// ============================================
// DAILY SESSION COMPONENT
// Interaktive Quiz-Session mit Timer
// ============================================

export default function DailySession({ 
  onComplete,        // Callback wenn Session fertig
  onAddPoints,       // Callback zum Punkte hinzufügen
  onUpdateStrength,  // Callback zum Updaten der Stärken
  userStrengths      // ❗ neu: User-Stärken als Input für KI-Generator
}) {
  // ========== STATE ==========
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [sessionAnswers, setSessionAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 Minuten
  const [userAnswer, setUserAnswer] = useState('');

  // ❗ NEU: dynamische Fragen statt statisches dailyTasks import
  const [dailyTasks, setDailyTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ========== LADEN DER FRAGEN (NEU) ==========
  useEffect(() => {
    async function loadQuestions() {
      setIsLoading(true);
      try {
        // ruft KI/Logik auf → personalisierte Fragen
        const questions = await generateDailySession(userStrengths);
        setDailyTasks(questions);
        setError(null);
      } catch (err) {
        setError('Fragen konnten nicht geladen werden. Versuche es später erneut.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadQuestions();
  }, [userStrengths]); // damit sich Fragen neu generieren, wenn sich Stärken ändern

  // ========== LOADING SCREEN ==========
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-6" />
          <h3 className="text-xl font-bold mb-2">Generiere deine Fragen...</h3>
          <p className="text-gray-600">KI erstellt personalisierte Aufgaben für dich 🤖</p>
        </div>
      </div>
    );
  }

  // ========== ERROR SCREEN ==========
  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-bold mb-2">Ups, etwas ist schiefgelaufen</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  // ❗ Wichtig: ab hier läuft alles weiter wie vorher
  const currentTask = dailyTasks[currentTaskIndex];

  // ========== TIMER EFFECT ==========
  useEffect(() => {
    if (!sessionComplete && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }

    if (timeLeft === 0 && !sessionComplete) {
      handleSessionComplete();
    }
  }, [sessionComplete, timeLeft]);

  // ========== EVENT HANDLERS ==========
  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return;
    
    const isCorrect = answerIndex === currentTask.correctAnswer;
    const newAnswer = {
      taskId: currentTask.id,
      category: currentTask.category,
      answer: answerIndex,
      isCorrect,
      points: isCorrect ? currentTask.points : 0
    };

    setSessionAnswers(prev => [...prev, newAnswer]);
    setShowResult(true);

    if (isCorrect) {
      onAddPoints(currentTask.points);
      onUpdateStrength(currentTask.category, 5);
    }

    setTimeout(() => {
      if (currentTaskIndex < dailyTasks.length - 1) {
        setCurrentTaskIndex(prev => prev + 1);
        setShowResult(false);
      } else {
        handleSessionComplete();
      }
    }, 2000);
  };

  const handleTextSubmit = () => {
    if (!userAnswer.trim()) return;

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

  const handleSessionComplete = () => {
    setSessionComplete(true);

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
            </span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mt-2">
          Frage {currentTaskIndex + 1} von {dailyTasks.length}
        </p>
      </div>

      {/* Aufgaben-Karte */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <CategoryBadge category={currentTask.category} />
        
        <h3 className="text-2xl font-bold mt-4 mb-6">
          {currentTask.question}
        </h3>
        
        {/* Multiple Choice Fragen */}
        {currentTask.type !== 'open' && currentTask.options && (
          <div className="space-y-3">
            {currentTask.options.map((option, idx) => {
              const isSelected = sessionAnswers[sessionAnswers.length - 1]?.answer === idx;
              const isCorrect = idx === currentTask.correctAnswer;
              
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    showResult && isCorrect
                      ? 'border-green-500 bg-green-50'
                      : showResult && isSelected && !isCorrect
                      ? 'border-red-500 bg-red-50'
                      : showResult
                      ? 'border-gray-200 opacity-50'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-sm">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
        
        {/* Open Text Questions */}
        {currentTask.type === 'open' && !showResult && (
          <div className="space-y-4">
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Deine kreative Antwort..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none min-h-[120px]"
            />
            <Button 
              onClick={handleTextSubmit}
              disabled={!userAnswer.trim()}
            >
              Antwort absenden
            </Button>
          </div>
        )}
        
        {/* Feedback nach Antwort */}
        {showResult && (
          <div className={`mt-6 p-4 rounded-xl ${
            sessionAnswers[sessionAnswers.length - 1]?.isCorrect 
              ? 'bg-green-50 border border-green-200' 
              : currentTask.type === 'open'
              ? 'bg-blue-50 border border-blue-200'
              : 'bg-orange-50 border border-orange-200'
          }`}>
            <p className="font-semibold mb-2">
              {sessionAnswers[sessionAnswers.length - 1]?.isCorrect ? '✓ Richtig!' : 
               currentTask.type === 'open' ? '✓ Großartig!' : 'Nicht ganz...'}
            </p>
            <p className="text-sm text-gray-700">
              {currentTask.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}