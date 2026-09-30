import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK on the server side
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Route: Generate flashcard deck from a topic
app.post('/api/generate-deck', async (req: Request, res: Response) => {
  try {
    const { topic, count = 3 } = req.body;

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      res.status(400).json({ error: 'Topic is required and must be a valid string.' });
      return;
    }

    const sanitizedTopic = topic.trim();
    const questionCount = Math.min(Math.max(Number(count) || 3, 1), 6);

    const prompt = `You are an expert Computer Science educator creating flashcard questions for a Scratch block-based visual learning app.
Generate exactly ${questionCount} concise study flashcards on the topic: "${sanitizedTopic}".

Constraints:
1. Each question must test a concrete concept.
2. The correctAnswer MUST be a short, clean keyword (typically 1 to 3 words, or code symbol like 0, def, len, etc.) because user input is compared in a Scratch <(answer) = [...]> equality block.
3. Provide a list of acceptedAliases containing lowercase variations, abbreviations, or common synonyms so defensive evaluation works smoothly.
4. correctSayText should be an enthusiastic 1-sentence praise message for the Scratch "say [] for 2 secs" block.
5. incorrectSayText should be an informative 1-sentence feedback message stating the right answer for the Scratch "say [] for 3 secs" block.
6. topic should be a concise 2-4 word subcategory.
7. explanation should be a clear 1-2 sentence academic explanation for the student's lab defense / viva voce.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are a computer science pedagogy expert specializing in Scratch block programming and introductory coding curricula.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: 'A list of generated Scratch-compatible flashcard questions.',
          items: {
            type: Type.OBJECT,
            properties: {
              questionText: {
                type: Type.STRING,
                description: 'The question string for the Scratch "ask [] and wait" block.',
              },
              correctAnswer: {
                type: Type.STRING,
                description: 'The primary keyword answer string.',
              },
              acceptedAliases: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Alternative acceptable answers (lowercase).',
              },
              correctSayText: {
                type: Type.STRING,
                description: 'Affirmative response message for the Scratch sprite.',
              },
              incorrectSayText: {
                type: Type.STRING,
                description: 'Remediation response message for the Scratch sprite.',
              },
              topic: {
                type: Type.STRING,
                description: 'Subtopic name.',
              },
              explanation: {
                type: Type.STRING,
                description: 'Theoretical explanation for lab viva defense.',
              },
            },
            required: [
              'questionText',
              'correctAnswer',
              'acceptedAliases',
              'correctSayText',
              'incorrectSayText',
              'topic',
              'explanation',
            ],
          },
        },
      },
    });

    const text = response.text?.trim();
    if (!text) {
      res.status(502).json({ error: 'Empty response returned from Gemini API.' });
      return;
    }

    const cards = JSON.parse(text);
    res.json({ cards });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Error generating flashcards with Gemini:', error);
    res.status(500).json({ error: errMessage });
  }
});

// Mount Vite or static server
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
