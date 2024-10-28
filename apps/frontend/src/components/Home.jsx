// HOOKS
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

// LIBRARYES
import { motion } from "framer-motion";

// STYLE
import { Heading, Flex, Box, Text, Button, Spinner } from "@chakra-ui/react";

// ASSETS
import HeroVid from "@/images/hero-video2.mp4";

const videoStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const Home = () => {
  const loggedInUser = useSelector((state) => state.user.loggedInUser);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // REDIRECT USER
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
        }
      }
      setIsLoading(false);
    }
  }, [loggedInUser, navigate, location]);

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
    <Box flexDirection="column" justifyContent="center" pos="relative">
      <Flex gap="10px" pos="absolute" right="20px" top="10px" zIndex="6">
        <Button
          _hover={{
            color: "primary.500",
          }}
          colorScheme="blackAlpha"
          color="#fff"
          size="sm"
          onClick={() => navigate("/auth/register")}
        >
          S'inscrire
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
          Se connecter
        </Button>
      </Flex>
      <Box h="100vh">
        <video loop muted autoPlay={true} style={videoStyle}>
          <source src={HeroVid} type="video/mp4" />
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
        padding={{ sm: 4, md: 8, lg: 10 }}
        zIndex={2}
        bg="rgba(0, 0, 0, 0.4)"
      >
        <Heading
          textAlign="center"
          fontSize={{ sm: "3xl", md: "3xl", lg: "5xl" }}
          as="h1"
          color="white"
          py={6}
          width={{ sm: "100", md: "90%", lg: "80%" }}
        >
          Consultez un Expert Depuis Chez Vous!
        </Heading>
        <Text
          textAlign="center"
          color="white"
          py={6}
          width="60%"
          fontSize="large"
          display={{ sm: "none", md: "block" }}
        >
          Accédez à des consultations en ligne avec des professionnels
          qualifiés, où que vous soyez. Simplifiez vos démarches et obtenez des
          conseils personnalisés en quelques clics.
          <br></br>
          La santé et le bien-être à portée de main!
        </Text>
        <Box py={6}>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size={{
                sm: "sm",
                md: "md",
                lg: "lg",
              }}
              marginRight={4}
              colorScheme="primary"
              color="white"
              transition="all 0.3s ease-in-out" // Transition added
              _hover={{
                background: "white",
                color: "primary.500",
              }}
              onClick={() => navigate("/auth/login")}
            >
              S'inscrire maintenant!
            </Button>
          </motion.div>
        </Box>
      </Flex>
    </Box>
  );
};

export default Home;
