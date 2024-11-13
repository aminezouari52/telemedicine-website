import { Box, Spinner as ChakraSpinner } from "@chakra-ui/react";

const Spinner = () => {
  return (
    <Box
      backgroundColor="loading"
      pos="absolute"
      inset="0"
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex="5"
    >
      <ChakraSpinner
        thickness="4px"
        emptyColor="gray.200"
        color="primary.500"
        size="xl"
      />
    </Box>
  );
};

export default Spinner;
