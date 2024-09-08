// HOOKS
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// FIREBASE
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

// COMPONENTS
import { Outlet } from "react-router-dom";
import { DoctorHeader } from "../header";

// STYLE
import { Box, Spinner } from "@chakra-ui/react";

const DoctorRoute = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.loggedInUser);
  const [isLoading, setIsLoading] = useState(true);

  // redirect if user is not logged in
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
      }
      setIsLoading(false);
    });
  }, []);

  // redirect if user is not a doctor
  useEffect(() => {
    if (user && user?.role !== "doctor") {
      navigate("/login");
    }
  }, [user]);

  // redirect to profile if new doctor
  // useEffect(() => {
  //   if (user && user?.role === "doctor") {
  //     // redirect to profile
  //   }
  // }, []);

  return isLoading ? (
    <Spinner
      pos="absolute"
      top="50%"
      right="50%"
      thickness="4px"
      emptyColor="gray.200"
      color="primary.500"
      size="xl"
    />
  ) : (
    <Box h="100vh" overflowX="hidden">
      <DoctorHeader />
      <Outlet />
    </Box>
  );
};

export default DoctorRoute;
