"use client";

// HOOKS
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useLogout, useMyConsultations } from "@/hooks";

// FUNCTIONS
import { findJoinableConsultation } from "@/utils/consultationJoinable";

// COMPONENTS
import HeaderButton from "./HeaderButton";
import Logo from "@/components/Logo";

// STYLE
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// ASSETS
import { Bell } from "lucide-react";
import { MessageSquareMore } from "lucide-react";
import { LogOut } from "lucide-react";

const NEW_CONSULTATION_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;

export const DoctorHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const logoutHandler = useLogout();
  const user = useSelector((state) => state.userReducer.user);

  const { data: consultations } = useMyConsultations({
    refetchInterval: 30_000,
  });
  const consultation = findJoinableConsultation(consultations);
  const newConsultationsCount =
    consultations?.filter(
      (c) =>
        c.status === "pending" &&
        Date.now() - new Date(c.createdAt) <= NEW_CONSULTATION_WINDOW_MS,
    ).length ?? 0;

  const notifications = [
    user?.isProfileCompleted === false && {
      msg: "Complete your profile to attract patients",
      route: "/doctor/profile",
    },
    newConsultationsCount > 0 && {
      msg: `You have ${newConsultationsCount} new consultations`,
      route: "/doctor/consultations",
    },
    consultation && {
      msg: "You have a consultation now",
      route: `/consultation/${consultation._id}`,
    },
  ].filter(Boolean);

  return (
    <header className="sticky top-0 z-[5] grid w-full grid-cols-2 gap-3 bg-white px-4 py-2 md:h-[62px] md:grid-cols-3 md:items-center md:px-14 md:py-0">
      <div className="order-1">
        <Logo />
      </div>

      <div className="order-3 col-span-2 flex h-full items-center gap-2 overflow-x-auto md:order-2 md:col-span-1 md:gap-5">
        <HeaderButton pathname="/doctor/home">
          <span className="text-sm">Home</span>
        </HeaderButton>
        <HeaderButton pathname="/doctor/consultations">
          <span className="text-sm">Consultations</span>
        </HeaderButton>
        <HeaderButton pathname="/doctor/patients">
          <span className="text-sm">Patients</span>
        </HeaderButton>
      </div>
      <div className="order-2 flex h-full items-center justify-end gap-1 md:order-3 md:gap-2">
        {consultation && (
          <Button
            size="sm"
            className="px-2 hover:opacity-80 md:px-3"
            onClick={() => {
              router.push(`/consultation/${consultation?._id}`);
            }}
          >
            <span className="hidden md:inline">Join</span>
            <MessageSquareMore className="md:ml-2" />
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              aria-label="notification"
              className="rounded-full bg-transparent hover:opacity-80 relative"
            >
              <Bell />
              {notifications.length > 0 && (
                <Badge className="absolute top-2.5 right-2.5 h-2 w-2 p-1 bg-red-600 text-red-100 rounded-full text-xs font-bold" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {notifications.map((notif) => (
              <DropdownMenuItem
                key={notif.route}
                onClick={() => router.push(notif.route)}
              >
                {notif.msg}
              </DropdownMenuItem>
            ))}

            {notifications.length === 0 && (
              <div className="px-2 py-1.5 text-sm">
                you don't have any notifications
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Avatar
          className={`h-8 w-8 cursor-pointer hover:opacity-80 md:h-9 md:w-9 ${
            pathname === "/doctor/profile" ? "ring-2 ring-primary-500" : ""
          }`}
          onClick={() => router.push("/doctor/profile")}
        >
          <AvatarImage src="/assets/avatar-doctor.jpg" />
          <AvatarFallback>DR</AvatarFallback>
        </Avatar>
        <Button
          size="icon"
          variant="ghost"
          aria-label="logout"
          className="rounded-full bg-transparent hover:opacity-80"
          onClick={logoutHandler}
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
