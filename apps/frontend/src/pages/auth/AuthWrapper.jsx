// HOOKS
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// STYLE
import { Box, Flex, Image } from "@chakra-ui/react";

// ASSETS
import loginImg from "../../images/login.webp";
import loginLogo from "../../images/login-logo.png";

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // REDIRECT USER
  const loggedInUser = useSelector((state) => state.user.loggedInUser);
  useEffect(() => {
    const intended = location.state;
    if (intended) {
      return;
    } else {
      if (loggedInUser && loggedInUser.token) {
        if (loggedInUser.role === "doctor") {
          navigate("/doctor");
        } else if (loggedInUser.role === "patient") {
          navigate("/patient");
        } else {
          navigate("/admin");
        }
      }
    }
  }, [loggedInUser, navigate, location]);

  return (
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
