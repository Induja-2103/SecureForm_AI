"use server";

export async function sendChatMessage(messages: { role: "user" | "model", parts: { text: string }[] }[]) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return { text: "Error: Gemini API key is not configured." };
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // We only need the latest user message and some context, or we can use the chat API if the SDK supports it.
    // The @google/genai SDK supports chats.
    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction: "You are CyberShield AI, a helpful, elite cybersecurity and application assistant. You help users understand security risks, track applications, and navigate the SecureForm defense platform. Keep responses concise and use markdown.",
      }
    });
    
    // If we have history, we might need to send it differently, but for simplicity we can just prompt the model with the history.
    let historyPrompt = "Chat History:\n";
    for (const msg of messages.slice(0, -1)) {
      historyPrompt += `${msg.role === 'user' ? 'User' : 'CyberShield'}: ${msg.parts[0].text}\n\n`;
    }
    
    const latestMessage = messages[messages.length - 1].parts[0].text;
    const finalPrompt = historyPrompt + `User: ${latestMessage}\n\nCyberShield:`;
    
    const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
    let aiResponse;
    for (const model of modelsToTry) {
      try {
        aiResponse = await ai.models.generateContent({
          model,
          contents: finalPrompt,
        });
        if (aiResponse?.text) break;
      } catch (e: any) {
        console.warn(`[Gemini Chat] Model '${model}' error: ${e.message || e.status || e}`);
      }
    }
    
    return { text: aiResponse?.text || "I'm currently in offline fallback mode because the Gemini API quota limit was reached. Feel free to ask about application safety or tracking!" };
  } catch (error: any) {
    console.warn("Chat error:", error.message || error);
    return { text: "Sorry, I'm currently in offline fallback mode. Please check back later!" };
  }
}
