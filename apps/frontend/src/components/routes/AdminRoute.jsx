// HOOKS
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// FIREBASE
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

// COMPONENTS
import { Outlet } from "react-router-dom";

// STYLE
import { Box, Flex, Spinner } from "@chakra-ui/react";
import AdminHeader from "../header/AdminHeader";
import SideBar from "../header/SideBar";

const AdminRoute = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.loggedInUser);
  const [isLoading, setIsLoading] = useState(true);

  // redirect if user is not logged in
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // navigate("/login");
      }
      setIsLoading(false);
    });
  }, []);

  // redirect if user is not a patient
  useEffect(() => {
    if (user && user?.role !== "admin") {
      // navigate("/login");
    }
  }, [user]);

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
    <Flex h="calc(100vh - 40px)">
      <Box display={{ sm: "none", md: "block" }}>
        <SideBar />
      </Box>
      <Box w="100%" overflowX="hidden" bg="#e9ecef">
        <Box px={5} h="100%">
          <AdminHeader />
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default AdminRoute;
