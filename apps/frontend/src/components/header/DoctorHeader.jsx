// HOOKS
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// FUNCTIONS
import { signOut } from "firebase/auth";
import { logout } from "@/reducers/userReducer";
import { auth } from "@/firebase";
import { getDoctorConsultations } from "@/modules/consultation/functions/consultation";

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
  useToast,
} from "@chakra-ui/react";

// ASSETS
import { FaRegBell } from "react-icons/fa";
import { IoChatboxSharp } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import DoctorAvatar from "@/images/avatar-doctor.jpg";

export const DoctorHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector((state) => state.userReducer.user);
  const [isProfileCompleted, setIsProfileCompleted] = useState();
  const [consultation, setConsultation] = useState();
  const toast = useToast();
  const [newConsultationsValue, setNewConsultationsValue] = useState(0);
  const [isNotification, setIsNotification] = useState([]);

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

  const loadConsultation = async () => {
    const consultationsData = (await getDoctorConsultations(user?._id)).data;
    setConsultation(
      consultationsData.filter((c) => c.status === "in-progress")[0]
    );
  };

  const newConsultations = async () => {
    const consultationsData = (await getDoctorConsultations(user?._id)).data;
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

    const newConsultations = consultationsData?.filter((consultation) => {
      const date = new Date(consultation.createdAt);
      return (
        date >= threeDaysAgo && date <= now && consultation.status === "pending"
      );
    });
    setNewConsultationsValue(newConsultations?.length);
  };

  const addNotificationIfNotExist = (notification) => {
    setIsNotification((prev) =>
      prev.some(
        (existingNotification) =>
          existingNotification.route === notification.route
      )
        ? prev
        : [...prev, notification]
    );
  };

  useEffect(() => {
    if (user) {
      loadConsultation();
      loadIsProfileCompleted();
      newConsultations();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      if (isProfileCompleted !== undefined && !isProfileCompleted) {
        addNotificationIfNotExist({
          msg: "Complèter votre profil pour attirez les patients",
          route: "/doctor/profile",
        });
      }
      if (newConsultationsValue) {
        addNotificationIfNotExist({
          msg: `Vous avez ${newConsultationsValue} nouveaux consultations`,
          route: "/doctor/consultations",
        });
      }
      if (consultation) {
        addNotificationIfNotExist({
          msg: "Vous avez une consultation maintenant",
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
          <Text fontSize="sm">Acceuil</Text>
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
            Joindre
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
              <Text px={2}>vous n'avez pas de notifications</Text>
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
