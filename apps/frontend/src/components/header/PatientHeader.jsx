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

// COMPONENTS
import HeaderButton from "./HeaderButton";
import Logo from "@/components/Logo";

// STYLE
import { Button } from "@/components/ui/button";

// ASSETS
import { IoChatboxSharp } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import { MdAutoAwesome } from "react-icons/md";

export const PatientHeader = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const toast = useToast();
  const user = useSelector((state) => state.userReducer.user);

  const { data: consultation } = useQuery({
    queryKey: ["consultation", user?._id],
    queryFn: async () => {
      const consultationsData = (await getPatientConsultations(user?._id)).data;
      return consultationsData.find((c) => c.status === "in-progress") || null;
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

  return (
    <header className="sticky top-0 bg-white items-center h-[62px] w-full px-14 shadow-md z-[5] grid grid-cols-3">
      <Logo />
      <div className="flex items-center gap-5 h-full">
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
      <div className="flex gap-1 items-center justify-end h-full">
        {user && !!consultation && (
          <Button
            size="sm"
            className="hover:opacity-80"
            onClick={() => {
              router.push(`/${user?.consultationId}`);
            }}
          >
            Join
            <IoChatboxSharp className="ml-2" />
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          className="ml-2 hover:bg-gray-100 hover:opacity-90"
          onClick={() => {
            router.push("/patient/AI");
          }}
        >
          <MdAutoAwesome className="animated-icon mr-2" size="20px" />
          AI Consultation
        </Button>

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

export default PatientHeader;
