// HOOKS
import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// FUNCTIONS
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { logout } from "../../reducers/userReducer";

// STYLE
import { Flex, Button } from "@chakra-ui/react";

// ASSETS
import { ArrowForwardIcon } from "@chakra-ui/icons";

const AdminHeader = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      setIsAtTop(scrollTop === 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      dispatch(logout(null));
      // navigate("/login");
    } catch (err) {
      console.log(err);
      toast({
        title: "Logout failed!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex pos="sticky" top="0" zIndex="11" p={4} justifyContent="flex-end">
      <Button
        size="sm"
        color="#fff"
        bg="secondary.500"
        variant="solid"
        rightIcon={<ArrowForwardIcon />}
        _hover={{
          opacity: 0.8,
        }}
        onClick={logoutHandler}
      >
        Déconnecter
      </Button>
    </Flex>
  );
};

export default AdminHeader;
