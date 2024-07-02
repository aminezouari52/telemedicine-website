// REACT
import { useRef } from "react";
import { useSelector } from "react-redux";
import { useDisclosure } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

// STYLE
import {
  Button,
  Icon,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
} from "@chakra-ui/react";

// ASSETS
import { AiOutlineStar } from "react-icons/ai";
const RatingModal = ({ children, confirmStarUpdate }) => {
  const navigate = useNavigate();
  const cancelRef = useRef();
  const { slug } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useSelector((state) => state.user.loggedInUser);
  const toast = useToast();

  const onOpenHandler = () => {
    return user && user.token
      ? onOpen()
      : navigate(`/login`, { state: { from: `/product/${slug}` } });
  };

  const okHandler = () => {
    onClose();
    toast({
      title: "Thanks for your review. It will apper soon",
      status: "success",
      colorScheme: "red",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        colorScheme="red"
        leftIcon={<Icon as={AiOutlineStar} />}
        onClick={onOpenHandler}
        w="100%"
      >
        {user ? "Leave rating" : "Login to leave rating"}
      </Button>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Leave your rating</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>{children}</AlertDialogBody>
          <AlertDialogFooter>
            <Button colorScheme="primary" ml={3} onClick={okHandler}>
              Ok
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RatingModal;
