// HOOKS
import { useState } from "react";
import { useToast } from "@/hooks";
import { useNavigate } from "react-router-dom";

// FIREBASE
import { auth } from "@/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

// COMPONENTS
import { NavLink } from "react-router-dom";
import Logo from "@/components/Logo";

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
      await sendPasswordResetEmail(auth, email);
      setEmail("");
      toast("Link sent successfully", "Please check your inbox");
      navigate("/auth/login");
    } catch (err) {
      toast("Failed to send password reset email", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      as="form"
      h="100vh"
      w="325px"
      direction="column"
      justifyContent="center"
      alignItems="center"
      gap={12}
      onSubmit={handleSubmit}
    >
      <Flex cursor="pointer" onClick={() => navigate("/")}>
        <Logo w="280px" />
      </Flex>
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        <Heading textAlign="center" size="lg">
          Forgotten password
        </Heading>
        <Text color="darkgray" textAlign="center">
          Enter your email below to receive a link
        </Text>
      </Flex>
      <Flex w="100%" direction="column" alignItems="end" gap={2}>
        <Input
          focusBorderColor="primary.500"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your email"
          autoFocus
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
