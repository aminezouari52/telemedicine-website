// HOOKS
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedInUser } from "@/reducers/userReducer";

// FUNCTIONS
import { socket } from "@/socket";

// STYLE
import {
  Portal,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react";

const ConsultationAlert = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useSelector((state) => state.user.loggedInUser);
  const cancelRef = useRef();

  useEffect(() => {
    const handleStartConsultation = (consultation) => {
      if ([consultation.patientId, consultation.doctorId].includes(user?._id)) {
        onOpen();
        dispatch(
          setLoggedInUser({
            ...user,
            consultationId: consultation.consultationId,
          })
        );
      }
    };

    socket.on("startConsultation", handleStartConsultation);

    return () => {
      socket.off("startConsultation", handleStartConsultation);
    };
  }, []);

  const handleConfirm = () => {
    onClose();
    navigate(`/${user?.consultationId}`);
  };

  return (
    <Portal>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Vous avez une consultation!</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Vous avez une consultation, joingnez maintenant!
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button size="sm" ref={cancelRef} onClick={onClose}>
              Pas maintenant
            </Button>
            <Button
              colorScheme="primary"
              size="sm"
              ml={3}
              onClick={handleConfirm}
            >
              Rejoindre
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Portal>
  );
};

export default ConsultationAlert;
