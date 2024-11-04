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
  return (
    <AlertDialog
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Terminer la consultation</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          Vous êtes sûr de terminer la consultation?
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            size="sm"
            ml={3}
            onClick={() => {
              onClose();
            }}
          >
            Annuler
          </Button>
          <Button
            colorScheme="red"
            size="sm"
            ml={3}
            onClick={() => {
              leaveConsultation();
              onClose();
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
