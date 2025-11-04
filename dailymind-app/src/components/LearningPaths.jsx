import React from 'react';
import { Target, Brain, BookOpen, ChevronRight } from 'lucide-react';
import { ProgressBar } from './UI';
import { learningPaths } from '../data/mockData';

// ============================================
// LEARNING PATHS COMPONENT
// Zeigt verfügbare Themenkurse
// ============================================

// Icon-Mapping
const iconMap = {
  Target,
  Brain,
  BookOpen
};

export default function LearningPaths() {
  const handlePathClick = (path) => {
    // TODO: Navigation zu Pfad-Details
    console.log('Opening path:', path.title);
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Lernpfade</h2>
        <p className="text-gray-600">
          Wähle einen Themenbereich und lerne systematisch
        </p>
      </div>

      {learningPaths.map(path => {
        // Color-Mapping für Tailwind
        const colorClasses = {
          purple: 'bg-purple-500',
          blue: 'bg-blue-500',
          green: 'bg-green-500'
        };

        return (
          <div 
            key={path.id} 
            onClick={() => handlePathClick(path)}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`w-12 h-12 ${colorClasses[path.color]} rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <Target className="w-6 h-6" />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{path.title}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {path.description}
                </p>
                
                {/* Progress */}
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex-1">
                    <ProgressBar 
                      value={path.progress} 
                      color={path.color} 
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-600">
                    {path.progress}%
                  </span>
                </div>
                
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>📚 {path.lessons} Lektionen</span>
                  <span>⏱️ ~{Math.ceil(path.lessons * 10)} Minuten</span>
                </div>
              </div>
              
              {/* Arrow */}
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        );
      })}

      {/* Coming Soon Card */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-dashed border-purple-200">
        <div className="text-center">
          <div className="text-4xl mb-3">🚀</div>
          <h3 className="font-bold text-lg mb-2">Mehr Pfade kommen bald!</h3>
          <p className="text-sm text-gray-600">
            Wir arbeiten an weiteren spannenden Themenbereichen
          </p>
        </div>
      </div>
    </div>
  );
}