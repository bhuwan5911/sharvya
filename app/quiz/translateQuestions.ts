import fetch from 'node-fetch';

// Add your Google Cloud Translation API key here
const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';

// Supported languages (20+)
const LANGUAGES = [
  'es', 'hi', 'fr', 'de', 'zh', 'ar', 'ru', 'ja', 'ko', 'pt', 'it', 'tr', 'bn', 'pa', 'jv', 'ms', 'vi', 'ta', 'ur', 'fa', 'sw', 'mr', 'te', 'th'
];

// Copy your sampleQuestions object here (from page.tsx)
const sampleQuestions = {
  'programming-basics': [
    {
      id: 1,
      type: 'voice-mcq',
      question: 'What is HTML primarily used for?',
      options: ['Programming logic', 'Creating web page structure', 'Database management', 'Mobile app development'],
      correctAnswer: 'Creating web page structure',
      difficulty: 'easy',
      points: 10,
      translations: {}
    },
    {
      id: 2,
      type: 'open-voice',
      question: 'Explain what a variable is in programming and give an example.',
      correctAnswer: 'variable stores data',
      difficulty: 'medium',
      points: 15,
      translations: {}
    },
    // ... add the rest of your questions here
  ],
  'web-development': [
    {
      id: 1,
      type: 'voice-mcq',
      question: 'What does CSS stand for?',
      options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Code Style Standards'],
      correctAnswer: 'Cascading Style Sheets',
      difficulty: 'easy',
      points: 10,
      translations: {}
    },
    {
      id: 2,
      type: 'open-voice',
      question: 'Describe the purpose of JavaScript in web development.',
      correctAnswer: 'JavaScript adds interactivity',
      difficulty: 'medium',
      points: 15,
      translations: {}
    },
    // ... add the rest of your questions here
  ]
};

async function translateText(text: string, target: string) {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text, target })
  });
  const data = await res.json();
  if (data && data.data && data.data.translations && data.data.translations[0]) {
    return data.data.translations[0].translatedText;
  }
  throw new Error('Translation failed');
}

async function translateQuestion(q: any, lang: string) {
  const translated: any = {};
  translated.question = await translateText(q.question, lang);
  if (q.options) {
    translated.options = [];
    for (const opt of q.options) {
      translated.options.push(await translateText(opt, lang));
    }
  }
  return translated;
}

async function main() {
  for (const cat in sampleQuestions) {
    for (const q of sampleQuestions[cat]) {
      q.translations = q.translations || {};
      for (const lang of LANGUAGES) {
        if (!q.translations[lang]) {
          try {
            console.log(`Translating Q${q.id} (${cat}) to ${lang}...`);
            q.translations[lang] = await translateQuestion(q, lang);
          } catch (e) {
            console.error(`Failed to translate Q${q.id} to ${lang}:`, e);
          }
        }
      }
    }
  }
  // Output the updated questions object
  console.log('\n\n--- TRANSLATED QUESTIONS ---\n');
  console.log(JSON.stringify(sampleQuestions, null, 2));
}

main(); 