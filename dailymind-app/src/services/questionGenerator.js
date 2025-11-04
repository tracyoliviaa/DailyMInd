import OpenAI from 'openai';

// ============================================
// OPENAI QUESTION GENERATOR SERVICE
// Generiert intelligente, personalisierte Fragen
// ============================================

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Nur für Development!
});

/**
 * Generiert eine einzelne Frage basierend auf Kategorie
 */
export async function generateQuestion(category, difficulty = 'medium') {
  const prompts = {
    logic: `Erstelle eine logische Denkaufgabe (Schwierigkeit: ${difficulty}).
    
Format:
{
  "question": "Die Frage",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0-3 (Index der richtigen Antwort),
  "explanation": "Warum diese Antwort richtig ist"
}

Die Frage soll:
- Logisches Denken fördern
- Nicht zu einfach sein
- Keine Tricks enthalten
- Auf Deutsch sein`,

    language: `Erstelle eine Sprachaufgabe (Schwierigkeit: ${difficulty}).
    
Themen: Wortschatz, Grammatik, Fremdwörter, Redewendungen

Format:
{
  "question": "Die Frage",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0-3,
  "explanation": "Erklärung mit Herkunft/Bedeutung"
}`,

    knowledge: `Erstelle eine Allgemeinwissens-Frage (Schwierigkeit: ${difficulty}).
    
Bereiche: Geschichte, Geographie, Wissenschaft, Kultur

Format:
{
  "question": "Die Frage",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0-3,
  "explanation": "Interessante Details zur Antwort"
}`,

    memory: `Erstelle eine Gedächtnisaufgabe (Schwierigkeit: ${difficulty}).
    
Format:
{
  "question": "Merke dir diese Sequenz: [5-7 Elemente]",
  "type": "memory",
  "correctAnswer": "Die genaue Sequenz",
  "explanation": "Tipps zum Merken"
}`,

    creativity: `Erstelle eine kreative Aufgabe (Schwierigkeit: ${difficulty}).
    
Format:
{
  "question": "Vervollständige kreativ: ...",
  "type": "open",
  "explanation": "Es gibt keine falsche Antwort! Kreativität zählt."
}`
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Günstiger als gpt-4
      messages: [
        {
          role: "system",
          content: "Du bist ein Experte für Lernpsychologie und erstellst anspruchsvolle, aber faire Lernaufgaben. Antworte immer nur mit validem JSON."
        },
        {
          role: "user",
          content: prompts[category] || prompts.knowledge
        }
      ],
      temperature: 0.8, // Kreativität
      response_format: { type: "json_object" }
    });

    const questionData = JSON.parse(response.choices[0].message.content);
    
    // Füge Metadaten hinzu
    return {
      id: Date.now(),
      category,
      difficulty,
      points: difficulty === 'easy' ? 15 : difficulty === 'medium' ? 25 : 35,
      generatedAt: new Date().toISOString(),
      ...questionData
    };

  } catch (error) {
    console.error('Error generating question:', error);
    throw error;
  }
}

/**
 * Generiert eine komplette Daily Session (5 Fragen)
 */
export async function generateDailySession(userStrengths = {}) {
  const categories = ['logic', 'language', 'knowledge', 'memory', 'creativity'];
  
  // Bestimme Schwierigkeit basierend auf User-Stärken
  const getDifficulty = (category) => {
    const strength = userStrengths[category] || 50;
    if (strength < 40) return 'easy';
    if (strength < 70) return 'medium';
    return 'hard';
  };

  const questions = [];
  
  for (const category of categories) {
    const difficulty = getDifficulty(category);
    
    try {
      const question = await generateQuestion(category, difficulty, userStrengths);
      questions.push(question);
    } catch (error) {
      console.error(`Failed to generate ${category} question:`, error);
      // Fallback zu Mock-Fragen
      questions.push(getMockQuestion(category));
    }
  }

  return questions;
}

/**
 * Fallback Mock-Frage wenn API fehlschlägt
 */
function getMockQuestion(category) {
  const mockQuestions = {
    logic: {
      question: "Wenn es regnet, ist die Straße nass. Die Straße ist nass. Was folgt daraus?",
      options: [
        "Es hat geregnet",
        "Es regnet gerade",
        "Nichts sicher - könnte auch andere Gründe haben",
        "Es wird bald regnen"
      ],
      correctAnswer: 2,
      explanation: "Nur weil die Straße nass ist, muss es nicht geregnet haben (könnte gegossen worden sein)."
    },
    // ... weitere Mock-Fragen
  };

  return {
    id: Date.now(),
    category,
    points: 20,
    ...mockQuestions[category]
  };
}