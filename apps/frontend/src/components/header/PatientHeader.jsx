// HOOKS
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// FUNCTIONS
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { logout } from "@/reducers/userReducer";
import { getPatientConsultations } from "@/services/consultationService";

// COMPONENTS
import HeaderButton from "./HeaderButton";
import Logo from "@/components/Logo";

// STYLE
import { Flex, Text, IconButton, SimpleGrid, Button } from "@chakra-ui/react";

// ASSETS
import { IoChatboxSharp } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import { MdAutoAwesome } from "react-icons/md";

export const PatientHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const toast = useToast();
  const user = useSelector((state) => state.userReducer.user);

  const { data: consultation } = useQuery({
    queryKey: ["consultation", user?._id],
    queryFn: async () => {
      const consultationsData = (await getPatientConsultations(user?._id)).data;
      return consultationsData.find((c) => c.status === "in-progress") || null;
    },
    enabled: !!user?._id,
  });

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      dispatch(logout(null));
      queryClient.removeQueries();
      navigate("/auth/login");
    } catch (err) {
      console.log(err);
      toast("Logout failed!", "error");
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
          <>
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
          </>
        )}
        <Button
          size="sm"
          leftIcon={<MdAutoAwesome className="animated-icon" size="20px" />}
          variant="outline"
          colorScheme="primary"
          ml={2}
          _hover={{
            bg: "#f3f4f6",
            opacity: 0.9,
          }}
          onClick={() => {
            navigate("/patient/ai");
          }}
        >
          AI Consultation
        </Button>

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
