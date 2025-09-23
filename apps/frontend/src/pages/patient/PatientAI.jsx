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
  InputLeftElement,
  Tooltip,
  Button,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import { ArrowUpIcon, AttachmentIcon } from "@chakra-ui/icons";
import ReactMarkdown from "react-markdown";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const chat = ai.chats.create({
  model: "gemini-2.5-flash",
});

const CONTEXT =
  "You are a helpful AI medical assistant. Your task is to provide general medical guidance and help users prepare for a consultation with a real doctor. - Always include a disclaimer that you are not a medical professional. - Provide structured and easy-to-read answers. - Use headings, numbered lists, or bullet points when giving advice or questions. - Keep your tone professional, empathetic, and clear.";

const PatientAI = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "patient",
      text: "Hello doctor, I uploaded my medical report as a PDF. Can you review it and tell me if everything looks fine?",
    },
    {
      role: "ai",
      text: "Of course. I’ll analyze the PDF you provided. Please give me a moment to extract the key details such as lab results, diagnosis, and doctor’s notes.",
    },

    {
      role: "patient",
      text: "I’m particularly worried about my cholesterol levels. Can you check those?",
    },
    {
      role: "ai",
      text: "Yes, your report shows your LDL cholesterol is slightly elevated at 145 mg/dL, while the recommended level is below 130 mg/dL. HDL and triglycerides are within normal range.",
    },

    { role: "patient", text: "What does that mean for my health?" },
    {
      role: "ai",
      text: "It suggests a higher risk for cardiovascular disease over time. I recommend improving your diet, exercising regularly, and following up with your physician for tailored advice.",
    },

    { role: "patient", text: "Should I take medication right away?" },
    {
      role: "ai",
      text: "That decision should be made by your doctor after a full evaluation of your risk factors. For now, lifestyle changes may be the first step unless your doctor recommends otherwise.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [pdfBase64, setPdfBase64] = useState(null);

  const handleSend = async () => {
    if (!userInput.trim()) return;
    const userMsg = { role: "user", text: userInput };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setUserInput("");

    const pdfPrompt = pdfBase64
      ? `\n\nPDF content (base64):\n${pdfBase64}`
      : "";

    try {
      const response = await chat.sendMessage({
        message: `Context:\n${CONTEXT}\n\nQuestion: ${userInput}` + pdfPrompt,
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

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      setPdfBase64(base64);
      console.log("PDF loaded as base64");
    };
    reader.readAsDataURL(file);
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
      <Flex
        direction="column"
        maxW={{ sm: "600px", lg: "900px" }}
        w="100%"
        px={10}
        pt={6}
      >
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

        <InputGroup
          position="sticky"
          display="flex"
          bottom={0}
          flexDirection="column"
          pb={8}
        >
          <Flex w="100%">
            <InputLeftElement w="auto" top="10px" left="10px">
              {!pdfBase64 && (
                <Tooltip label="attach file">
                  <Button
                    as="label"
                    htmlFor="file-input"
                    variant="ghost"
                    aria-label="Send message"
                    colorScheme="primary"
                    borderRadius="full"
                    cursor="pointer"
                  >
                    <AttachmentIcon />
                    <input
                      id="file-input"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </Button>
                </Tooltip>
              )}

              {pdfBase64 && (
                <Flex ms={2}>
                  <Tag
                    size="lg"
                    borderRadius="full"
                    variant="solid"
                    colorScheme="secondary"
                  >
                    <TagLabel>PDF file</TagLabel>
                    <TagCloseButton onClick={() => setPdfBase64(null)} />
                  </Tag>
                </Flex>
              )}
            </InputLeftElement>

            <Input
              bg="#fff"
              type="text"
              value={userInput}
              placeholder="Ask anything..."
              width="100%"
              size="lg"
              height="60px"
              paddingLeft={pdfBase64 ? "140px" : "60px"}
              shadow="md"
              borderRadius="full"
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
              <Tooltip label="send message">
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
              </Tooltip>
            </InputRightElement>
          </Flex>
        </InputGroup>
      </Flex>
    </Flex>
  );
};

export default PatientAI;
