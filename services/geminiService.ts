
import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";

// Initialisation sécurisée via l'environnement système
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Gestion des appels vers OpenRouter (Fallback) uniquement si la variable est présente
 * On ne met jamais de clé en dur ici.
 */
async function callOpenRouterFallback(prompt: string, model: string = "meta-llama/llama-3.1-405b-instruct:free") {
  const OR_KEY = process.env.OPENROUTER_API_KEY;
  if (!OR_KEY) return "";

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OR_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (error) {
    return "";
  }
}

const safeJsonParse = (text: string | undefined) => {
  if (!text) return {};
  let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    return {};
  }
};

export const generateCourseWithSearch = async (topic: string) => {
  const prompt = `Crée un projet de formation luxe sur: ${topic}. JSON: { "title": "", "subtitle": "", "modules": [{ "title": "", "lessons": [{ "title": "" }] }], "testimonials": [], "faq": [], "glossary": [] }`;
  const resp = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json" },
  });
  return { course: safeJsonParse(resp.text) };
};

export const generateDetailedLessonContent = async (lessonTitle: string, courseContext: string) => {
  const prompt = `Contenu détaillé pour "${lessonTitle}" (Cours: ${courseContext}). JSON: { "textContent": "...", "videoUrl": "..." }`;
  const resp = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });
  return safeJsonParse(resp.text);
};

export const generateQuizForLesson = async (lessonTitle: string, lessonContent: string) => {
  const prompt = `Génère un quiz d'évaluation (3 questions) pour: ${lessonTitle}. JSON: { "questions": [{ "question": "", "options": ["", "", "", ""], "correctIndex": 0 }] }`;
  const resp = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });
  return safeJsonParse(resp.text)?.questions || [];
};

export const generateAIImage = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `Minimalist high-end editorial image for: ${prompt}. Pure aesthetic.` }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
  } catch (e) {}
  return `https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200`;
};

export const generateVoiceGuide = async (text: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
};

export const startConversation = async (systemInstruction: string) => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: { systemInstruction },
  });
};

export const sendMessage = async (chat: any, message: string): Promise<string> => {
  const result: GenerateContentResponse = await chat.sendMessage({ message });
  return result.text || "Erreur de communication.";
};
