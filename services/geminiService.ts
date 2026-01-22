
import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const OPENROUTER_KEY = "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";

/**
 * Utility to wait for a specified duration
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Appelle l'API OpenRouter en cas de secours
 */
async function callOpenRouter(prompt: string, model: string = "meta-llama/llama-3.1-405b-instruct:free") {
  console.log(`Fallback OpenRouter activé avec le modèle: ${model}`);
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "Mindfulness Studio Fallback",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: "Tu es un expert pédagogique. Réponds TOUJOURS au format JSON pur selon le schéma demandé. Ne parle pas, donne juste le JSON." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error("Erreur critique sur OpenRouter Fallback:", error);
    return "";
  }
}

/**
 * Executes a function with exponential backoff retries.
 * If all retries fail, it triggers the provided fallback function.
 */
async function withRetryAndFallback<T>(
  fn: () => Promise<T>, 
  fallbackFn: () => Promise<string>,
  maxRetries = 2
): Promise<{ data: any, source: 'gemini' | 'fallback' }> {
  let lastError: any;
  
  // 1. Essai avec Gemini + Retries légers
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await fn();
      return { data: result, source: 'gemini' };
    } catch (error: any) {
      lastError = error;
      const errorMessage = typeof error === 'string' ? error : (error?.message || JSON.stringify(error));
      const isQuotaError = errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED');
      
      if (isQuotaError && i < maxRetries - 1) {
        await sleep(2000 * (i + 1));
        continue;
      }
      break; // Sortie vers le fallback si erreur fatale ou quota épuisé
    }
  }

  // 2. Basculement vers OpenRouter si Gemini échoue
  console.warn("Gemini saturé, basculement vers OpenRouter...");
  const fallbackText = await fallbackFn();
  return { data: safeJsonParse(fallbackText), source: 'fallback' };
}

/**
 * Parses JSON safely, handling potential truncation or markdown blocks.
 */
const safeJsonParse = (text: string | undefined) => {
  if (!text) return {};
  let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn("JSON repair attempt...");
    let repaired = cleaned;
    const lastQuote = cleaned.lastIndexOf('"');
    const lastBrace = cleaned.lastIndexOf('}');
    if (lastQuote > lastBrace) repaired += '"';
    const openBraces = (repaired.match(/\{/g) || []).length;
    const closeBraces = (repaired.match(/\}/g) || []).length;
    for (let i = 0; i < (openBraces - closeBraces); i++) repaired += '}';
    try {
      return JSON.parse(repaired);
    } catch {
      return {};
    }
  }
};

export const generateCourseWithSearch = async (topic: string) => {
  const prompt = `Crée une structure de cours sur: ${topic}. Format JSON: { "title": "", "subtitle": "", "modules": [{ "title": "", "lessons": [{ "title": "", "contentType": "video" }] }] }`;
  
  const result = await withRetryAndFallback(
    async () => {
      const resp = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: { 
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        },
      });
      return safeJsonParse(resp.text);
    },
    async () => callOpenRouter(prompt, "meta-llama/llama-3.1-405b-instruct:free")
  );

  return {
    course: result.data,
    sources: [] // Grounding non disponible sur fallback
  };
};

export const generateDetailedLessonContent = async (lessonTitle: string, courseContext: string) => {
  const prompt = `Contenu pour la leçon "${lessonTitle}" (Cours: ${courseContext}). JSON: { "textContent": "...", "videoUrl": "...", "resources": [] }`;
  
  const result = await withRetryAndFallback(
    async () => {
      const resp = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      return safeJsonParse(resp.text);
    },
    async () => callOpenRouter(prompt, "google/gemma-3-12b-it:free")
  );

  return result.data;
};

export const generateAIImage = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `A professional luxury course illustration for: ${prompt}. White background, 4k.` }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
  } catch (e) {
    console.error("Image generation quota hit, using premium unsplash fallback.");
  }
  return `https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200`;
};

export const generateVoiceGuide = async (text: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Lis ceci calmement: ${text}` }] }],
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
  try {
    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text || "Erreur.";
  } catch (e) {
    // Petit fallback chat rapide sur OpenRouter si le chat Gemini sature
    return await callOpenRouter(message, "google/gemma-3-12b-it:free");
  }
};
