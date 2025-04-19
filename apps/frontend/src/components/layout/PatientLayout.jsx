// HOOKS
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// FUNCTIONS
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

// COMPONENTS
import { Outlet } from "react-router-dom";
import { PatientHeader } from "@/components/header";
import Spinner from "@/components/Spinner";
import ConsultationAlert from "./ConsultationAlert";

// STYLE
import { Box } from "@chakra-ui/react";

export const PatientLayout = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.userReducer.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        navigate("/auth/login");
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user?.role !== "patient") {
      navigate("/auth/login");
    }
  }, [user]);

  return isLoading ? (
    <Spinner />
  ) : (
    <Box h="100vh" overflowX="hidden">
      <ConsultationAlert />
      <PatientHeader />
      <Outlet />
    </Box>
  );
};
