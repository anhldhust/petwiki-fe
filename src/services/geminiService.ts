
import { GoogleGenAI, Type } from "@google/genai";
import { PetType, BreedSummary, BreedDetail } from "../types";

export const getBreedList = async (type: PetType): Promise<BreedSummary[]> => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Provide a list of 12 most popular ${type} breeds.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            shortDescription: { type: Type.STRING },
            size: { type: Type.STRING },
          },
          required: ["name", "shortDescription", "size"],
        },
      },
    },
  });

  const raw = JSON.parse(response.text || '[]');
  return raw.map((item: any) => ({ ...item, type }));
};

export const searchBreeds = async (query: string): Promise<BreedSummary[]> => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Search for dog or cat breeds matching: "${query}". Return at most 10 results.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            type: { type: Type.STRING, enum: ["dog", "cat"] },
            shortDescription: { type: Type.STRING },
            size: { type: Type.STRING },
          },
          required: ["name", "type", "shortDescription", "size"],
        },
      },
    },
  });

  return JSON.parse(response.text || '[]');
};

export const getBreedDetail = async (name: string, type: PetType): Promise<BreedDetail> => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Provide deep detail about the ${name} ${type} breed. Include height, weight, lifespan, origin, detailed history, and a heartwarming short story about this breed.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          scientificName: { type: Type.STRING },
          shortDescription: { type: Type.STRING },
          size: { type: Type.STRING },
          height: { type: Type.STRING },
          weight: { type: Type.STRING },
          lifespan: { type: Type.STRING },
          origin: { type: Type.STRING },
          history: { type: Type.STRING },
          story: { type: Type.STRING },
          characteristics: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["name", "scientificName", "height", "weight", "lifespan", "origin", "history", "story", "characteristics"],
      },
    },
  });

  const detail = JSON.parse(response.text || '{}');
  return { ...detail, type };
};

export const generatePetImage = async (prompt: string): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `High quality, cute, artistic photo of ${prompt}` }],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

// Veo Video Generation
export const generatePetVideo = async (prompt: string): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  
  const ai = new GoogleGenAI({ apiKey });
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `A cute cinematic video of ${prompt}`,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const res = await fetch(`${downloadLink}&key=${apiKey}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
};



