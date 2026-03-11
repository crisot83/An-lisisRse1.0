import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { Message } from "../types";

const MODEL_NAME = "gemini-3-flash-preview";

const SYSTEM_INSTRUCTION_TEMPLATE = `
Eres un Analista Senior de Rendimiento Retail.
Tienes acceso a un conjunto de datos de una cadena de tiendas (proporcionado a continuación en formato CSV).

TUS OBJETIVOS:
1. Responder a las consultas del usuario sobre el rendimiento de las tiendas, regiones o a nivel nacional.
2. Analizar siempre los datos en dos periodos si están disponibles: "Anual" (YTD) y "Mensual".
3. CRÍTICO: Comparar el rendimiento de una tienda específica con los promedios "Nacionales" y de su respectiva "Región".
4. Detectar Desviaciones: Identificar métricas donde una tienda rinde por debajo de los puntos de referencia (Nacional/Región).
5. Priorizar Mejoras: Basándote en las desviaciones, sugerir prioridades principales (ej. si la Conversión es baja pero el Tráfico es alto, priorizar formación en ventas).

REGLAS DE FORMATO:
- Usa Markdown.
- Usa **Negrita** para métricas clave y nombres de tiendas.
- Usa Tablas para mostrar comparaciones laterales (Tienda vs Región vs Nacional).
- Mantén las respuestas profesionales, concisas y orientadas a la acción.
- RESPONDE SIEMPRE EN ESPAÑOL.

DATASET:
`;

export const sendMessageToGemini = async (
  history: Message[],
  currentMessage: string,
  csvData: string
): Promise<string> => {
  // Use the environment variable
  const finalApiKey = process.env.GEMINI_API_KEY;
  
  if (!finalApiKey) {
    throw new Error("No se encontró la clave de API configurada en el entorno.");
  }

  const ai = new GoogleGenAI({ apiKey: finalApiKey });

  // Filter history to only include valid exchange for context
  const conversationContext = history.slice(-6).map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');

  const fullPrompt = `
  Contexto de la conversación:
  ${conversationContext}
  USUARIO: ${currentMessage}
  MODELO:
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_TEMPLATE + csvData,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
      }
    });

    return response.text || "I processed the data but could not generate a text response.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // If the error is about unregistered callers, it's definitely the API Key
    if (error.message?.includes("unregistered callers")) {
      throw new Error("Invalid or missing API Key. Please check your configuration.");
    }
    throw new Error(error.message || "Failed to communicate with Gemini.");
  }
};
