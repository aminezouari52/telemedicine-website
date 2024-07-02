// HOOKS
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// FIREBASE
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

// COMPONENTS
import { Outlet } from "react-router-dom";
import DoctorHeader from "../doctorHeader/Header";

// STYLE
import { Box, Spinner } from "@chakra-ui/react";

const DoctorRoute = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.loggedInUser);
  const [ok, setOk] = useState(false);

  // redirect if user is not logged in
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
      }
      setOk(true);
    });
  }, []);

  // redirect if user is not a doctor
  useEffect(() => {
    if (user && user?.role !== "doctor") {
      navigate("/login");
    }
  }, [user]);

  return ok ? (
    <Box h="100vh" overflowX="hidden">
      <DoctorHeader />
      <Outlet />
    </Box>
  ) : (
    <Spinner
      position="absolute"
      top="50%"
      right="50%"
      thickness="4px"
      emptyColor="gray.200"
      color="primary.500"
      size="xl"
    />
  );
};

export default DoctorRoute;
