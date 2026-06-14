"use client";

// hooks
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { useUserCheck } from "@/hooks";

// functions
import { socket } from "@/socket";
import {
  updateConsultation,
  getPatientConsultations,
  getDoctorConsultations,
} from "@/services/consultationService";
import { isConsultationJoinable } from "@/utils/consultationJoinable";
import { generateToken } from "@/services/livekitService";

import CompleteDialog from "@/features/consultation/Chat/CompleteDialog";
import LeaveDialog from "@/features/consultation/Chat/LeaveDialog";
import Player from "@/features/consultation/Chat/Player";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { Send, ChevronRight, PhoneOff, MessagesSquare } from "lucide-react";

export default function ChatPage() {
  const user = useSelector((state) => state.userReducer.user);
  const { consultationId } = useParams();
  const message = useRef();
  const userCheck = useUserCheck();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState([]);
  const [currentUsers, setCurrentUsers] = useState({});
  const [token, setToken] = useState();
  const [chatVisible, setChatVisible] = useState(true);

  const [isOpenLeave, setIsOpenLeave] = useState(false);
  const [isOpenComplete, setIsOpenComplete] = useState(false);

  // `user` is hydrated from localStorage, so it's null during SSR but present on
  // the first client render. Gate user-dependent UI on `mounted` to keep the
  // first client render identical to the server and avoid hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const onOpenLeave = () => setIsOpenLeave(true);
  const onCloseLeave = () => setIsOpenLeave(false);
  const onOpenComplete = () => setIsOpenComplete(true);
  const onCloseComplete = () => setIsOpenComplete(false);

  const sendMessage = () => {
    const text = message.current?.value?.trim();
    if (!text) return;
    const hours = String(new Date().getHours()).padStart(2, "0");
    const minutes = String(new Date().getMinutes()).padStart(2, "0");
    const time = `${hours}:${minutes}`;
    socket.emit("sendMessage", {
      roomId: consultationId,
      message: text,
      name: user?.firstName,
      time,
    });
    setMessages((prev) => [
      ...prev,
      { name: user?.firstName, message: text, time },
    ]);
    message.current.value = "";
  };

  const leaveConsultation = async () => {
    userCheck(async (tokenValue) => {
      onCloseLeave();
      socket.emit("leave", consultationId);
      await updateConsultation(consultationId, tokenValue, {
        status: "completed",
      });
      queryClient.invalidateQueries({
        queryKey: ["consultation", "joinable", user?._id],
      });
      queryClient.invalidateQueries({
        queryKey: ["consultations", user?._id, user?.role],
      });
      router.push("/");
    });
  };

  const completeConsultation = () => {
    onCloseComplete();
    queryClient.invalidateQueries({
      queryKey: ["consultation", "joinable", user?._id],
    });
    queryClient.invalidateQueries({
      queryKey: ["consultations", user?._id, user?.role],
    });
    router.push("/");
  };

  const loadConsultation = async () => {
    let consultationData = [];
    if (user?.role === "doctor") {
      consultationData = (await getDoctorConsultations(user?._id)).data;
    }
    if (user?.role === "patient") {
      consultationData = (await getPatientConsultations(user?._id)).data;
    }
    const roomId = Array.isArray(consultationId)
      ? consultationId[0]
      : consultationId;
    const consultation = consultationData.find(
      (c) => String(c._id) === String(roomId),
    );

    if (!consultation || !isConsultationJoinable(consultation)) {
      router.push("/");
    }
  };

  const loadToken = async () => {
    const { data } = await generateToken(
      consultationId,
      `${user.firstName} ${user.lastName}`,
    );
    setToken(data);
  };

  useEffect(() => {
    if (user) {
      loadConsultation();
      loadToken();
    }
  }, [user]);

  const toggleChat = () => setChatVisible((prev) => !prev);

  // Presence shown in the header is always the *other* participant.
  const isPatient = user?.role === "patient";
  const peer = {
    name: isPatient ? currentUsers?.doctor : currentUsers?.patient,
    label: isPatient ? "Doctor" : "Patient",
    prefix: isPatient ? "Dr " : "",
    image: isPatient
      ? "/assets/avatar-doctor.jpg"
      : "/assets/avatar-patient.png",
    fallback: isPatient ? "D" : "P",
  };
  const peerOnline = Boolean(peer.name);

  const socketJoinedHandler = ({ role, name }) => {
    if (role && name) {
      setCurrentUsers((prev) => ({
        ...prev,
        [role]: name,
      }));
    }
  };

  const socketReceiveMessageHandler = ({ name, message: msg, time }) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { name, message: msg, time },
    ]);
  };

  const cleanupEffect = () => {
    if (consultationId && user) {
      socket.emit("exitPage", {
        roomId: consultationId,
        role: user?.role,
      });
    }
    socket.removeAllListeners();
    window.removeEventListener("beforeunload", cleanupEffect);
  };

  useEffect(() => {
    socket.emit("join", {
      roomId: consultationId,
      role: user?.role,
      name: user?.firstName,
    });

    socket.on("joined", socketJoinedHandler);
    socket.on("receiveMessage", socketReceiveMessageHandler);
    socket.emit("getUsers", consultationId);
    socket.on("sendUsers", setCurrentUsers);
    socket.on("userLeft", onOpenComplete);

    window.addEventListener("beforeunload", cleanupEffect);
    return cleanupEffect;
  }, [socket]);

  return (
    <>
      <CompleteDialog
        onClose={onCloseComplete}
        completeConsultation={completeConsultation}
        isOpen={isOpenComplete}
      />
      <LeaveDialog
        onClose={onCloseLeave}
        leaveConsultation={leaveConsultation}
        isOpen={isOpenLeave}
      />
      <div className="flex flex-col h-screen p-4 md:p-6 gap-4 bg-gradient-to-b from-primary-50 to-white">
        {/* Top bar: peer presence + live status + leave */}
        <header className="flex items-center justify-between gap-4 rounded-2xl border border-primary-100 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
          {mounted && (
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <Avatar className="h-11 w-11 ring-2 ring-primary-100">
                  <AvatarImage src={peer.image} alt={peer.label} />
                  <AvatarFallback>{peer.fallback}</AvatarFallback>
                </Avatar>
                <span
                  className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
                    peerOnline ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  {peerOnline && (
                    <span className="absolute inset-0 rounded-full bg-green-500 animate-ping" />
                  )}
                </span>
              </div>
              <div className="min-w-0">
                {peerOnline ? (
                  <>
                    <p className="truncate text-sm font-semibold text-primary-900">
                      {peer.prefix}
                      {peer.name}
                    </p>
                    <p className="text-xs font-medium text-green-600">Online</p>
                  </>
                ) : (
                  <>
                    <p className="truncate text-sm font-semibold text-primary-900">
                      {peer.label}
                    </p>
                    <p className="text-xs text-gray-400">Waiting to join...</p>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>
              <span className="text-xs font-semibold text-primary-700">
                Consultation in progress
              </span>
            </div>
            <Button
              size="sm"
              variant="destructive"
              className="gap-2 rounded-full px-4 text-white shadow-sm"
              onClick={onOpenLeave}
            >
              <PhoneOff className="h-4 w-4" />
              Leave
            </Button>
          </div>
        </header>

        <div className="flex flex-1 min-h-0 w-full gap-4 justify-center">
          {token && (
            <div
              className={`w-full h-full ${
                chatVisible ? "hidden md:block" : "block"
              }`}
            >
              <Player
                url={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                token={token}
                chatVisible={chatVisible}
                setChatVisible={setChatVisible}
              />
            </div>
          )}
          <div
            className={`${
              chatVisible ? "flex" : "hidden"
            } w-full md:w-[420px] flex-col rounded-2xl border border-primary-100 bg-white shadow-sm overflow-hidden h-full`}
          >
            {/* Chat header */}
            <div className="flex items-center justify-between gap-2 border-b border-primary-100 bg-primary-50/60 px-4 py-3">
              <div className="flex items-center gap-2 text-primary-800">
                <MessagesSquare className="h-5 w-5" />
                <span className="text-sm font-semibold">Chat</span>
              </div>
              <button
                type="button"
                onClick={toggleChat}
                aria-label="Hide chat"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full text-primary-700 hover:bg-primary-100 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 h-full min-h-0 p-3">
              <div className="flex flex-col-reverse overflow-y-auto flex-1 px-1">
                {messages.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-gray-400">
                    <MessagesSquare className="h-10 w-10 text-primary-200" />
                    <p className="text-sm font-medium">No messages yet</p>
                    <p className="text-xs">
                      Send a message to start the conversation.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {messages.map(({ name, message: msg, time }, index) => {
                      const isOwn = user?.firstName === name;
                      return (
                        <div
                          className={`flex items-end gap-2 ${
                            isOwn ? "justify-end" : "justify-start"
                          }`}
                          key={index}
                        >
                          {!isOwn && (
                            <Avatar className="h-7 w-7 shrink-0">
                              <AvatarImage src={peer.image} />
                              <AvatarFallback>{peer.fallback}</AvatarFallback>
                            </Avatar>
                          )}
                          <div className="flex flex-col max-w-[75%]">
                            {!isOwn && (
                              <p className="mb-0.5 ml-1 text-xs font-semibold text-primary-700">
                                {name}
                              </p>
                            )}
                            <div
                              className={`px-3 py-2 text-sm shadow-sm ${
                                isOwn
                                  ? "bg-primary-500 text-white rounded-2xl rounded-br-md"
                                  : "bg-primary-50 text-primary-900 rounded-2xl rounded-bl-md"
                              }`}
                            >
                              <p className="break-words">{msg}</p>
                              <p
                                className={`mt-1 text-right text-[10px] ${
                                  isOwn ? "text-white/70" : "text-gray-400"
                                }`}
                              >
                                {time}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  ref={message}
                  type="text"
                  placeholder="Type a message..."
                  className="rounded-full border-primary-200 bg-primary-50/40 focus-visible:ring-primary-500 text-black text-sm"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") sendMessage();
                  }}
                />
                <Button
                  type="button"
                  size="icon"
                  aria-label="Send message"
                  className="shrink-0 rounded-full bg-primary-500 text-white hover:opacity-80 focus-visible:ring-primary-500"
                  onClick={sendMessage}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
