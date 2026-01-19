
import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schemas existants...
export const courseSchema = { /* ... */ };
export const lessonContentSchema = { /* ... */ };

export const generateCourseWithSearch = async (prompt: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          modules: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                lessons: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      contentType: { type: Type.STRING }
                    },
                    required: ["title", "contentType"]
                  }
                }
              },
              required: ["title", "lessons"]
            }
          }
        },
        required: ["title", "subtitle", "modules"]
      },
      systemInstruction: "Tu es le Chef de Studio. Crée une structure de cours basée sur des recherches web actuelles."
    },
  });
  return {
    course: JSON.parse(response.text || "{}"),
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const generateDetailedLessonContent = async (lessonTitle: string, courseContext: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Contenu complet pour "${lessonTitle}" (Formation: ${courseContext}). Trouve 1 vidéo réelle, 3 ressources web (liens), et un glossaire de 3 termes.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          textContent: { type: Type.STRING },
          videoUrl: { type: Type.STRING },
          quiz: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } }, correctIndex: { type: Type.NUMBER } } } },
          resources: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: { type: Type.STRING }, url: { type: Type.STRING }, type: { type: Type.STRING } } } },
          glossary: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { term: { type: Type.STRING }, definition: { type: Type.STRING } } } }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const generateAIImage = async (prompt: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `A high-end, clean, professional editorial illustration for a digital course about: ${prompt}. Soft luxury style, mindfulness aesthetic, 4k.` }] },
    config: { imageConfig: { aspectRatio: "16:9" } }
  });
  
  for (const part of response.candidates?.[0].content.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

/**
 * Génère un guide vocal apaisant à partir du texte de la leçon.
 */
export const generateVoiceGuide = async (text: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Lis ceci avec une voix calme, lente et apaisante pour une méditation : ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' }, // Voix douce
        },
      },
    },
  });
  
  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("Audio generation failed");
  return base64Audio;
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
