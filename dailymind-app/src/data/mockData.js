// ============================================
// MOCK DATA - Würde später vom Backend kommen
// ============================================

export const initialProgress = {
  streak: 7,
  totalSessions: 23,
  points: 680,
  level: 3,
  strengths: {
    logic: 75,
    language: 82,
    creativity: 68,
    memory: 71,
    knowledge: 79
  },
  lastSession: '2025-11-04'
};

export const dailyTasks = [
  {
    id: 1,
    category: 'logic',
    question: 'Wenn alle Blumen Pflanzen sind und einige Pflanzen Bäume sind, was folgt daraus logisch?',
    options: [
      'Alle Blumen sind Bäume',
      'Einige Blumen könnten Bäume sein',
      'Keine Blume ist ein Baum',
      'Es folgt nichts Bestimmtes'
    ],
    correctAnswer: 3,
    explanation: 'Aus den Prämissen folgt nichts Spezifisches über die Beziehung zwischen Blumen und Bäumen.',
    points: 25
  },
  {
    id: 2,
    category: 'language',
    question: 'Was bedeutet das Wort "ephemer"?',
    options: [
      'Sehr alt und wertvoll',
      'Kurz lebend, vergänglich',
      'Emotional berührend',
      'Schwer zu verstehen'
    ],
    correctAnswer: 1,
    explanation: '"Ephemer" bedeutet kurzlebig oder flüchtig, vom griechischen "ephemeros".',
    points: 20
  },
  {
    id: 3,
    category: 'knowledge',
    question: 'Welches chemische Element hat das Symbol "Au"?',
    options: ['Silber', 'Gold', 'Aluminium', 'Argon'],
    correctAnswer: 1,
    explanation: 'Au steht für Gold, vom lateinischen "Aurum".',
    points: 15
  },
  {
    id: 4,
    category: 'memory',
    question: 'Merke dir diese Zahl: 739285',
    type: 'memory',
    correctAnswer: '739285',
    explanation: 'Gedächtnistraining hilft, Informationen besser zu behalten.',
    points: 25
  },
  {
    id: 5,
    category: 'creativity',
    question: 'Vervollständige kreativ: "Wenn Wolken Gedanken hätten, würden sie..."',
    type: 'open',
    points: 30,
    explanation: 'Kreativität hat keine falsche Antwort!'
  }
];

export const learningPaths = [
  {
    id: 1,
    title: 'Kritisches Denken',
    description: 'Lerne Argumente zu analysieren und logische Fehlschlüsse zu erkennen',
    progress: 60,
    lessons: 12,
    color: 'purple'
  },
  {
    id: 2,
    title: 'Wissenschaft kompakt',
    description: 'Grundlagen der Physik, Chemie und Biologie in kurzen Häppchen',
    progress: 35,
    lessons: 20,
    color: 'blue'
  },
  {
    id: 3,
    title: 'Sprachmeisterschaft',
    description: 'Erweitere deinen Wortschatz und verstehe sprachliche Nuancen',
    progress: 80,
    lessons: 15,
    color: 'green'
  }
];

// Helper: Kategorie-Icons und -Farben
export const categoryConfig = {
  logic: { color: 'purple', emoji: '🧩' },
  language: { color: 'blue', emoji: '📚' },
  knowledge: { color: 'green', emoji: '🌍' },
  memory: { color: 'orange', emoji: '🧠' },
  creativity: { color: 'pink', emoji: '🎨' }
};