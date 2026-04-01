"use client";

// HOOKS
import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useConsultationStatus } from "@/hooks/useConsultationStatus";

// STYLE
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar, Video, Bell } from "lucide-react";

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
    return pathname === `/${activeConsultation._id}`;
  }, [pathname, activeConsultation]);

  if (isLoading || isError) {
    return null;
  }

  const handleJoin = () => {
    if (!activeConsultation?._id) return;
    if (!isOnActiveConsultationRoute) {
      router.push(`/${activeConsultation._id}`);
    }
  };

  const handleDismissActive = () => {
    if (!activeConsultation?._id) return;
    dismissConsultation(activeConsultation._id);
  };

  const handleDismissUpcoming = () => {
    if (!upcomingSoonConsultation?._id) return;
    dismissConsultation(upcomingSoonConsultation._id);
  };

  const handleViewUpcoming = () => {
    if (user?.role === "doctor") {
      router.push("/doctor/consultations");
    } else {
      router.push("/patient/consultations");
    }
  };

  if (!activeConsultation && !upcomingSoonConsultation) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 px-7 pt-4">
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

      {!activeConsultation && upcomingSoonConsultation && (
        <Alert
          variant="info"
          className="flex items-center justify-between rounded-md shadow-md border border-primary-200"
        >
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary-500" />
            <div className="flex flex-col">
              <AlertTitle className="text-sm font-semibold">
                Upcoming consultation
              </AlertTitle>
              <AlertDescription className="text-xs flex items-center gap-1">
                <Calendar className="h-3 w-3 text-gray-500" />
                <span>
                  You have a consultation starting soon. You can review the
                  details on your consultations page.
                </span>
              </AlertDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={handleDismissUpcoming}
            >
              Dismiss
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="text-xs hover:opacity-80"
              onClick={handleViewUpcoming}
            >
              View details
            </Button>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default ConsultationAlert;
