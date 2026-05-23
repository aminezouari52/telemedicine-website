import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function VerifyData({ isOpen, onClose, onConfirm, doctor }) {
  if (!isOpen) {
    return null;
  }

  const price = doctor?.price;

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

        {price > 0 && (
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 mt-2">
            <span className="text-sm font-medium text-gray-700">
              Consultation fee
            </span>
            <span className="text-lg font-bold text-primary-500">
              ${price.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" type="button" onClick={onClose}>
            Back
          </Button>
          <Button type="button" onClick={onConfirm}>
            {price > 0 ? "Pay and confirm" : "Confirm and book"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default VerifyData;
