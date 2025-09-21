import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import {
  Box,
  Text,
  HStack,
  Avatar,
  Spacer,
  Flex,
  Button,
  Input,
} from "@chakra-ui/react";
// import { createClient } from "@supabase/supabase-js";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const chat = ai.chats.create({
  model: "gemini-2.5-flash",
});

// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_KEY,
// );

const AiResponse = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const embedText = async (text) => {
  //   const res = await ai.models.embedContent({
  //     model: "gemini-embedding-001",
  //     contents: text,
  //   });

  //   const embedding = res.embeddings[0].values;
  //   await supabase.from("medical_docs").insert([
  //     {
  //       content: text,
  //       embedding,
  //     },
  //   ]);

  //   return embedding;
  // };

  // const getRelevantDocs = async (question) => {
  //   const questionEmbedding = await embedText(question);

  //   const { data, error } = await supabase.rpc("get_top_docs", {
  //     query: questionEmbedding,
  //     limit_count: 3,
  //   });

  //   if (error) console.error("Supabase error:", error);

  //   return data;
  // };

  const handleSend = async () => {
    if (!userInput.trim()) return;
    const userMsg = { role: "user", text: userInput };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError("");
    setUserInput("");

    try {
      // const docs = await getRelevantDocs(userInput);
      // const context = docs.map((doc) => doc.content).join("\n\n");
      const context = "";

      const response = await chat.sendMessage({
        message: `Context:\n${context}\n\nQuestion: ${userInput}`,
      });

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: response.text || "No response" },
      ]);
    } catch (err) {
      setError(err.message || "Error generating content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Flex direction="column">
        <Box w="100%" maxH="320px" overflowY="auto" p={4} borderRadius="md">
          {messages.length === 0 && (
            <Text color="gray.400" textAlign="center">
              No messages yet. Start the conversation!
            </Text>
          )}
          {messages.map((msg, idx) => (
            <HStack key={idx} alignItems="flex-start" mb={4}>
              {msg.role === "user" ? (
                <>
                  <Avatar size="sm" name="You" bg="blue.300" />
                  <Box bg="blue.100" p={3} borderRadius="md" maxW="70%">
                    <Text fontWeight="medium" color="blue.700">
                      {msg.text}
                    </Text>
                  </Box>
                  <Spacer />
                </>
              ) : (
                <>
                  <Spacer />
                  <Box bg="primary.100" p={3} borderRadius="md" maxW="70%">
                    <Text fontWeight="medium" color="primary.700">
                      {msg.text}
                    </Text>
                  </Box>
                  <Avatar size="sm" name="AI" bg="primary.400" />
                </>
              )}
            </HStack>
          ))}
        </Box>
        <Box w="100%">
          <Input
            type="text"
            value={userInput}
            placeholder="Type your message..."
            width="100%"
            mb={2}
            colorScheme="primary"
            onChange={(e) => setUserInput(e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = "#805ad5")}
            onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading && userInput.trim()) {
                handleSend();
              }
            }}
          />
          <Button
            onClick={handleSend}
            disabled={loading || !userInput.trim()}
            colorScheme="primary"
            w="full"
          >
            {loading ? "Thinking..." : "Send"}
          </Button>
        </Box>
        {error && (
          <Box w="100%" bg="red.50" p={3} borderRadius="md">
            <Text color="red.600">{error}</Text>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default AiResponse;
