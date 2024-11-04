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

const CompleteDialog = ({ onClose, leaveConsultation, isOpen }) => {
  return (
    <AlertDialog
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={() => {
        onClose();
        leaveConsultation();
      }}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Consultation est complète 🙂</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          La personne avec qui vous aviez une consultation a mis fin à la
          consultation, ce qui signifie que vous allez être redirigé vers la
          page d'accueil.
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            colorScheme="primary"
            size="sm"
            ml={3}
            onClick={() => {
              onClose();
              leaveConsultation();
            }}
            _hover={{
              opacity: 0.8,
            }}
          >
            D'accord
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CompleteDialog;
