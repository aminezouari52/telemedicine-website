// HOOKS
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// COMPONENTS
import Spinner from "@/components/Spinner";
import Logo from "@/components/Logo";

// STYLE
import {
  Flex,
  IconButton,
  Image,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  Text,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  Box,
} from "@chakra-ui/react";

// ASSETS
import loginImg from "@/images/login.webp";
import { FaInfoCircle } from "react-icons/fa";

export const AuthLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // REDIRECT USER
  const user = useSelector((state) => state.userReducer.user);
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
      <Popover>
        <PopoverTrigger>
          <IconButton
            m={4}
            size="sm"
            color="primary.700"
            icon={<FaInfoCircle />}
            pos="absolute"
            top="0"
            right="50%"
          ></IconButton>
        </PopoverTrigger>
        <PopoverContent w="367px">
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            For testing purposes you can use these credentials
          </PopoverHeader>
          <PopoverBody>
            <Box>
              <Flex gap={1}>
                <Text fontWeight="bold">doctor: </Text>
                <Text>kelli79@hotmail.com</Text>
              </Flex>
              <Flex gap={1}>
                <Text fontWeight="bold">patient: </Text>
                <Text>barbara.ankunding@gmail.com</Text>
              </Flex>
            </Box>
          </PopoverBody>
          <PopoverFooter>
            <Flex gap={1}>
              <Text fontWeight="bold">Password: </Text>
              <Text>testtest</Text>
            </Flex>
          </PopoverFooter>
        </PopoverContent>
      </Popover>

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
