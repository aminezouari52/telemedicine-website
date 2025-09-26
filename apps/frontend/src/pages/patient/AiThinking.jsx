import { useState, useEffect } from "react";
import { Box, VStack, Text, Flex } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const pulse = keyframes`
  0%, 100% { 
  transform: scale(1); color: #7967f0ff; }
  50% {  color: #352763ff; }
`;

const AiThinking = () => {
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

export default AiThinking;
