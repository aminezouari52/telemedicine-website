// HOOKS
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

// FIREBASE
import { auth } from "@/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

// COMPONENTS
import AuthWrapper from "./AuthWrapper";
import { NavLink } from "react-router-dom";

// STYLE
import { Flex, Heading, Input, Button, Text, Link } from "@chakra-ui/react";

const ForgotPassword = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = {
        url: import.meta.env.VITE_REACT_APP_FORGOT_PASSWORD_REDIRECT,
        handleCodeInApp: true,
      };
      await sendPasswordResetEmail(auth, email, config);
      setEmail("");
      setLoading(false);
      toast({
        title: "Lien envoyée avec succès",
        description: "Veuillez vérifier votre boîte de réception",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } catch (err) {
      setLoading(false);
      toast({
        title: "Failed to send password reset email",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <AuthWrapper>
      <Flex
        h="100vh"
        w="325px"
        direction="column"
        justifyContent="center"
        alignItems="center"
        gap={4}
      >
        <Flex
          gap={2}
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Heading textAlign="center" size="lg">
            Mot de passe oublié
          </Heading>
          <Text color="darkgray" textAlign="center">
            Entrez votre email ci-dessous pour recevoir un lien
          </Text>
        </Flex>
        <Flex w="100%" direction="column" gap={1}>
          <Input
            focusBorderColor="primary.500"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre email"
            autoFocus
            mb={2}
          />
          <Button
            type="submit"
            colorScheme="primary"
            size="sm"
            w="100%"
            isDisabled={!email}
            isLoading={loading}
            _hover={{
              opacity: email && "0.8",
            }}
            onClick={handleSubmit}
          >
            Réinitialiser
          </Button>
        </Flex>
        <Flex fontSize="sm">
          <Text color="gray" mr={1}>
            Vous n'avez pas de compte ?
          </Text>
          <Link
            as={NavLink}
            to="/register"
            color="primary.500"
            fontWeight="semibold"
            _hover={{ textDecoration: "underline" }}
          >
            S'inscrire
          </Link>
        </Flex>
      </Flex>
    </AuthWrapper>
  );
};

export default ForgotPassword;
