import { useNavigate } from "react-router-dom";
import { Flex, Image, Heading, Button } from "@chakra-ui/react";
import NotFoundImg from "@/images/not-found.svg";

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
        Désolé! La page que vous recherchez est introuvable.
      </Heading>
      <Button
        size="sm"
        colorScheme="primary"
        _hover={{
          opacity: 0.8,
        }}
        onClick={() => navigate("/")}
      >
        Retourner vers la page d'acceuil
      </Button>
    </Flex>
  );
};

export default NotFound;
