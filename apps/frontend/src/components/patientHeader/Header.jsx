// HOOKS
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useToast } from "@chakra-ui/react";

// FUNCTIONS
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { logout } from "../../reducers/userReducer";

// COMPONENTS
import HeaderButton from "./HeaderButton";

// STYLE
import {
  Box,
  Flex,
  Text,
  Image,
  IconButton,
  SimpleGrid,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  chakra,
} from "@chakra-ui/react";

// ASSETS
import { useEffect, useState } from "react";
import { ArrowForwardIcon, ChevronRightIcon } from "@chakra-ui/icons";
import loginLogo from "../../images/login-logo.png";
import { FaRegBell } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const [isAtTop, setIsAtTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      setIsAtTop(scrollTop === 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const logoutHandler = async () => {
    try {
      const res = await signOut(auth);
      dispatch(logout(null));
      navigate("/login");
    } catch (err) {
      console.log(err);
      toast({
        title: "Logout failed!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box position="sticky" top="0" zIndex="11">
      <Flex
        justifyContent="center"
        alignItems="center"
        background="linear-gradient(15deg, #7E8EF1 0%, #615EFC 50%, #7E8EF1 100%)
        "
        _hover={{ bg: "#7E8EF1" }}
        cursor="pointer"
        color="white"
      >
        <Text fontWeight="normal" letterSpacing="2px" p={1} fontSize="sm">
          Obtenez 50% de réduction sur votre première consultation
        </Text>
        <ChevronRightIcon fontSize="xl" />
      </Flex>

      <SimpleGrid
        as="header"
        columns={3}
        background="#fff"
        h={{
          sm: "header.sm",
          md: "header.md",
          lg: "header.lg",
        }}
        w="100%"
        alignItems="center"
        px="56px"
        boxShadow={
          (location.pathname !== "/" || !isAtTop) &&
          "0px 2px 4px rgba(0, 0, 0, 0.2)"
        }
      >
        <Image
          objectFit="cover"
          src={loginLogo}
          alt="product image"
          h="44px"
          w="140px"
          onClick={() => navigate("/patient/home")}
          cursor="pointer"
          _hover={{
            opacity: 0.7,
          }}
        />
        <Flex alignItems="center" gap="20px" height="100%">
          <HeaderButton pathname="/patient/home">
            <Text fontSize="sm">Acceuil</Text>
          </HeaderButton>
          <HeaderButton pathname="/patient/consultations">
            <Text fontSize="sm">Consultations</Text>
          </HeaderButton>
          <HeaderButton pathname="/patient/doctors">
            <Text fontSize="sm">Medecins</Text>
          </HeaderButton>
        </Flex>
        <Flex
          gap={4}
          alignItems="center"
          justifyContent="flex-end"
          height="100%"
        >
          <Menu>
            <MenuButton
              size="md"
              as={IconButton}
              aria-label="label"
              isRound
              bg="secondary.500"
              color="#fff"
              _hover={{
                opacity: 0.8,
              }}
              _focus={{
                bg: "secondary.500",
              }}
              _active={{
                opacity: 0.8,
              }}
              icon={
                <>
                  <FaRegBell />
                  <chakra.span
                    pos="absolute"
                    top="6px"
                    right="6px"
                    p="4px"
                    fontSize="xs"
                    fontWeight="bold"
                    lineHeight="none"
                    color="red.100"
                    transform="translate(50%,-50%)"
                    bg="red.600"
                    rounded="full"
                  />
                </>
              }
            ></MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate("/patient/call")}>
                Vous avez une consultation maintenant
              </MenuItem>
            </MenuList>
          </Menu>
          <Button
            size="sm"
            color="#fff"
            bg="secondary.500"
            variant="solid"
            rightIcon={<ArrowForwardIcon />}
            _hover={{
              opacity: 0.8,
            }}
            onClick={logoutHandler}
          >
            Déconnecter
          </Button>
        </Flex>
      </SimpleGrid>
    </Box>
  );
};

export default Header;
