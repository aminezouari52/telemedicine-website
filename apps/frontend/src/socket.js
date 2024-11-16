import { io } from "socket.io-client";

const URL =
  import.meta.env.VITE_NODE_ENV === "production"
    ? undefined
    : import.meta.env.VITE_API_BASE_URL;

export const socket = io(URL, {
  withCredentials: true,
});
