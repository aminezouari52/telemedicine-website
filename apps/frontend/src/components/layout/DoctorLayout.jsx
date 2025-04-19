// HOOKS
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// FIREBASE
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

// COMPONENTS
import { Outlet } from "react-router-dom";
import { DoctorHeader } from "@/components/header";
import Spinner from "@/components/Spinner";
import ConsultationAlert from "./ConsultationAlert";

// STYLE
import { Box } from "@chakra-ui/react";

export const DoctorLayout = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.userReducer.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) navigate("/auth/login");
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user?.role !== "doctor") {
      navigate("/auth/login");
    }
  }, [user]);

  return isLoading ? (
    <Spinner />
  ) : (
    <Box h="100vh" overflowX="hidden">
      <ConsultationAlert />
      <DoctorHeader />
      <Outlet />
    </Box>
  );
};
