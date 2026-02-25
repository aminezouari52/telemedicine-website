import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const CompleteDialog = ({ onClose, completeConsultation, isOpen }) => {
  const handleClose = () => {
    onClose();
    completeConsultation();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Consultation is complete 🙂</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          The person you were consulting with has ended the consultation, which
          means you will be redirected to the home page.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleClose} asChild>
            <Button size="sm" className="ml-3">
              Okay
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CompleteDialog;
