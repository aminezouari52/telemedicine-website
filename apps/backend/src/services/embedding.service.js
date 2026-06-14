const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");

const EMBEDDING_MODEL = "gemini-embedding-001"; // 3072-dimensional vectors

let embeddings;

// Lazily construct a single embeddings client, mirroring the guard pattern in
// ai.service.js so a missing key fails loudly rather than producing garbage.
const getEmbeddings = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Server is missing GEMINI_API_KEY.");
  }

  if (!embeddings) {
    embeddings = new GoogleGenerativeAIEmbeddings({
      model: EMBEDDING_MODEL,
      apiKey,
    });
  }

  return embeddings;
};

// Embed a single piece of text into a 768-float vector. Used both when
// indexing patient data and when embedding a search query.
const embedText = async (text) => {
  return getEmbeddings().embedQuery(text);
};

module.exports = {
  embedText,
  EMBEDDING_MODEL,
};
