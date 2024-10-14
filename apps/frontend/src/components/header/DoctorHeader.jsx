// HOOKS
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// FUNCTIONS
import { signOut } from "firebase/auth";
import { logout } from "@/reducers/userReducer";
import { auth } from "@/firebase";
import { useSelector } from "react-redux";

// COMPONENTS
import HeaderButton from "./HeaderButton";

// STYLE
import {
  chakra,
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
import { ChevronRightIcon } from "@chakra-ui/icons";
import { FaRegUser, FaRegBell } from "react-icons/fa";
import loginLogo from "@/images/login-logo.png";

export const DoctorHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.loggedInUser);
  const [isProfileCompleted, setIsProfileCompleted] = useState();
  const toast = useToast();

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      dispatch(logout(null));
      navigate("/auth/login");
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

  useEffect(() => {
    const isProfileCompletedEffect = async () => {
      if (user && user.token) {
        setIsProfileCompleted(user.isProfileCompleted);
      }
    };
    isProfileCompletedEffect();
  }, [isProfileCompleted, user]);

  return (
    <Box pos="sticky" top="0" zIndex="5">
      <Flex
        justifyContent="center"
        alignItems="center"
        bgGradient="linear(to-r, #7E8EF1, #615EFC)"
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
        w="100%"
        alignItems="center"
        px="56px"
        shadow="md"
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
              size="md"
              as={IconButton}
              aria-label="notification"
              isRound
              bg="transparent"
              _hover={{
                opacity: 0.6,
              }}
              _active={{
                opacity: 0.6,
              }}
              icon={
                <>
                  <FaRegBell />
                  {!isProfileCompleted && (
                    <chakra.span
                      pos="absolute"
                      top="10px"
                      right="10px"
                      p="4px"
                      fontSize="xs"
                      fontWeight="bold"
                      lineHeight="none"
                      color="red.100"
                      transform="translate(50%,-50%)"
                      bg="red.600"
                      rounded="full"
                    />
                  )}
                </>
              }
            ></MenuButton>
            <MenuList>
              {isProfileCompleted ? (
                <Text px={2}>vous n'avez pas de notifications</Text>
              ) : (
                <MenuItem onClick={() => navigate("/doctor/profile")}>
                  Complèter votre profil pour attirez les patients
                </MenuItem>
              )}
            </MenuList>
          </Menu>

          <Menu size="xs">
            <MenuButton
              size="md"
              as={IconButton}
              aria-label="toggle profile menu"
              isRound
              bg="transparent"
              _hover={{
                opacity: 0.6,
              }}
              _active={{
                opacity: 0.6,
              }}
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
