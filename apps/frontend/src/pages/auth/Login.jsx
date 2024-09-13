// FIREBASE
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

// HOOKS
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

// FUNCTIONS
import { createOrUpdateUser } from "@/functions/auth";
import { setLoggedInUser } from "@/reducers/userReducer";

// COMPONENTS
import { NavLink } from "react-router-dom";

// STYLE
import { Flex, Heading, Input, Button, Link, Text } from "@chakra-ui/react";

// ASSETS
import { AiOutlineMail } from "react-icons/ai";
import AuthWrapper from "./AuthWrapper";

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // REDIRECT FUNCTION
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

  // SUBMIT FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();
      // create user in database
      const res = await createOrUpdateUser({ token: idTokenResult.token });
      dispatch(
        setLoggedInUser({
          name: res.data.name,
          email: res.data.email,
          token: idTokenResult.token,
          role: res.data.role,
          _id: res.data._id,
        })
      );
      roleBasedRedirect(res);
    } catch (err) {
      console.log(err);
      toast({
        title: "Email ou mot de passe incorrect",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
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
          gap={2}
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Heading size="lg" textAlign="center">
            Se connecter
          </Heading>
          <Text color="darkgray" textAlign="center">
            Connecter vous pour accèder à la plateforme
          </Text>
        </Flex>
        <Flex w="100%" direction="column" alignItems="end" gap={2}>
          <Input
            focusBorderColor="primary.500"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre email"
            autoFocus
            size={{ sm: "sm", md: "md" }}
            mt={2}
          />

          <Input
            focusBorderColor="primary.500"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
            size={{ sm: "sm", md: "md" }}
          />
          <Link
            as={NavLink}
            to="/forgot-password"
            color="primary.500"
            _hover={{ textDecoration: "underline" }}
            fontSize="sm"
          >
            Mot de passe oublié?
          </Link>
        </Flex>

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
            // onClick={handleSubmit}
          >
            Connectez-vous
          </Button>
        </Flex>

        <Flex fontSize="sm" w="100%" justifyContent="center">
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

export default Login;
