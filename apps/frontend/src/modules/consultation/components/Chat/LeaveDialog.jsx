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
        <AlertDialogHeader>Finish consultation</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          If you leave the consultation will be over. Are you sure you will
          finish the consultation?
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button size="sm" ml={3} ref={cancelRef} onClick={onClose}>
            Cancel
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
            Finish
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LeaveDialog;
