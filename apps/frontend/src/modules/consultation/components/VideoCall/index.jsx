// HOOKS
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useDisclosure } from "@chakra-ui/react";

// FUNCTIONS
import { socket } from "@/socket";
import { setLoggedInUser } from "@/reducers/userReducer";
import { updateConsultation } from "@/modules/consultation/functions/consultation";

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
  InputRightAddon,
  IconButton,
  Stack,
  Button,
  Portal,
} from "@chakra-ui/react";

// ASSETS
import { IoSend } from "react-icons/io5";

const VideoCall = () => {
  const params = useParams();
  const message = useRef();
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.loggedInUser);
  const dispatch = useDispatch();
  const {
    isOpen: isOpenLeave,
    onOpen: onOpenLeave,
    onClose: onCloseLeave,
  } = useDisclosure();

  const {
    isOpen: isOpenComplete,
    onOpenComplete,
    onCloseComplete,
  } = useDisclosure();

  const [leftUser, setLeftUser] = useState();

  useEffect(() => {
    if (user) {
      socket.emit("joinConsultation", {
        consultationId: params.consultationId,
        userId: user?._id,
      });

      socket.on("notifyJoin", ({ consultation, user }) => {
        console.log("USER JOINED!");
        console.log(user, consultation);
      });

      socket.on("receiveMessage", (message) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: message.user, message: message.message },
        ]);
      });

      socket.on("otherUserLeft", ({ consultationId, userId }) => {
        setLeftUser(userId);
        onOpenLeave();
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [user, params.consultationId]);

  const sendMessage = () => {
    if (message.current.value.trim()) {
      socket.emit("sendMessage", {
        consultationId: params.consultationId,
        message: message.current.value.trim(),
        user: user?.firstName,
      });
    }
    message.current.value = "";
  };

  const leaveConsultation = () => {
    const { consultationId, ...restUser } = user;
    socket.emit("leaveConsultation", {
      consultationId: params.consultationId,
      userId: user._id,
    });
    dispatch(setLoggedInUser(restUser));
    updateConsultation(params.consultationId, {
      status: "completed",
    });
    navigate("/");
  };

  useEffect(() => {
    if (
      user &&
      (!user?.consultationId || user?.consultationId !== params.consultationId)
    )
      navigate("/");
  }, [user]);

  return (
    <>
      <Portal>
        <CompleteDialog
          onClose={onCloseLeave}
          leaveConsultation={leaveConsultation}
          isOpen={isOpenLeave}
        />
        <LeaveDialog
          onClose={onCloseComplete}
          leaveConsultation={leaveConsultation}
          isOpen={isOpenComplete}
        />
      </Portal>
      <Box h="100vh" p={8}>
        <Heading textAlign="center" size="md">
          Consultation en cours
        </Heading>
        <Flex h="100%" w="100%" justifyContent="space-between">
          <Flex
            justifyContent="flex-end"
            direction="column"
            gap={8}
            p={4}
            w="30%"
          >
            <Stack spacing={4} overflowY="auto">
              {messages.map((message, index) => (
                <Text key={index}>
                  {message.user} : {message.message}
                </Text>
              ))}
            </Stack>
            <InputGroup>
              <Input
                ref={message}
                focusBorderColor="primary.500"
                type="text"
                placeholder="type a message"
              />
              <InputRightAddon p={0}>
                <IconButton
                  colorScheme="primary"
                  onClick={sendMessage}
                  icon={<IoSend />}
                  borderLeftRadius={0}
                ></IconButton>
              </InputRightAddon>
            </InputGroup>
          </Flex>

          <Flex w="70%" direction="column" alignItems="end">
            <Flex>
              <Button size="sm" colorScheme="red" onClick={onOpenComplete}>
                Quitter
              </Button>
            </Flex>
            <Text w="100%" textAlign="center">
              VIDEO CALLING
            </Text>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default VideoCall;
