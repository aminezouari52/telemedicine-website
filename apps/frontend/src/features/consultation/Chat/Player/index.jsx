"use client";

import { RoomAudioRenderer, LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles";
import { useRef, useState } from "react";
import ControlsBar from "./ControlsBar";
import VideoRenderer from "./VideoRenderer";

const Player = ({ token, url, chatVisible, setChatVisible }) => {
  const [controlsVisible, setControlsVisible] = useState(true);
  const timeoutRef = useRef(null);

  const hideControls = () => setControlsVisible(false);
  const viewControls = () => {
    setControlsVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(hideControls, 3000);
  };

  return (
    <LiveKitRoom token={token} serverUrl={url}>
      <div
        className="h-full w-full bg-black relative rounded-md overflow-hidden flex items-center justify-center"
        onClick={viewControls}
        onMouseMove={viewControls}
        onMouseLeave={hideControls}
      >
        <VideoRenderer />
        <ControlsBar
          chatVisible={chatVisible}
          setChatVisible={setChatVisible}
          show={controlsVisible}
        />
      </div>
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
};

export default Player;
