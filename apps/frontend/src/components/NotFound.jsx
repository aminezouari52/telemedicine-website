import { useNavigate } from "react-router-dom";
import { Flex, Image, Heading, Button } from "@chakra-ui/react";
import NotFoundImg from "@/assets/not-found.svg";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Flex
      bg="#fff"
      h="100vh"
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap={10}
    >
      <Image boxSize="400px" src={NotFoundImg} alt="Dan Abramov" />
      <Heading size="md" textAlign="center">
        Sorry! The page you are looking for could not be found.
      </Heading>
      <Button
        size="sm"
        colorScheme="primary"
        _hover={{
          opacity: 0.8,
        }}
        onClick={() => navigate("/")}
      >
        Return to the home page
      </Button>
    </Flex>
  );
};

export default NotFound;
