import "dotenv/config"
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});
const getAiResponse=async(message)=>{
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    return response.text
  } catch (err) {
    console.error(err);
    throw new Error("Gemini API failed")
  }
}
export default getAiResponse 