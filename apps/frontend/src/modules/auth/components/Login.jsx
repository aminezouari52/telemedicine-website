// FIREBASE
import { auth } from "@/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

// HOOKS
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

// FUNCTIONS
import { loginUser } from "@/modules/auth/functions/auth";
import { setUser } from "@/reducers/userReducer";

// COMPONENTS
import { NavLink } from "react-router-dom";
import Logo from "@/components/Logo";

// STYLE
import { Flex, Heading, Input, Button, Link, Text } from "@chakra-ui/react";

// ASSETS
import { AiOutlineMail } from "react-icons/ai";

const demoAccounts = ["freddie24@yahoo.com", "christop_hagenes21@gmail.com"];

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const roleBasedRedirect = (res) => {
    const intended = location.state;
    if (intended) {
      navigate(intended.from);
    } else {
      if (res.data.role === "doctor") {
        navigate("/doctor/home");
      } else if (res.data.role === "patient") {
        navigate("/patient/home");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const { user } = result;

      if (!demoAccounts.includes(email) && !user.emailVerified) {
        await signOut(auth);
        throw new Error("Email not verified. Please verify your email.");
      }

      const idTokenResult = await user.getIdTokenResult();
      const res = await loginUser({ token: idTokenResult.token });

      dispatch(
        setUser({
          ...res.data,
          token: idTokenResult.token,
        })
      );
      roleBasedRedirect(res);
    } catch (error) {
      console.log(error);
      toast({
        title: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <Flex
      as="form"
      w="325px"
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap={12}
      onSubmit={handleSubmit}
    >
      <Flex cursor="pointer" onClick={() => navigate("/")}>
        <Logo w="280px" />
      </Flex>
      <Flex
        gap={2}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Heading size="lg" textAlign="center">
          Welcome Back!
        </Heading>
        <Text color="darkgray" textAlign="center">
          Login to access the platform
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
          size="md"
          mt={2}
        />

        <Input
          focusBorderColor="primary.500"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="your password"
          size="md"
        />
        <Link
          as={NavLink}
          to="/auth/forgot-password"
          color="primary.500"
          _hover={{ textDecoration: "underline" }}
          fontSize="sm"
        >
          Forgot your password?
        </Link>

        <Flex direction="column" gap={2} w="100%">
          <Button
            type="submit"
            leftIcon={<AiOutlineMail />}
            isDisabled={!email || password.length < 6}
            isLoading={loading}
            colorScheme="primary"
            size="sm"
            _hover={{
              opacity: email && password.length >= 6 && 0.8,
            }}
          >
            Login
          </Button>
        </Flex>
      </Flex>

      <Flex fontSize="sm" w="100%" justifyContent="center">
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

export default Login;
