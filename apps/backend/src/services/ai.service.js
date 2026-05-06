const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const {
  AIMessage,
  HumanMessage,
  SystemMessage,
} = require("@langchain/core/messages");

const MODEL_NAME = "gemini-2.5-flash";

const buildUserPrompt = ({ input, pdfContent }) => {
  const sanitizedInput = typeof input === "string" ? input.trim() : "";
  const sanitizedPdfContent =
    typeof pdfContent === "string" ? pdfContent.trim() : "";

  if (!sanitizedPdfContent) {
    return `Question: ${sanitizedInput}`;
  }

  return `Question: ${sanitizedInput}\n\nPDF content:\n${sanitizedPdfContent}`;
};

const getConversationMessages = (conversationHistory = []) => {
  if (!Array.isArray(conversationHistory)) {
    return [];
  }

  // Keep recent turns only to reduce token usage.
  return conversationHistory.slice(-10).reduce((acc, message) => {
    if (!message || typeof message.text !== "string" || !message.text.trim()) {
      return acc;
    }

    if (message.role === "user") {
      acc.push(new HumanMessage(message.text.trim()));
      return acc;
    }

    if (message.role === "ai") {
      acc.push(new AIMessage(message.text.trim()));
    }

    return acc;
  }, []);
};

const askPatientAi = async ({
  input,
  pdfContent,
  context,
  conversationHistory,
}) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Server is missing GEMINI_API_KEY.");
  }

  const model = new ChatGoogleGenerativeAI({
    model: MODEL_NAME,
    apiKey,
  });

  const messages = [
    new SystemMessage(context || ""),
    ...getConversationMessages(conversationHistory),
    new HumanMessage(buildUserPrompt({ input, pdfContent })),
  ];

  const response = await model.invoke(messages);
  return typeof response.content === "string"
    ? response.content
    : "No response";
};

module.exports = {
  askPatientAi,
};
