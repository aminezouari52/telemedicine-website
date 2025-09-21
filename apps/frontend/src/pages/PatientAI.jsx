import { Box, Heading, Text, VStack } from "@chakra-ui/react";

import AiResponse from "./AiResponse";

const PatientAI = () => {
  return (
    <Box
      minH="80vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="#fafafa"
    >
      <VStack
        spacing={8}
        p={10}
        bg="white"
        borderRadius="2xl"
        boxShadow="2xl"
        maxW="lg"
        w="100%"
      >
        <Heading size="lg" color="primary.600">
          AI Consultation
        </Heading>
        <Text fontSize="md" color="gray.600">
          Welcome to your AI-powered consultation!
          <br />
          This feature will help you get instant medical advice and support.
        </Text>
        <AiResponse />
      </VStack>
    </Box>
  );
};

export default PatientAI;
