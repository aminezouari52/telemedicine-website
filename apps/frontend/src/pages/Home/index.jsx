// HOOKS
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// LIBRARYES
import { motion } from "framer-motion";

// COMPONENTS
import Logo from "@/components/Logo";
import Spinner from "@/components/Spinner";
import HowItWorks from "./HowItWorks";
import Footer from "./Footer";

// STYLE
import { Heading, Flex, Box, Text, Button } from "@chakra-ui/react";

const videoStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const Home = () => {
  const user = useSelector((state) => state.userReducer.user);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.token) {
      if (user.role === "doctor") navigate("/doctor");
      else if (user.role === "patient") navigate("/patient");
    }
    setIsLoading(false);
  }, [user]);

  return isLoading ? (
    <Spinner />
  ) : (
    <Box>
      <Box flexDirection="column" justifyContent="center" pos="relative">
        <Flex
          gap="10px"
          pos="absolute"
          alignItems="center"
          px={4}
          zIndex="3"
          w="100%"
          justifyContent="space-between"
        >
          <Logo />
          <Flex gap={2}>
            <Button
              color="#fff"
              _hover={{
                color: "primary.500",
              }}
              size="sm"
              colorScheme="blackAlpha"
              onClick={() => navigate("/auth/register")}
            >
              Register
            </Button>
            <Button
              _hover={{
                color: "primary.500",
              }}
              colorScheme="blackAlpha"
              color="#fff"
              onClick={() => navigate("/auth/login")}
              size="sm"
            >
              Login
            </Button>
          </Flex>
        </Flex>
        <Box h="100vh">
          <video loop muted autoPlay={true} style={videoStyle}>
            <source
              src="https://res.cloudinary.com/dfzx2pdi3/video/upload/v1739200039/dn3xyzxsq8qruqojnpkj.mp4"
              type="video/mp4"
            />
          </video>
        </Box>
        <Flex
          pos="absolute"
          top="0"
          h="100%"
          w="100%"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          padding={8}
          zIndex={2}
          bg="rgba(0, 0, 0, 0.4)"
        >
          <Heading
            textAlign="center"
            fontSize="3xl"
            as="h1"
            color="white"
            py={6}
          >
            Consult an Expert From Home!
          </Heading>
          <Text
            textAlign="center"
            color="white"
            py={6}
            width="60%"
            fontSize="large"
          >
            Access online consultations with qualified professionals, wherever
            you are. Simplify your procedures and get personalized advice in
            just a few clicks.
            <br></br>
            Health and well-being at your fingertips!
          </Text>
          <Box py={6}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                size="lg"
                marginRight={4}
                colorScheme="primary"
                color="white"
                transition="all 0.3s ease-in-out"
                _hover={{
                  background: "white",
                  color: "primary.500",
                }}
                onClick={() => navigate("/auth/login")}
              >
                Register now!
              </Button>
            </motion.div>
          </Box>
        </Flex>
      </Box>
      <HowItWorks />
      <Footer />
    </Box>
  );
};

export default Home;
