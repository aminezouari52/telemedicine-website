import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const socket = io(URL);
