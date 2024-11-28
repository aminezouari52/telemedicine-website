import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react";

const CompleteDialog = ({ onClose, completeConsultation, isOpen }) => {
  return (
    <AlertDialog
      motionPreset="slideInBottom"
      isOpen={isOpen}
      onClose={() => {
        onClose();
        completeConsultation();
      }}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Consultation is complete 🙂</AlertDialogHeader>
        <AlertDialogBody>
          The person you were consulting with has ended the consultation, which
          means you will be redirected to the home page.
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            colorScheme="primary"
            size="sm"
            ml={3}
            onClick={() => {
              onClose();
              completeConsultation();
            }}
            _hover={{
              opacity: 0.8,
            }}
          >
            Okay
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CompleteDialog;
