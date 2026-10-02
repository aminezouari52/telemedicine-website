import { useClerk } from "@clerk/nextjs";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "@/reducers/userReducer";
import { SIGN_IN_URL } from "@/constants/auth";
import useToast from "./useToast";

/** Ends the Clerk session, clears cached user data and returns to sign-in. */
const useLogout = () => {
  const { signOut } = useClerk();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const toast = useToast();

  return async () => {
    try {
      await signOut({ redirectUrl: SIGN_IN_URL });
      dispatch(logout(null));
      queryClient.removeQueries();
    } catch (err) {
      console.error("[auth] Sign-out failed:", err);
      toast("Logout failed!", "error");
    }
  };
};

export default useLogout;
