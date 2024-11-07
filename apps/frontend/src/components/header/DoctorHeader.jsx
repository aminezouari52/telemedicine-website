// HOOKS
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// FUNCTIONS
import { signOut } from "firebase/auth";
import { logout } from "@/reducers/userReducer";
import { auth } from "@/firebase";

// COMPONENTS
import HeaderButton from "./HeaderButton";
import Logo from "@/components/Logo";

// STYLE
import {
  chakra,
  Button,
  Flex,
  Text,
  IconButton,
  SimpleGrid,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";

// ASSETS
import { FaRegUser, FaRegBell, FaVideo } from "react-icons/fa";

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

  const loadIsProfileCompleted = async () => {
    if (user && user.token) {
      setIsProfileCompleted(user.isProfileCompleted);
    }
  };

  useEffect(() => {
    loadIsProfileCompleted();
  }, [isProfileCompleted, user]);

  return (
    <SimpleGrid
      as="header"
      columns={3}
      background="#fff"
      w="100%"
      alignItems="center"
      px="56px"
      shadow="md"
      pos="sticky"
      top="0"
      zIndex="5"
    >
      <Logo />

      <Flex alignItems="center" gap="20px" height="100%">
        <HeaderButton pathname="/doctor/home">
          <Text fontSize="sm">Acceuil</Text>
        </HeaderButton>
        <HeaderButton pathname="/doctor/consultations">
          <Text fontSize="sm">Consultations</Text>
        </HeaderButton>
        <HeaderButton pathname="/doctor/patients">
          <Text fontSize="sm">Patiens</Text>
        </HeaderButton>
      </Flex>
      <Flex alignItems="center" justifyContent="flex-end" height="100%">
        {user && user?.consultationId && (
          <Button
            size="sm"
            colorScheme="primary"
            rightIcon={<FaVideo />}
            _hover={{
              opacity: 0.8,
            }}
            onClick={() => {
              navigate(`/${user?.consultationId}`);
            }}
          >
            Rejoindre
          </Button>
        )}
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
  );
};
