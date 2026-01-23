
import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";

// Initialisation via process.env comme requis par les standards de sécurité
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const safeJsonParse = (text: string | undefined) => {
  if (!text) return {};
  let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    return {};
  }
};

/**
 * Génère la structure globale du cours avec recherche Google
 */
export const generateCourseWithSearch = async (topic: string) => {
  const prompt = `Crée un projet de formation premium sur: ${topic}. 
  Retourne un JSON strict: { 
    "title": "Titre", 
    "subtitle": "Accroche", 
    "modules": [{ "title": "Module", "lessons": [{ "title": "Leçon" }] }],
    "testimonials": [{ "name": "Nom", "role": "Expert", "content": "Avis", "avatar": "https://i.pravatar.cc/150?u=1" }],
    "faq": [{ "question": "Q", "answer": "R" }],
    "glossary": [{ "term": "T", "definition": "D" }]
  }`;
  
  try {
    const resp = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json" },
    });
    return { course: safeJsonParse(resp.text) };
  } catch (e) {
    console.error("Erreur structure:", e);
    return { course: null };
  }
};

/**
 * Génère le contenu profond d'une leçon
 */
export const generateDetailedLessonContent = async (lessonTitle: string, courseContext: string) => {
  const prompt = `Rédige le contenu expert pour "${lessonTitle}" (Cours: ${courseContext}). JSON: { "textContent": "...", "videoUrl": "...", "imagePrompt": "Description pour IA d'une image éditoriale luxe" }`;
  try {
    const resp = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return safeJsonParse(resp.text);
  } catch (e) {
    return { textContent: "Erreur de génération.", videoUrl: "" };
  }
};

/**
 * Génère une image via Gemini 2.5 Flash Image
 */
export const generateAIImage = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { 
        parts: [{ text: `Cinematic high-end editorial photography for: ${prompt}. Minimalist, soft luxury lighting, 8k resolution, neutral background.` }] 
      },
      config: { 
        imageConfig: { aspectRatio: "16:9" } 
      }
    });

    // Parcours de toutes les parties pour trouver l'image (comme spécifié dans la doc)
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (e) {
    console.error("Erreur Image IA:", e);
  }
  return `https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200`;
};

/**
 * Génère un Quiz intelligent basé sur le texte
 */
export const generateQuizForLesson = async (lessonTitle: string, lessonContent: string) => {
  const prompt = `Génère 3 questions stratégiques pour "${lessonTitle}" basées sur: ${lessonContent.substring(0, 1000)}. JSON: { "questions": [{ "question": "", "options": ["", "", "", ""], "correctIndex": 0 }] }`;
  try {
    const resp = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return safeJsonParse(resp.text)?.questions || [];
  } catch (e) {
    return [];
  }
};

export const generateVoiceGuide = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
  } catch (e) { return ""; }
};

export const startConversation = async (systemInstruction: string) => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: { systemInstruction },
  });
};

export const sendMessage = async (chat: any, message: string): Promise<string> => {
  const result: GenerateContentResponse = await chat.sendMessage({ message });
  return result.text || "Erreur.";
};
