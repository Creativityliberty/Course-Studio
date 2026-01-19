
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const courseSchema = {
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
};

// Schéma pour le contenu d'une leçon unique
export const lessonContentSchema = {
  type: Type.OBJECT,
  properties: {
    textContent: { type: Type.STRING, description: "Un cours textuel complet et structuré de 300-500 mots" },
    videoUrl: { type: Type.STRING, description: "Une URL YouTube réelle et pertinente trouvée via la recherche" },
    quiz: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctIndex: { type: Type.NUMBER }
        },
        required: ["question", "options", "correctIndex"]
      }
    }
  },
  required: ["textContent", "videoUrl", "quiz"]
};

export const generateCourseWithSearch = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: courseSchema,
        systemInstruction: "Tu es le Chef de Studio. Crée une structure de cours basée sur des recherches web actuelles."
      },
    });
    return {
      course: JSON.parse(response.text || "{}"),
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Erreur structure:", error);
    throw error;
  }
};

export const generateDetailedLessonContent = async (lessonTitle: string, courseContext: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Génère le contenu complet pour la leçon intitulée "${lessonTitle}" dans le cadre d'une formation sur "${courseContext}". Trouve une vidéo YouTube éducative réelle, rédige le cours et crée un quiz.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: lessonContentSchema,
        systemInstruction: "Tu es un expert en pédagogie numérique. Ton but est de fournir du contenu prêt à l'emploi. Assure-toi que les URLs vidéos sont valides et que le texte est riche en informations."
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Erreur contenu leçon:", error);
    throw error;
  }
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
  } catch (error) {
    return "Erreur Gemini.";
  }
};
