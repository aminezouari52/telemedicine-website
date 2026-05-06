"use client";

// HOOKS
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

// COMPONENTS
import Spinner from "@/components/Spinner";

// STYLE
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// ASSETS
import Image from "next/image";
import { CircleAlert } from "lucide-react";

const ROLE_REDIRECTS = {
  doctor: "/doctor/home",
  patient: "/patient/home",
};

export const AuthLayout = ({ children }) => {
  const router = useRouter();
  const user = useSelector((state) => state.userReducer.user);
  const [isSessionChecking, setIsSessionChecking] = useState(true);

  useEffect(() => {
    if (!user?.token) {
      setIsSessionChecking(false);
      return;
    }

    const redirectPath = ROLE_REDIRECTS[user?.role];

    if (!redirectPath) {
      setIsSessionChecking(false);
      return;
    }

    router.replace(redirectPath);
  }, [router, user?.role, user?.token]);

  return isSessionChecking ? (
    <Spinner />
  ) : (
    <div className="flex justify-between items-center h-screen bg-white">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-[58%] text-primary-700 mr-4"
          >
            <CircleAlert />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[367px]">
          <div className="space-y-2">
            <h4 className="font-semibold mb-2">
              For testing purposes you can login with these credentials
            </h4>
            <div className="space-y-1">
              <div className="flex gap-1">
                <span className="font-bold">doctor: </span>
                <span>freddie24@yahoo.com</span>
              </div>
              <div className="flex gap-1">
                <span className="font-bold">patient: </span>
                <span>christop_hagenes21@gmail.com</span>
              </div>
            </div>
            <div className="flex gap-1 pt-2 border-t">
              <span className="font-bold">Password: </span>
              <span>testtest</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex justify-center items-center w-1/2">{children}</div>
      <div className="h-screen w-[70%] relative">
        <Image
          src="/assets/login.webp"
          alt="Login illustration"
          fill
          sizes="70%"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
};
