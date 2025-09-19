"use client";

import { RoomAudioRenderer, LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles";
import { useRef, useState } from "react";
import { Box } from "@chakra-ui/react";
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
      <Box
        h="full"
        w="full"
        bg="black"
        position="relative"
        rounded="md"
        overflow="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
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
      </Box>
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
};

export default Player;
