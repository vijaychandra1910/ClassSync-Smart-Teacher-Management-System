const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Chatbot logic
const chatbotController = async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ reply: "Please provide a message." });
  }

  // Check if API key is configured
  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY is not set in environment variables");
    return res.status(500).json({
      reply:
        "Chatbot service is not configured. Please contact the administrator.",
    });
  }

  console.log("Chatbot endpoint hit, message:", message);

  try {
    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are a helpful assistant for ClassSync. Only answer questions related to dashboards, schedules, teachers, substitutions, and user roles.
          `.trim(),
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
    });

    const reply =
      response.choices[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";
    res.json({ reply });
  } catch (error) {
    console.error(
      "Groq chatbot error:",
      error?.response?.data || error.message
    );

    // Extract error message from different error formats
    let errorMessage = "Failed to get response from chatbot";

    if (error?.response?.data?.error?.message) {
      errorMessage = error.response.data.error.message;
    } else if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.message) {
      errorMessage = error.message;
    }

    // Check for specific error types
    if (
      errorMessage.includes("decommissioned") ||
      errorMessage.includes("no longer supported")
    ) {
      errorMessage =
        "The AI model needs to be updated. Please contact the administrator.";
    } else if (
      errorMessage.includes("401") ||
      errorMessage.includes("Unauthorized")
    ) {
      errorMessage = "Invalid API key. Please check the chatbot configuration.";
    } else if (
      errorMessage.includes("429") ||
      errorMessage.includes("rate limit")
    ) {
      errorMessage = "Too many requests. Please try again in a moment.";
    }

    // Return error in reply format so frontend can display it
    res.status(500).json({
      reply: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
    });
  }
};

module.exports = { chatbotController };
