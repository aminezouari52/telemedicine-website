// HOOKS
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// COMPONENTS
import Spinner from "@/components/Spinner";
import Logo from "@/components/Logo";

// STYLE
import { Flex, Image } from "@chakra-ui/react";

// ASSETS
import loginImg from "@/images/login.webp";

export const AuthLayout = () => {
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
    <Spinner />
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
        <Logo />
      </Flex>
      <Flex justifyContent="center" alignItems="center" w="50%">
        <Outlet />
      </Flex>
      <Flex h="100vh" w="50%">
        <Image objectFit="cover" src={loginImg} alt="product image" />
      </Flex>
    </Flex>
  );
};
