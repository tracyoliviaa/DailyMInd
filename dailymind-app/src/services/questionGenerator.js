// ============================================
// QUESTION GENERATOR SERVICE (BROWSER-FIXED)
// Verwendet fetch statt OpenAI SDK für Browser
// ============================================

/**
 * Generiert eine einzelne Frage via OpenAI API
 */
export async function generateQuestion(category, difficulty = 'medium') {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  // Fallback wenn kein API Key
  if (!apiKey || apiKey === 'sk-dein-api-key-hier') {
    console.warn('⚠️ Kein OpenAI API Key - verwende Mock-Daten');
    return getMockQuestion(category, difficulty);
  }

  const prompts = {
    logic: `Erstelle eine logische Denkaufgabe (Schwierigkeit: ${difficulty}).
Format als JSON:
{
  "question": "Die Frage",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Warum diese Antwort richtig ist"
}`,

    language: `Erstelle eine Sprachaufgabe (Schwierigkeit: ${difficulty}).
Themen: Wortschatz, Grammatik, Fremdwörter
Format als JSON wie oben.`,

    knowledge: `Erstelle eine Allgemeinwissens-Frage (Schwierigkeit: ${difficulty}).
Format als JSON wie oben.`,

    memory: `Erstelle eine Gedächtnisaufgabe (Schwierigkeit: ${difficulty}).
Format als JSON:
{
  "question": "Merke dir diese Sequenz: [5-7 Elemente]",
  "type": "memory",
  "correctAnswer": "Die genaue Sequenz",
  "explanation": "Tipps zum Merken"
}`,

    creativity: `Erstelle eine kreative Aufgabe (Schwierigkeit: ${difficulty}).
Format als JSON:
{
  "question": "Vervollständige kreativ: ...",
  "type": "open",
  "explanation": "Es gibt keine falsche Antwort!"
}`
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Du bist ein Experte für Lernpsychologie. Antworte nur mit validem JSON."
          },
          {
            role: "user",
            content: prompts[category] || prompts.knowledge
          }
        ],
        temperature: 0.8,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const questionData = JSON.parse(data.choices[0].message.content);
    
    return {
      id: Date.now() + Math.random(),
      category,
      difficulty,
      points: difficulty === 'easy' ? 15 : difficulty === 'medium' ? 25 : 35,
      generatedAt: new Date().toISOString(),
      ...questionData
    };

  } catch (error) {
    console.error('OpenAI Error:', error);
    return getMockQuestion(category, difficulty);
  }
}

/**
 * Generiert eine komplette Daily Session (5 Fragen)
 */
export async function generateDailySession(userStrengths = {}) {
  const categories = ['logic', 'language', 'knowledge', 'memory', 'creativity'];
  
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
      const question = await generateQuestion(category, difficulty);
      questions.push(question);
      
      // Kleine Verzögerung zwischen Requests
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.error(`Failed ${category}:`, error);
      questions.push(getMockQuestion(category, difficulty));
    }
  }

  return questions;
}

/**
 * Mock-Fragen als Fallback
 */
function getMockQuestion(category, difficulty = 'medium') {
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
      explanation: "Dies ist ein klassischer logischer Fehlschluss. Nur weil die Straße nass ist, muss es nicht geregnet haben - sie könnte auch gegossen worden sein."
    },
    language: {
      question: "Was bedeutet das Wort 'ephemer'?",
      options: [
        "Sehr alt und wertvoll",
        "Kurz lebend, vergänglich",
        "Emotional berührend",
        "Schwer zu verstehen"
      ],
      correctAnswer: 1,
      explanation: "'Ephemer' kommt vom griechischen 'ephemeros' und bedeutet kurzlebig oder flüchtig."
    },
    knowledge: {
      question: "In welchem Jahr fiel die Berliner Mauer?",
      options: ["1987", "1989", "1990", "1991"],
      correctAnswer: 1,
      explanation: "Die Berliner Mauer fiel am 9. November 1989, was den Beginn der deutschen Wiedervereinigung markierte."
    },
    memory: {
      question: "Merke dir diese Zahlenfolge: 7-3-9-2-8-5",
      type: "memory",
      correctAnswer: "739285",
      explanation: "Ein Tipp: Versuche Muster zu erkennen oder Geschichten zu bilden - das hilft beim Merken!"
    },
    creativity: {
      question: "Vervollständige kreativ: 'Wenn Wolken Gedanken hätten, würden sie...'",
      type: "open",
      explanation: "Bei kreativen Aufgaben gibt es keine falsche Antwort. Lass deiner Fantasie freien Lauf! 🎨"
    }
  };

  const baseQuestion = mockQuestions[category] || mockQuestions.knowledge;
  
  return {
    id: Date.now() + Math.random(),
    category,
    difficulty,
    points: difficulty === 'easy' ? 15 : difficulty === 'medium' ? 25 : 35,
    ...baseQuestion
  };
}