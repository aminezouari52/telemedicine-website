import { useRef } from "react";
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react";

const LeaveDialog = ({ onClose, isOpen, leaveConsultation }) => {
  const cancelRef = useRef();

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={cancelRef}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Terminer la consultation</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          Si vous quittez la consultation va être terminer. Vous êtes sûr de
          terminer la consultation?
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button size="sm" ml={3} ref={cancelRef} onClick={onClose}>
            Annuler
          </Button>
          <Button
            colorScheme="red"
            size="sm"
            ml={3}
            onClick={() => {
              onClose();
              leaveConsultation();
            }}
          >
            Terminer
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LeaveDialog;
