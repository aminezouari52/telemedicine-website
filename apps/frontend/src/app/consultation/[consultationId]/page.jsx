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

import { Send } from "lucide-react";
import { ChevronRight } from "lucide-react";

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
      <div className="flex flex-col justify-between h-screen p-8 gap-4 bg-white">
        <div className="flex items-center justify-between">
          {mounted && user?.role === "patient" && (
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="/assets/avatar-doctor.jpg" alt="Doctor" />
                <AvatarFallback>D</AvatarFallback>
              </Avatar>
              <p className="text-sm">
                {currentUsers?.doctor ? (
                  <span>
                    Dr <strong>{currentUsers?.doctor}</strong> is active
                  </span>
                ) : (
                  <span>Waiting for the doctor to join...</span>
                )}
              </p>
            </div>
          )}
          {mounted && user?.role === "doctor" && (
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="/assets/avatar-patient.png" alt="Patient" />
                <AvatarFallback>P</AvatarFallback>
              </Avatar>
              {currentUsers?.patient ? (
                <p className="text-sm">
                  <strong>{currentUsers?.patient}</strong> is active
                </p>
              ) : (
                <p className="text-sm">Waiting for patient to join...</p>
              )}
            </div>
          )}

          <div className="flex flex-col items-end justify-end">
            <Button
              size="sm"
              variant="destructive"
              className="px-4 text-white"
              onClick={onOpenLeave}
            >
              Leave
            </Button>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-md font-semibold text-center">
              Consultation in progress
            </h2>
          </div>
        </div>
        <div className="flex h-[87%] w-full gap-4 justify-center">
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
            } p-4 gap-4 bg-primary-100 w-[500px] flex-col rounded-md h-full`}
          >
            <button
              type="button"
              onClick={toggleChat}
              className="self-end inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary-500 text-white hover:opacity-80"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="flex flex-col gap-4 h-full min-h-0">
              <div className="flex flex-col-reverse overflow-y-auto flex-1 p-2">
                <div className="flex flex-col gap-4">
                  {messages.map(({ name, message: msg, time }, index) => (
                    <div className="flex gap-1" key={index}>
                      {user?.firstName !== name && (
                        <Avatar>
                          <AvatarImage
                            src={
                              user?.role !== "doctor"
                                ? "/assets/avatar-doctor.jpg"
                                : "/assets/avatar-patient.png"
                            }
                          />
                          <AvatarFallback>
                            {user?.role !== "doctor" ? "D" : "P"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`w-full flex ${
                          user?.firstName !== name
                            ? "justify-start"
                            : "justify-end"
                        }`}
                      >
                        <div>
                          {user?.firstName !== name && (
                            <p className="font-bold text-sm">{name}</p>
                          )}
                          <div className="flex flex-col items-end max-w-[200px] bg-white px-2 py-1 rounded-lg">
                            <p className="text-sm">{msg}</p>
                            <p className="text-xs text-gray-500">{time}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  ref={message}
                  type="text"
                  placeholder="type a message"
                  className="border-primary-500 focus-visible:ring-primary-500 text-black text-sm"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") sendMessage();
                  }}
                />
                <Button
                  type="button"
                  size="icon"
                  className="bg-primary-500 text-white hover:opacity-80  focus-visible:ring-primary-500"
                  onClick={sendMessage}
                >
                  <Send />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
