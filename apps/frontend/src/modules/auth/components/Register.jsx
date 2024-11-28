// REACT
import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

// REDUX
import { useDispatch } from "react-redux";
import { setUser } from "@/reducers/userReducer";

// FIREBASE
import { auth } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { validateEmail } from "@/utils";

// FUNCTIONS
import { createOrUpdateUser } from "@/modules/auth/functions/auth";

// STYLE
import {
  Flex,
  Input,
  Button,
  Heading,
  Text,
  Link,
  Select,
} from "@chakra-ui/react";

const Register = () => {
  let dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // create user
    try {
      if (!validateEmail(email)) {
        throw new Error("Invalid Email");
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // get user id token
      const user = userCredential.user;
      const idTokenResult = await user.getIdTokenResult();

      // save to database
      const res = await createOrUpdateUser({
        token: idTokenResult.token,
        role,
      });

      dispatch(
        setUser({
          ...res.data,
          token: idTokenResult.token,
        })
      );

      // redirect
      if (role === "doctor") {
        navigate("/doctor");
      } else if (role === "patient") {
        navigate("/patient");
      }

      toast({
        title: "Account created successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Verify your email",
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
      h="100vh"
      w="325px"
      direction="column"
      alignItems="center"
      justifyContent="center"
      gap={4}
      onSubmit={handleSubmit}
    >
      <Flex
        gap="6px"
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Heading size="lg">Welcome!</Heading>
        <Text color="darkgray">Welcome! Please create your account</Text>
      </Flex>
      <Flex w="100%" direction="column" gap={2}>
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
        <Flex w="100%" gap={4} alignItems="center">
          <Text flexWrap="nowrap" whiteSpace="nowrap">
            You are a{" "}
          </Text>
          <Select
            onChange={(e) => setRole(e.target.value)}
            focusBorderColor="primary.500"
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </Select>
        </Flex>
      </Flex>
      <Flex direction="column" gap={2} w="100%">
        <Button
          type="submit"
          isDisabled={!email || password.length < 6}
          isLoading={loading}
          colorScheme="primary"
          size="sm"
          _hover={{
            opacity: email && password.length >= 6 && "0.8",
          }}
        >
          Register
        </Button>
      </Flex>

      <Flex fontSize="sm">
        <Text color="gray" mr={1}>
          Already have an account?
        </Text>
        <Link
          as={NavLink}
          to="/auth/login"
          color="primary.500"
          fontWeight="semibold"
          _hover={{ textDecoration: "underline" }}
        >
          Login
        </Link>
      </Flex>
    </Flex>
  );
};

export default Register;
