"use client";

// HOOKS
import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useConsultationStatus } from "@/hooks/useConsultationStatus";

// STYLE
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";

const ConsultationAlert = () => {
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state) => state.userReducer.user);

  const {
    activeConsultation,
    upcomingSoonConsultation,
    isLoading,
    isError,
    dismissConsultation,
  } = useConsultationStatus(user);

  const isOnActiveConsultationRoute = useMemo(() => {
    if (!activeConsultation?._id) return false;
    return pathname === `/consultation/${activeConsultation._id}`;
  }, [pathname, activeConsultation]);

  if (isLoading || isError) {
    return null;
  }

  const handleJoin = () => {
    if (!activeConsultation?._id) return;
    if (!isOnActiveConsultationRoute) {
      router.push(`/consultation/${activeConsultation._id}`);
    }
  };

  const handleDismissActive = () => {
    if (!activeConsultation?._id) return;
    dismissConsultation(activeConsultation._id);
  };

  if (!activeConsultation && !upcomingSoonConsultation) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {activeConsultation && (
        <Alert
          variant="default"
          className="flex items-center justify-between rounded-md shadow-md border-primary-500"
        >
          <div className="flex items-center gap-3">
            <Video className="h-5 w-5 text-primary-500" />
            <div className="flex flex-col">
              <AlertTitle className="text-sm font-semibold">
                Consultation in progress
              </AlertTitle>
              <AlertDescription className="text-xs">
                You have a consultation that&apos;s ready to join.
              </AlertDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handleDismissActive}
            >
              Maybe later
            </Button>
            <Button
              size="sm"
              className="text-xs bg-primary-500 hover:opacity-80"
              onClick={handleJoin}
            >
              Join now
            </Button>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default ConsultationAlert;
