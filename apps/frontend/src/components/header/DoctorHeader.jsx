"use client";

// HOOKS
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/hooks";
import { useQueryClient, useQuery } from "@tanstack/react-query";

// FUNCTIONS
import { signOut } from "firebase/auth";
import { logout } from "@/reducers/userReducer";
import { auth } from "@/firebase";
import { getDoctorConsultations } from "@/services/consultationService";
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
import { FaRegBell } from "react-icons/fa";
import { IoChatboxSharp } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";

export const DoctorHeader = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.userReducer.user);
  const [isProfileCompleted, setIsProfileCompleted] = useState();
  const toast = useToast();
  const [isNotification, setIsNotification] = useState([]);

  const { data: consultation } = useQuery({
    queryKey: ["consultation", "joinable", user?._id],
    queryFn: async () => {
      const consultationsData = (await getDoctorConsultations(user?._id)).data;
      return findJoinableConsultation(consultationsData) || null;
    },
    enabled: !!user?._id,
    refetchInterval: !!user?._id ? 30_000 : false,
  });

  const { data: newConsultationsValue } = useQuery({
    queryKey: ["newConsultations", user?._id],
    queryFn: async () => {
      const consultationsData = (await getDoctorConsultations(user?._id)).data;
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

      const newConsultations = consultationsData?.filter((consultation) => {
        const date = new Date(consultation.createdAt);
        return (
          date >= threeDaysAgo &&
          date <= now &&
          consultation.status === "pending"
        );
      });

      return newConsultations.length;
    },
    enabled: !!user?._id,
  });

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      dispatch(logout(null));
      queryClient.removeQueries();
      router.push("/auth/login");
    } catch (err) {
      console.log(err);
      toast("Logout failed!", "error");
    }
  };

  const addNotificationIfNotExist = (notification) => {
    setIsNotification((prev) =>
      prev.some(
        (existingNotification) =>
          existingNotification.route === notification.route,
      )
        ? prev
        : [...prev, notification],
    );
  };

  useEffect(() => {
    if (user?.token) setIsProfileCompleted(user.isProfileCompleted);
  }, [user]);

  useEffect(() => {
    if (user) {
      if (isProfileCompleted !== undefined && !isProfileCompleted) {
        addNotificationIfNotExist({
          msg: "Complete your profile to attract patients",
          route: "/doctor/profile",
        });
      }
      if (newConsultationsValue) {
        addNotificationIfNotExist({
          msg: `You have ${newConsultationsValue} new consultations`,
          route: "/doctor/consultations",
        });
      }
      if (consultation) {
        addNotificationIfNotExist({
          msg: "You have a consultation now",
          route: `/${consultation?._id}`,
        });
      }
    }
  }, [user, isProfileCompleted, newConsultationsValue, consultation]);

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
              router.push(`/${consultation?._id}`);
            }}
          >
            <span className="hidden md:inline">Join</span>
            <IoChatboxSharp className="md:ml-2" />
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
              <FaRegBell />
              {isNotification?.length > 0 && (
                <Badge className="absolute top-2.5 right-2.5 h-2 w-2 p-1 bg-red-600 text-red-100 rounded-full text-xs font-bold" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {isNotification?.map((notif, key) => (
              <DropdownMenuItem
                key={key}
                onClick={() => router.push(notif.route)}
              >
                {notif.msg}
              </DropdownMenuItem>
            ))}

            {!isNotification?.length > 0 && (
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
          <TbLogout className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
