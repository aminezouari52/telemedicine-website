// HOOKS
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// STYLE
import { Flex, Image, Spinner } from "@chakra-ui/react";

// ASSETS
import loginImg from "../../images/login.webp";
import loginLogo from "../../images/login-logo.png";

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // REDIRECT USER
  const user = useSelector((state) => state.user.loggedInUser);
  useEffect(() => {
    const intended = location.state;
    if (intended) {
      return;
    } else {
      if (user && user.token) {
        if (user.role === "doctor") {
          navigate("/doctor");
        } else if (user.role === "patient") {
          navigate("/patient");
        }
      }
      setIsLoading(false);
    }
  }, [user, navigate, location]);

  return isLoading ? (
    <Spinner
      pos="absolute"
      top="50%"
      right="50%"
      thickness="4px"
      emptyColor="gray.200"
      color="primary.500"
      size="xl"
    />
  ) : (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      h="100vh"
      bg="#fff"
    >
      <Flex
        pos="absolute"
        top="10px"
        left="10px"
        cursor="pointer"
        onClick={() => navigate("/")}
      >
        <Image
          objectFit="cover"
          src={loginLogo}
          alt="product image"
          h="30px"
          w="140px"
          _hover={{
            opacity: 0.7,
          }}
        />
      </Flex>
      <Flex justifyContent="center" alignItems="center" w="50%">
        {children}
      </Flex>
      <Flex h="100vh" w="50%">
        <Image objectFit="cover" src={loginImg} alt="product image" />
      </Flex>
    </Flex>
  );
};

export default AuthWrapper;
