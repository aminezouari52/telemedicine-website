"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, MessageCircleOff } from "lucide-react";
import { cn } from "@/lib/utils";
import AudioDevice from "./AudioDevice";
import VideoDevice from "./VideoDevice";

const ControlsBar = ({ show, chatVisible, setChatVisible }) => {
  const toggleChatVisible = () => setChatVisible((prev) => !prev);

  return (
    <div
      className={cn(
        "absolute top-8 right-8 flex bg-white p-2 gap-2 rounded-md transition-opacity duration-300",
        show ? "opacity-100" : "opacity-0",
      )}
    >
      <AudioDevice />

      <VideoDevice />

      <Button
        onClick={toggleChatVisible}
        variant="outline"
        size="sm"
        className="px-4 border-gray-800"
      >
        {chatVisible ? <MessageCircle /> : <MessageCircleOff />}
      </Button>
    </div>
  );
};

export default ControlsBar;
