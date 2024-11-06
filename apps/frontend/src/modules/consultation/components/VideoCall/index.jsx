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
  InputRightElement,
  IconButton,
  Stack,
  Button,
  Portal,
} from "@chakra-ui/react";

// ASSETS
import { IoSend } from "react-icons/io5";

const VideoCall = () => {
  const user = useSelector((state) => state.user.loggedInUser);
  const params = useParams();
  const message = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);

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

  useEffect(() => {
    if (user) {
      socket.emit("joinConsultation", {
        consultationId: params.consultationId,
        userId: user?._id,
      });

      socket.on("receiveMessage", (message) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: message.user, message: message.message },
        ]);
      });

      socket.on("userLeft", onOpenComplete);

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
    onCloseLeave();
    const { consultationId, ...restUser } = user;
    socket.emit("leaveConsultation", {
      consultationId: params.consultationId,
    });
    dispatch(setLoggedInUser(restUser));
    updateConsultation(params.consultationId, {
      status: "completed",
    });
    navigate("/");
  };

  const completeConsultation = () => {
    onCloseComplete();
    const { consultationId, ...restUser } = user;
    dispatch(setLoggedInUser(restUser));
    navigate("/");
  };

  useEffect(() => {
    if (
      !user ||
      !user?.consultationId ||
      user?.consultationId !== params.consultationId
    )
      navigate("/");
  }, [user]);

  return (
    <>
      <Portal>
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

          <Flex w="70%" direction="column" alignItems="end">
            <Flex>
              <Button size="sm" colorScheme="red" onClick={onOpenLeave}>
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
