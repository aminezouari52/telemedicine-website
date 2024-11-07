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
  const messagesContainer = useRef();
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
          { userFirstName: message.userFirstName, message: message.message },
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
        userFirstName: user?.firstName,
      });
    }
    message.current.value = "";
  };

  const leaveConsultation = async () => {
    onCloseLeave();
    const { consultationId, ...restUser } = user;
    socket.emit("leaveConsultation", {
      consultationId: params.consultationId,
    });
    dispatch(setLoggedInUser(restUser));
    await updateConsultation(params.consultationId, {
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
      <Flex direction="column" justifyContent="space-between" h="100vh" p={8}>
        <Flex direction="column">
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Heading textAlign="center" size="md">
              Consultation en cours
            </Heading>
          </Flex>
          <Flex direction="column" alignItems="end" justifyContent="flex-end">
            <Button size="sm" colorScheme="red" onClick={onOpenLeave}>
              Quitter
            </Button>
          </Flex>
        </Flex>
        <Flex h="90%" w="100%" justifyContent="center">
          <Flex
            justifyContent="flex-end"
            direction="column"
            gap={8}
            p={4}
            w="400px"
            bg="primary.100"
          >
            <Stack
              direction="column-reverse"
              ref={messagesContainer}
              spacing={4}
              overflowY="auto"
            >
              <Box>
                {messages.map((message, index) => (
                  <Text key={index}>
                    {message.userFirstName} : {message.message}
                  </Text>
                ))}
              </Box>
            </Stack>
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

export default VideoCall;
