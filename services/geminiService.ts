
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function generateTeamNames(count: number): Promise<string[]> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `請生成 ${count} 個創意、專業且有趣的企業團隊名稱。請使用中文，長度在 2-5 個字之間。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            names: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || '{"names": []}');
    return data.names || [];
  } catch (error) {
    console.error("Error generating team names:", error);
    return Array.from({ length: count }, (_, i) => `第 ${i + 1} 組`);
  }
}

export async function generateWinnerMessage(name: string): Promise<string> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `請為剛在抽籤中獲獎的 ${name} 寫一句簡短、充滿熱情且專業的中文恭喜祝賀詞。`,
    });
    return response.text?.trim() || `恭喜 ${name}！您獲獎了！`;
  } catch (error) {
    return `恭喜 ${name}！`;
  }
}
