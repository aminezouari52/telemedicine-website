import { useRef, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import { GoogleGenAI } from "@google/genai";
import {
  Box,
  VStack,
  Text,
  HStack,
  Spacer,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Heading,
  IconButton,
  InputLeftElement,
  Tooltip,
  Button,
  Tag,
  TagLabel,
  TagCloseButton,
  Image,
} from "@chakra-ui/react";
import { ArrowUpIcon, AttachmentIcon } from "@chakra-ui/icons";
import ReactMarkdown from "react-markdown";
import pdfSvg from "@/assets/pdf.svg";

import pdfToText from "react-pdftotext";
import { keyframes } from "@emotion/react";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const chat = ai.chats.create({
  model: "gemini-2.5-flash",
});

const CONTEXT = `
You are a helpful AI medical assistant. 
- Always provide concise, structured, and easy-to-read answers. 
- Use markdown formatting properly:
  - Headings: ## Heading
  - Numbered lists: 1. 2. 3. (each on a new line)
  - Bullet points: - item (each on a new line)
- Limit answers to a maximum of 5 bullet points or 5 numbered items.
- Keep sentences short and clear.
- Tone: professional, empathetic, and supportive.
- If asked to explain something, give a summary first, then optional details.
- If a PDF is provided, summarize key findings instead of pasting the full text.
`;

const pulse = keyframes`
  0%, 100% { 
  transform: scale(1); color: #7967f0ff; }
  50% {  color: #352763ff; }
`;

const PatientAI = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [pdfBase64, setPdfBase64] = useState(null);
  const [pdfInfo, setPdfInfo] = useState({ name: "", size: 0 });
  const inputElement = useRef();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ input, pdfBase64 }) => {
      const pdfPrompt = pdfBase64 ? `\n\nPDF content:\n${pdfBase64}` : "";

      const response = await chat.sendMessage({
        message: `Context:\n${CONTEXT}\n\nQuestion: ${input}${pdfPrompt}`,
      });

      return response.text || "No response";
    },
    onSuccess: (aiResponse) => {
      setMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
    },
  });

  const handleSend = async () => {
    if (!userInput.trim()) return;
    const userMsg = { role: "user", text: userInput, hasPdf: !!pdfBase64 };
    setMessages((prev) => [...prev, userMsg]);

    mutate({ input: userInput, pdfBase64 });

    setUserInput("");
    setPdfBase64(null);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPdfInfo({ name: file.name, size: file.size });
    const pdfText = await pdfToText(file);
    setPdfBase64(pdfText);

    inputElement.current.focus();
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
        maxW={{ sm: "720px", lg: "900px" }}
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
                <Flex
                  direction="column"
                  gap={4}
                  alignItems={msg.hasPdf ? "end" : "start"}
                >
                  {msg.hasPdf && (
                    <Tag
                      size="lg"
                      borderRadius="xl"
                      variant="outline"
                      colorScheme="primary"
                      height="60px"
                      mt={6}
                    >
                      <Image src={pdfSvg} alt="logo" h="25px" />
                      <Box ms={2}>
                        <TagLabel fontSize="md" color="primary.800">
                          {pdfInfo.name}
                        </TagLabel>
                        <Text color="gray" fontSize="sm">
                          {(pdfInfo.size / 1024 / 1024).toFixed(2)} MB
                        </Text>
                      </Box>
                    </Tag>
                  )}
                  <Box bg="primary.100" p={3} borderRadius="md">
                    <Text fontWeight="medium" color="primary.700">
                      {msg.text}
                    </Text>
                  </Box>
                </Flex>
              </>
            )}
          </HStack>
        ))}
        {isPending && <AiThinkingLoader />}

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
                      accept="application/pdf"
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
                    borderRadius="xl"
                    variant="outline"
                    colorScheme="primary"
                    height="60px"
                    mt={6}
                  >
                    <Image src={pdfSvg} alt="logo" h="25px" />
                    <Box ms={2}>
                      <TagLabel fontSize="md" color="primary.800">
                        {pdfInfo.name}
                      </TagLabel>
                      <Text color="gray" fontSize="sm">
                        {(pdfInfo.size / 1024 / 1024).toFixed(2)} MB
                      </Text>
                    </Box>
                    <TagCloseButton
                      fontSize="xl"
                      color="#000"
                      fontWeight="bold"
                      onClick={() => setPdfBase64(null)}
                    />
                  </Tag>
                </Flex>
              )}
            </InputLeftElement>

            <Input
              ref={inputElement}
              bg="#fff"
              type="text"
              value={userInput}
              placeholder="Ask anything..."
              width="100%"
              size="lg"
              paddingLeft={pdfBase64 ? "25px" : "60px"}
              height={pdfBase64 ? "140px" : "60px"}
              paddingTop={pdfBase64 ? "60px" : "0"}
              shadow="md"
              borderRadius="3xl"
              colorScheme="primary"
              onChange={(e) => setUserInput(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = "#805ad5")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isPending && userInput.trim()) {
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
                  disabled={isPending || !userInput.trim()}
                  colorScheme="primary"
                  borderRadius="full"
                  top={pdfBase64 ? "200%" : "10px"}
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

const AiThinkingLoader = () => {
  const aiMessages = [
    "AI is thinking...",
    "Analyzing data...",
    "Formulating response...",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let count = 0;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % aiMessages.length);
      count++;

      if (count >= 2) {
        clearInterval(interval);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [aiMessages.length]);

  return (
    <Flex>
      <VStack spacing={2} m={4}>
        <Box height="24px">
          <Text fontSize="md" animation={`${pulse} 1.2s ease-in-out infinite`}>
            {aiMessages[currentIndex]}
          </Text>
        </Box>
      </VStack>
    </Flex>
  );
};

export default PatientAI;
