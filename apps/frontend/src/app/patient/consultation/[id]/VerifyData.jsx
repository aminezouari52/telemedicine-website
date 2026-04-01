import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function VerifyData({ isOpen, onClose, onConfirm }) {
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Verify your information</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          Please review your profile information and selected date and time
          before confirming your consultation.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" type="button" onClick={onClose}>
            Back
          </Button>
          <Button type="button" onClick={onConfirm}>
            Confirm and book
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default VerifyData;
