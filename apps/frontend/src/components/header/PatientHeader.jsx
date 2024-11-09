// HOOKS
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";

// FUNCTIONS
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { logout } from "@/reducers/userReducer";

// COMPONENTS
import HeaderButton from "./HeaderButton";
import Logo from "@/components/Logo";

// STYLE
import { Flex, Text, IconButton, SimpleGrid, Button } from "@chakra-ui/react";

// ASSETS

import { FaVideo } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";

export const PatientHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const user = useSelector((state) => state.user.loggedInUser);

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

  return (
    <SimpleGrid
      as="header"
      columns={3}
      pos="sticky"
      top="0"
      background="#fff"
      alignItems="center"
      h="62px"
      w="100%"
      px="56px"
      shadow="md"
      zIndex="5"
    >
      <Logo />
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
      <Flex gap={1} alignItems="center" justifyContent="flex-end" height="100%">
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

        <IconButton
          size="md"
          aria-label="logout"
          isRound
          bg="transparent"
          _hover={{
            opacity: 0.8,
          }}
          _active={{
            opacity: 0.8,
          }}
          onClick={logoutHandler}
          icon={
            <TbLogout
              style={{
                height: "20px",
                width: "20px",
              }}
            />
          }
        />
      </Flex>
    </SimpleGrid>
  );
};

export default PatientHeader;
