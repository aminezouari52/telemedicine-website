import { Box, Spinner as ChakraSpinner } from "@chakra-ui/react";

const Spinner = () => {
  return (
    <Box
      pos="relative"
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      backgroundColor="loading"
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
