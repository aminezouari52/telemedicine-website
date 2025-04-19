import { useSelector } from "react-redux";
import { useToast } from "@/hooks";

const useUserCheck = () => {
  const user = useSelector((state) => state.userReducer.user);
  const toast = useToast();

  return (callback, showToast = true) => {
    if (user?.token) {
      try {
        callback(user.token);
        // toast(response.data.message, "success");
      } catch (error) {
        console.error(error);
        showToast && toast(error.response.data.message, "error");
      }
    }
  };
};

export default useUserCheck;
