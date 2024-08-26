import { Flex, Box, Image, Heading } from "@chakra-ui/react";
import NotFoundImg from "../images/not-found.svg";

const NotFound = () => {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      bg="#fff"
      h="100vh"
    >
      <Box m={4}>
        <Image boxSize="400px" src={NotFoundImg} alt="Dan Abramov" />
      </Box>
      <Heading size="md" textAlign="center" m={2}>
        Désolé! La page que vous recherchez est introuvable.
      </Heading>
    </Flex>
  );
};

export default NotFound;
