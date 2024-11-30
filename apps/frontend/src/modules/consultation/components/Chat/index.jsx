// HOOKS
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useDisclosure } from "@chakra-ui/react";

// FUNCTIONS
import { socket } from "@/socket";
import { setUser } from "@/reducers/userReducer";
import {
  updateConsultation,
  getPatientConsultations,
  getDoctorConsultations,
} from "@/modules/consultation/functions/consultation";

// COMPONENTS
import CompleteDialog from "./CompleteDialog";
import LeaveDialog from "./LeaveDialog";

// STYLE
import {
  Box,
  Text,
  Input,
  Flex,
  Heading,
  InputGroup,
  InputRightElement,
  IconButton,
  Avatar,
  Stack,
  Button,
  AvatarBadge,
} from "@chakra-ui/react";

// ASSETS
import { IoSend } from "react-icons/io5";
import PatientAvatar from "@/images/avatar-patient.png";
import DoctorAvatar from "@/images/avatar-doctor.jpg";

const Chat = () => {
  const user = useSelector((state) => state.userReducer.user);
  const { consultationId } = useParams();
  const message = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [currentUsers, setCurrentUsers] = useState({});

  const {
    isOpen: isOpenLeave,
    onOpen: onOpenLeave,
    onClose: onCloseLeave,
  } = useDisclosure();

  const {
    isOpen: isOpenComplete,
    onOpen: onOpenComplete,
    onClose: onCloseComplete,
  } = useDisclosure();

  const sendMessage = () => {
    if (message.current.value.trim()) {
      const hours = String(new Date().getHours()).padStart(2, "0");
      const minutes = String(new Date().getMinutes()).padStart(2, "0");
      const time = `${hours}:${minutes}`;
      socket.emit("sendMessage", {
        roomId: consultationId,
        message: message.current.value.trim(),
        name: user?.firstName,
        time,
      });
    }
    message.current.value = "";
  };

  const leaveConsultation = async () => {
    onCloseLeave();
    const { consultationId, ...restUser } = user;
    socket.emit("leave", consultationId);
    dispatch(setUser(restUser));
    await updateConsultation(consultationId, user?.token, {
      status: "completed",
    });
    navigate("/");
  };

  const completeConsultation = () => {
    onCloseComplete();
    const { consultationId, ...restUser } = user;
    dispatch(setUser(restUser));
    navigate("/");
  };

  const loadConsultation = async () => {
    let consultationData = [];
    if (user?.role === "doctor") {
      consultationData = (await getDoctorConsultations(user?._id)).data;
    }
    if (user?.role === "patient") {
      consultationData = (await getPatientConsultations(user?._id)).data;
    }
    const consultation = consultationData.filter(
      (c) => c.status === "in-progress"
    )[0];

    if (!consultation || consultation?._id !== consultationId) {
      navigate("/");
    }
  };

  useEffect(() => {
    if (user) {
      loadConsultation();
    }
  }, [user]);

  const socketJoinedHandler = ({ role, name }) => {
    if (role && name) {
      setCurrentUsers((prev) => ({
        ...prev,
        [role]: name,
      }));
    }
  };

  const socketReceiveMessageHandler = ({ name, message, time }) => {
    setMessages((prevMessages) => [...prevMessages, { name, message, time }]);
  };

  const cleanupEffect = () => {
    if (consultationId && user) {
      socket.emit("exitPage", {
        roomId: consultationId,
        role: user?.role,
      });
    }
    socket.removeAllListeners();
    window.removeEventListener("beforeunload", cleanupEffect);
  };

  useEffect(() => {
    socket.emit("join", {
      roomId: consultationId,
      role: user?.role,
      name: user?.firstName,
    });

    socket.on("joined", socketJoinedHandler);
    socket.on("receiveMessage", socketReceiveMessageHandler);
    socket.emit("getUsers", consultationId);
    socket.on("sendUsers", setCurrentUsers);
    socket.on("userLeft", onOpenComplete);

    window.addEventListener("beforeunload", cleanupEffect);
    return cleanupEffect;
  }, [socket]);

  return (
    <>
      <CompleteDialog
        onClose={onCloseComplete}
        completeConsultation={completeConsultation}
        isOpen={isOpenComplete}
      />
      <LeaveDialog
        onClose={onCloseLeave}
        leaveConsultation={leaveConsultation}
        isOpen={isOpenLeave}
      />
      <Flex
        direction="column"
        justifyContent="space-between"
        h="100vh"
        p={8}
        gap={4}
        bg="#fff"
      >
        <Flex alignItems="center" justifyContent="space-between">
          {user?.role === "patient" && (
            <Flex alignItems="center" gap={2}>
              <Avatar name="Doctor" src={DoctorAvatar}>
                <AvatarBadge
                  boxSize="1.25em"
                  bg={currentUsers?.doctor ? "green.500" : "gray.500"}
                ></AvatarBadge>
              </Avatar>
              <Text>
                {currentUsers?.doctor ? (
                  <Text>
                    Dr <strong>{currentUsers?.doctor}</strong> is active
                  </Text>
                ) : (
                  <Text>Waiting for the doctor to join...</Text>
                )}
              </Text>
            </Flex>
          )}
          {user?.role === "doctor" && (
            <Flex alignItems="center" gap={2}>
              <Avatar name="Patient" src={PatientAvatar}>
                <AvatarBadge
                  boxSize="1.25em"
                  bg={currentUsers?.patient ? "green.500" : "gray.500"}
                ></AvatarBadge>
              </Avatar>
              {currentUsers?.patient ? (
                <Text>
                  <strong>{currentUsers?.patient}</strong> is active
                </Text>
              ) : (
                <Text>Waiting for patient to join...</Text>
              )}
            </Flex>
          )}

          <Flex direction="column" alignItems="end" justifyContent="flex-end">
            <Button size="sm" colorScheme="red" onClick={onOpenLeave}>
              Leave
            </Button>
          </Flex>
        </Flex>
        <Flex direction="column">
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Heading textAlign="center" size="md">
              Consultation in progress
            </Heading>
          </Flex>
        </Flex>
        <Flex h="87%" w="100%" justifyContent="center">
          <Flex
            justifyContent="flex-end"
            direction="column"
            gap={8}
            p={4}
            w="500px"
            bg="primary.100"
            borderRadius="md"
          >
            <Flex direction="column-reverse" overflowY="auto" p={2}>
              <Stack spacing={4}>
                {messages.map(({ name, message, time }, index) => (
                  <Flex gap={1} key={index}>
                    {user?.firstName !== name && (
                      <Avatar
                        name={user?.role !== "doctor" ? "Doctor" : "Patient"}
                        src={
                          user?.role !== "doctor" ? DoctorAvatar : PatientAvatar
                        }
                      ></Avatar>
                    )}
                    <Flex
                      w="100%"
                      justifyContent={
                        user?.firstName !== name ? "flex-start" : "flex-end"
                      }
                    >
                      <Box>
                        {user?.firstName !== name && (
                          <Text fontWeight="bold">{name}</Text>
                        )}
                        <Flex
                          direction="column"
                          alignItems="flex-end"
                          maxW="200px"
                          bg="white"
                          p={2}
                          borderRadius="lg"
                        >
                          <Text>{message}</Text>
                          <Text fontSize="xs" color="gray">
                            {time}
                          </Text>
                        </Flex>
                      </Box>
                    </Flex>
                  </Flex>
                ))}
              </Stack>
            </Flex>
            <InputGroup>
              <Input
                ref={message}
                focusBorderColor="primary.500"
                borderColor="primary.500"
                color="#000"
                type="text"
                placeholder="type a message"
                _placeholder={{ fontSize: "sm" }}
                _hover={{
                  borderColor: "primary.500",
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") sendMessage();
                }}
              />
              <InputRightElement p={0}>
                <IconButton
                  colorScheme="primary"
                  onClick={sendMessage}
                  size="sm"
                  h="25px"
                  icon={<IoSend />}
                  _hover={{
                    opacity: 0.8,
                  }}
                ></IconButton>
              </InputRightElement>
            </InputGroup>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Chat;
