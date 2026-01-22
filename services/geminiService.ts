
import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const OPENROUTER_KEY = "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";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callOpenRouter(prompt: string, model: string = "meta-llama/llama-3.1-405b-instruct:free") {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: "Expert en ingénierie pédagogique. Réponds exclusivement en JSON." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      })
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (error) {
    return "";
  }
}

async function withRetryAndFallback<T>(
  fn: () => Promise<T>, 
  fallbackFn: () => Promise<string>,
  maxRetries = 2
): Promise<{ data: any, source: 'gemini' | 'fallback' }> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await fn();
      return { data: result, source: 'gemini' };
    } catch (error: any) {
      if (i < maxRetries - 1) {
        await sleep(2000 * (i + 1));
        continue;
      }
    }
  }
  const fallbackText = await fallbackFn();
  return { data: safeJsonParse(fallbackText), source: 'fallback' };
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
  const prompt = `Crée un projet de formation premium sur: ${topic}. 
  Format JSON strict: { 
    "title": "", 
    "subtitle": "", 
    "modules": [{ "title": "", "lessons": [{ "title": "", "contentType": "video" }] }],
    "testimonials": [{ "name": "", "role": "", "content": "", "avatar": "https://i.pravatar.cc/150?u=1" }],
    "faq": [{ "question": "", "answer": "" }],
    "glossary": [{ "term": "", "definition": "" }]
  }`;
  
  const result = await withRetryAndFallback(
    async () => {
      const resp = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json" },
      });
      return safeJsonParse(resp.text);
    },
    async () => callOpenRouter(prompt, "meta-llama/llama-3.1-405b-instruct:free")
  );

  return { course: result.data };
};

export const generateDetailedLessonContent = async (lessonTitle: string, courseContext: string) => {
  const prompt = `Rédige le contenu de la leçon "${lessonTitle}" pour le cours "${courseContext}". JSON: { "textContent": "...", "videoUrl": "..." }`;
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
      contents: { parts: [{ text: `A cinematic minimalist editorial photo for: ${prompt}. Clean background.` }] },
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
  try {
    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text || "Erreur.";
  } catch (e) {
    return await callOpenRouter(message, "google/gemma-3-12b-it:free");
  }
};
