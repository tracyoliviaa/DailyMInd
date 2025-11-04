// ============================================
// HELPER FUNCTIONS - Wiederverwendbare Logik
// ============================================

/**
 * Formatiert Sekunden zu MM:SS
 * @param {number} seconds - Sekunden
 * @returns {string} Formatierte Zeit
 */
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Berechnet Prozent korrekte Antworten
 * @param {Array} answers - Array mit Antworten
 * @returns {number} Prozentsatz
 */
export const calculateAccuracy = (answers) => {
  if (answers.length === 0) return 0;
  const correct = answers.filter(a => a.isCorrect).length;
  return Math.round((correct / answers.length) * 100);
};

/**
 * Bestimmt Level basierend auf Punkten
 * @param {number} points - Gesammelte Punkte
 * @returns {number} Level
 */
export const calculateLevel = (points) => {
  return Math.floor(points / 200) + 1;
};

/**
 * Generiert Motivations-Nachricht basierend auf Performance
 * @param {number} accuracy - Genauigkeit in Prozent
 * @returns {string} Motivations-Text
 */
export const getMotivationMessage = (accuracy) => {
  if (accuracy >= 90) return '🌟 Hervorragend! Du bist auf einem Top-Level!';
  if (accuracy >= 70) return '👍 Sehr gut gemacht!';
  if (accuracy >= 50) return '💪 Guter Fortschritt, weiter so!';
  return '🎯 Übung macht den Meister!';
};

/**
 * Prüft ob heute bereits gespielt wurde
 * @param {string} lastSessionDate - Letztes Session-Datum
 * @returns {boolean}
 */
export const hasPlayedToday = (lastSessionDate) => {
  const today = new Date().toISOString().split('T')[0];
  return lastSessionDate === today;
};