// HOOKS
import { useNavigate } from "react-router-dom";
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  chakra,
} from "@chakra-ui/react";

// ASSETS
import { ChevronRightIcon } from "@chakra-ui/icons";
import loginLogo from "../../images/login-logo.png";
import { FaRegBell } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";

export const PatientHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
          gap={1}
          alignItems="center"
          justifyContent="flex-end"
          height="100%"
        >
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
                </>
              }
            ></MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate("/patient/call")}>
                Vous avez une consultation maintenant
              </MenuItem>
            </MenuList>
          </Menu>

          <IconButton
            size="md"
            aria-label="logout"
            isRound
            bg="transparent"
            _hover={{
              opacity: 0.6,
            }}
            _active={{
              opacity: 0.6,
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
    </Box>
  );
};

export default PatientHeader;
