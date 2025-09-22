import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import {
  Box,
  Text,
  HStack,
  Spacer,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Heading,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import ReactMarkdown from "react-markdown";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const chat = ai.chats.create({
  model: "gemini-2.5-flash",
});

const PatientAI = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!userInput.trim()) return;
    const userMsg = { role: "user", text: userInput };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setUserInput("");

    try {
      const context = `
        You are a helpful AI medical assistant. 
        Your task is to provide general medical guidance and help users prepare for a consultation with a real doctor. 
        - Always include a disclaimer that you are not a medical professional. 
        - Provide structured and easy-to-read answers. 
        - Use headings, numbered lists, or bullet points when giving advice or questions. 
        - Keep your tone professional, empathetic, and clear.
      `;

      const response = await chat.sendMessage({
        message: `Context:\n${context}\n\nQuestion: ${userInput}`,
      });

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: response.text || "No response" },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      minH="80vh"
      gap="100"
    >
      {messages.length === 0 && (
        <Heading size="lg" color="primary.500" textAlign="center">
          What's bothering you today?
        </Heading>
      )}
      <Flex direction="column" maxW="1000px" w="100%" px={4} pt={6}>
        {messages.map((msg, idx) => (
          <HStack key={idx} alignItems="flex-start" mb={4}>
            {msg.role === "ai" ? (
              <>
                <Box whiteSpace="pre-wrap">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
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
              </>
            )}
          </HStack>
        ))}
        {loading && <Spinner m={4} color="primary.500" />}

        <InputGroup position="sticky" bottom={0} pb={8}>
          <Input
            bg="#fff"
            type="text"
            value={userInput}
            placeholder="Ask anything..."
            width="100%"
            size="lg"
            height="60px"
            shadow="md"
            borderRadius="full"
            ps={6}
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

          <InputRightElement>
            <IconButton
              size="sm"
              aria-label="Send message"
              icon={<ArrowUpIcon />}
              onClick={handleSend}
              disabled={loading || !userInput.trim()}
              colorScheme="primary"
              borderRadius="full"
              top="10px"
              right="8px"
            />
          </InputRightElement>
        </InputGroup>
      </Flex>
    </Flex>
  );
};

export default PatientAI;
