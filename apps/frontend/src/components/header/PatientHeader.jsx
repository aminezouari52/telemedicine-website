// HOOKS
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";

// FUNCTIONS
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { logout } from "@/reducers/userReducer";
import { getPatientConsultations } from "@/modules/consultation/functions/consultation";

// COMPONENTS
import HeaderButton from "./HeaderButton";
import Logo from "@/components/Logo";

// STYLE
import { Flex, Text, IconButton, SimpleGrid, Button } from "@chakra-ui/react";

// ASSETS
import { IoChatboxSharp } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import { useQueryClient } from "@tanstack/react-query";

export const PatientHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const toast = useToast();
  const user = useSelector((state) => state.userReducer.user);

  const [consultation, setConsultation] = useState();

  const loadConsultation = async () => {
    const consultationsData = (await getPatientConsultations(user?._id)).data;
    setConsultation(
      consultationsData.filter((c) => c.status === "in-progress")[0]
    );
  };

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      dispatch(logout(null));
      queryClient.removeQueries()
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
    if (user) {
      loadConsultation();
    }
  }, [user]);

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
          <Text fontSize="sm">Home</Text>
        </HeaderButton>
        <HeaderButton pathname="/patient/consultations">
          <Text fontSize="sm">Consultations</Text>
        </HeaderButton>
        <HeaderButton pathname="/patient/doctors">
          <Text fontSize="sm">Doctors</Text>
        </HeaderButton>
      </Flex>
      <Flex gap={1} alignItems="center" justifyContent="flex-end" height="100%">
        {user && !!consultation && (
          <Button
            size="sm"
            colorScheme="primary"
            rightIcon={<IoChatboxSharp />}
            _hover={{
              opacity: 0.8,
            }}
            onClick={() => {
              navigate(`/${user?.consultationId}`);
            }}
          >
            Join
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
