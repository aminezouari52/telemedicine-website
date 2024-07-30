// HOOKS
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

// COMPONENTS
import HeaderButton from "./HeaderButton";

import loginLogo from "../../images/login-logo.png";

// STYLE
import {
  Box,
  Flex,
  Text,
  Image,
  IconButton,
  SimpleGrid,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";

// ASSETS
import { useEffect, useState } from "react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { FaRegUser } from "react-icons/fa";

import { signOut } from "firebase/auth";
import { logout } from "../../reducers/userReducer";
import { auth } from "../../firebase";

const DoctorHeader = () => {
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
      await signOut(auth);
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
    <Box pos="sticky" top="0" zIndex="11">
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
          onClick={() => navigate("/doctor/home")}
          cursor="pointer"
          _hover={{
            opacity: 0.7,
          }}
        />
        <Flex alignItems="center" gap="20px" height="100%">
          <HeaderButton pathname="/doctor/home">
            <Text fontSize="sm">Acceuil</Text>
          </HeaderButton>
          <HeaderButton pathname="/doctor/consultations">
            <Text fontSize="sm">Consultations</Text>
          </HeaderButton>
          <HeaderButton pathname="/doctor/patients">
            <Text fontSize="sm">patiens</Text>
          </HeaderButton>
        </Flex>
        <Flex alignItems="center" justifyContent="flex-end" height="100%">
          <Menu>
            <MenuButton
              size="sm"
              as={IconButton}
              icon={<FaRegUser />}
            ></MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate("/doctor/profile")}>
                Profil
              </MenuItem>
              <MenuItem onClick={logoutHandler}>Déconnecter</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </SimpleGrid>
    </Box>
  );
};

export default DoctorHeader;
