// HOOKS
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

// FIREBASE
import { auth } from "@/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

// COMPONENTS
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
        url: `${import.meta.env.VITE_API_BASE_URL}/login/`,
        handleCodeInApp: true,
      };
      await sendPasswordResetEmail(auth, email, config);
      setEmail("");
      setLoading(false);
      toast({
        title: "Link sent successfully",
        description: "Please check your inbox",
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
          Forgotten password
        </Heading>
        <Text color="darkgray" textAlign="center">
          Enter your email below to receive a link
        </Text>
      </Flex>
      <Flex w="100%" direction="column" gap={1}>
        <Input
          focusBorderColor="primary.500"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your email"
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
          Reset
        </Button>
      </Flex>
      <Flex fontSize="sm">
        <Text color="gray" mr={1}>
          Don't have an account?
        </Text>
        <Link
          as={NavLink}
          to="/auth/register"
          color="primary.500"
          fontWeight="semibold"
          _hover={{ textDecoration: "underline" }}
        >
          Register
        </Link>
      </Flex>
    </Flex>
  );
};

export default ForgotPassword;
