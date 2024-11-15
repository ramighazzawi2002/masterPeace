const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Initialize Gemini-Pro
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Store chat histories in memory (consider using Redis or a database for production)
const chatHistories = new Map();

const chatWithAI = async (req, res) => {
  try {
    const { message, chatId } = req.body;

    // Get or create chat history
    if (!chatHistories.has(chatId)) {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        systemInstruction:
          "You are a specialized AI assistant for Jordan Heritage. Your name is مساعد التراث (Heritage Assistant). You must only answer questions related to Jordanian heritage, culture, history, traditional crafts, and tourism. If asked about anything else, politely explain that you can only discuss topics related to Jordan's heritage. Always respond in Arabic unless specifically asked to use another language. Be friendly and enthusiastic about sharing knowledge of Jordan's rich cultural heritage, You Must respond accurately answers search in google.",
      });
      const chat = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      });

      chatHistories.set(chatId, chat);
    }

    const chat = chatHistories.get(chatId);

    // Send message and get response
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ message: "Error generating response" });
  }
};

// Add a cleanup function to remove old chat histories periodically
setInterval(() => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [chatId, chat] of chatHistories.entries()) {
    if (chat.lastAccessTime < oneHourAgo) {
      chatHistories.delete(chatId);
    }
  }
}, 60 * 60 * 1000); // Run every hour

module.exports = { chatWithAI };
