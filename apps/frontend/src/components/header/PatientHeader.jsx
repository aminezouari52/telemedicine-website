"use client";

// HOOKS
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// FUNCTIONS
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { logout } from "@/reducers/userReducer";
import { getPatientConsultations } from "@/services/consultationService";
import { findJoinableConsultation } from "@/utils/consultationJoinable";

// COMPONENTS
import HeaderButton from "./HeaderButton";
import Logo from "@/components/Logo";

// STYLE
import { Button } from "@/components/ui/button";

// ASSETS
import { MessageSquareMore } from "lucide-react";
import { LogOut, Sparkles } from "lucide-react";

export const PatientHeader = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const toast = useToast();
  const user = useSelector((state) => state.userReducer.user);

  const { data: consultation } = useQuery({
    queryKey: ["consultation", "joinable", user?._id],
    queryFn: async () => {
      const consultationsData = (await getPatientConsultations(user?._id)).data;
      return findJoinableConsultation(consultationsData) || null;
    },
    enabled: !!user?._id,
    refetchInterval: !!user?._id ? 30_000 : false,
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

  return (
    <header className="sticky top-0 z-[5] grid w-full grid-cols-2 gap-3 bg-white px-4 py-2 md:h-[62px] md:grid-cols-3 md:items-center md:px-14 md:py-0">
      <div className="order-1">
        <Logo />
      </div>
      <div className="order-3 col-span-2 flex h-7 flex-grow items-center gap-2 md:order-2 md:col-span-1 md:gap-5">
        <HeaderButton pathname="/patient/home">
          <span className="text-sm">Home</span>
        </HeaderButton>
        <HeaderButton pathname="/patient/consultations">
          <span className="text-sm">Consultations</span>
        </HeaderButton>
        <HeaderButton pathname="/patient/doctors">
          <span className="text-sm">Doctors</span>
        </HeaderButton>
      </div>
      <div className="order-2 flex h-full items-center justify-end gap-1 md:order-3">
        {user && !!consultation && (
          <Button
            size="sm"
            className="px-2 hover:opacity-80 md:px-3"
            onClick={() => {
              const id = consultation?._id;
              if (!id) return;
              router.push(`/${String(id)}`);
            }}
          >
            <span className="hidden md:inline">Join</span>
            <MessageSquareMore className="md:ml-2" />
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          className="ml-1 px-2 hover:bg-gray-100 hover:opacity-90 md:ml-2 md:px-3"
          onClick={() => {
            router.push("/patient/AI");
          }}
        >
          <Sparkles className="animated-icon md:mr-2 h-5 w-5 text-[#615EFC]" />
          <span className="hidden md:inline">AI Consultation</span>
        </Button>

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

export default PatientHeader;
