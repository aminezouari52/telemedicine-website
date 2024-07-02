import { Flex, Box, Image, Heading } from "@chakra-ui/react";
import NotFoundImg from "../images/not-found.svg";

const NotFound = () => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      bg="#fff"
      h="calc(100vh - 40px)"
    >
      <Box m={4}>
        <Image boxSize="400px" src={NotFoundImg} alt="Dan Abramov" />
      </Box>
      <Heading size={{ sm: "sm", md: "md", lg: "lg" }} textAlign="center" m={2}>
        Sorry! The page you are looking for is not found.
      </Heading>
    </Flex>
  );
};

export default NotFound;
