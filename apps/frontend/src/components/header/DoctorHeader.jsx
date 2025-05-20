// HOOKS
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks";
import { useQueryClient, useQuery } from "@tanstack/react-query";

// FUNCTIONS
import { signOut } from "firebase/auth";
import { logout } from "@/reducers/userReducer";
import { auth } from "@/firebase";
import { getDoctorConsultations } from "@/services/consultationService";

// COMPONENTS
import HeaderButton from "./HeaderButton";
import Logo from "@/components/Logo";

// STYLE
import {
  chakra,
  Avatar,
  Button,
  Flex,
  Text,
  IconButton,
  SimpleGrid,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

// ASSETS
import { FaRegBell } from "react-icons/fa";
import { IoChatboxSharp } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import DoctorAvatar from "@/assets/avatar-doctor.jpg";

export const DoctorHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.userReducer.user);
  const [isProfileCompleted, setIsProfileCompleted] = useState();
  const toast = useToast();
  const [isNotification, setIsNotification] = useState([]);

  const { data: consultation } = useQuery({
    queryKey: ["consultation", user?._id],
    queryFn: async () => {
      const consultationsData = (await getDoctorConsultations(user?._id)).data;
      return consultationsData.find((c) => c.status === "in-progress") || null;
    },
    enabled: !!user?._id,
  });

  const { data: newConsultationsValue } = useQuery({
    queryKey: ["newConsultations", user?._id],
    queryFn: async () => {
      const consultationsData = (await getDoctorConsultations(user?._id)).data;
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

      const newConsultations = consultationsData?.filter((consultation) => {
        const date = new Date(consultation.createdAt);
        return (
          date >= threeDaysAgo &&
          date <= now &&
          consultation.status === "pending"
        );
      });

      return newConsultations.length;
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

  const addNotificationIfNotExist = (notification) => {
    setIsNotification((prev) =>
      prev.some(
        (existingNotification) =>
          existingNotification.route === notification.route,
      )
        ? prev
        : [...prev, notification],
    );
  };

  useEffect(() => {
    if (user?.token) setIsProfileCompleted(user.isProfileCompleted);
  }, [user]);

  useEffect(() => {
    if (user) {
      if (isProfileCompleted !== undefined && !isProfileCompleted) {
        addNotificationIfNotExist({
          msg: "Complete your profile to attract patients",
          route: "/doctor/profile",
        });
      }
      if (newConsultationsValue) {
        addNotificationIfNotExist({
          msg: `You have ${newConsultationsValue} new consultations`,
          route: "/doctor/consultations",
        });
      }
      if (consultation) {
        addNotificationIfNotExist({
          msg: "You have a consultation now",
          route: `/${consultation?._id}`,
        });
      }
    }
  }, [user, isProfileCompleted, newConsultationsValue, consultation]);

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
        <HeaderButton pathname="/doctor/home">
          <Text fontSize="sm">Home</Text>
        </HeaderButton>
        <HeaderButton pathname="/doctor/consultations">
          <Text fontSize="sm">Consultations</Text>
        </HeaderButton>
        <HeaderButton pathname="/doctor/patients">
          <Text fontSize="sm">Patiens</Text>
        </HeaderButton>
      </Flex>
      <Flex alignItems="center" justifyContent="flex-end" height="100%" gap={2}>
        {consultation && (
          <Button
            size="sm"
            colorScheme="primary"
            rightIcon={<IoChatboxSharp />}
            _hover={{
              opacity: 0.8,
            }}
            onClick={() => {
              navigate(`/${consultation?._id}`);
            }}
          >
            Join
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
              opacity: 0.8,
            }}
            _active={{
              opacity: 0.8,
            }}
            icon={
              <>
                <FaRegBell />
                {isNotification?.length > 0 && (
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
            {isNotification?.map((notif, key) => (
              <MenuItem key={key} onClick={() => navigate(notif.route)}>
                {notif.msg}
              </MenuItem>
            ))}

            {!isNotification?.length > 0 && (
              <Text px={2}>you don't have any notifications</Text>
            )}
          </MenuList>
        </Menu>

        <Avatar
          size="sm"
          h="20px"
          w="20px"
          cursor="pointer"
          showBorder={location.pathname === "/doctor/profile"}
          borderColor="primary.500"
          src={DoctorAvatar}
          onClick={() => navigate("/doctor/profile")}
          _hover={{
            opacity: 0.8,
          }}
        />
        <IconButton
          size="md"
          icon={
            <TbLogout
              style={{
                height: "20px",
                width: "20px",
              }}
            />
          }
          isRound
          aria-label="logout"
          bg="transparent"
          _active={{
            bg: "transparent",
          }}
          _hover={{
            opacity: 0.8,
          }}
          onClick={logoutHandler}
        />
      </Flex>
    </SimpleGrid>
  );
};
