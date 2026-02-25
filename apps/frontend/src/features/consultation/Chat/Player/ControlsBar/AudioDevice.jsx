"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  MicDisabledIcon,
  MicIcon,
  useLocalParticipant,
  useMediaDeviceSelect,
} from "@livekit/components-react";
import { cn } from "@/lib/utils";

const AudioDevice = () => {
  const { isMicrophoneEnabled, localParticipant } = useLocalParticipant();
  const { devices, activeDeviceId, setActiveMediaDevice } =
    useMediaDeviceSelect({
      kind: "audioinput",
    });

  const [isOpen, setIsOpen] = useState(false);

  const toggleMicrophone = () => {
    localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
  };

  return (
    <div className="inline-flex rounded-md border border-gray-800">
      <Button
        onClick={toggleMicrophone}
        size="sm"
        variant="outline"
        className="px-4 rounded-r-none border-r-0 border-gray-800"
      >
        {isMicrophoneEnabled ? <MicIcon /> : <MicDisabledIcon />}
      </Button>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="rounded-l-none border-gray-800"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <div className="bg-white shadow-md rounded-md">
            {devices.map((device) => (
              <div
                key={device.deviceId}
                className={cn(
                  "p-2 cursor-pointer",
                  device.deviceId === activeDeviceId
                    ? "bg-primary-300"
                    : "bg-white hover:bg-primary-100",
                )}
                onClick={() => {
                  setActiveMediaDevice(device.deviceId);
                  setIsOpen(false);
                }}
              >
                {device.label}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AudioDevice;
