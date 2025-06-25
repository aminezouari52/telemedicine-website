"use client";

import { Box, IconButton } from "@chakra-ui/react";
import { TbMessageOff, TbMessage } from "react-icons/tb";
import AudioDevice from "./AudioDevice";
import VideoDevice from "./VideoDevice";

const ControlsBar = ({ show, chatVisible, setChatVisible }) => {
  const toggleChatVisible = () => setChatVisible((prev) => !prev);

  return (
    <Box
      position="absolute"
      top="8"
      right="8"
      display="flex"
      bg="white"
      p={2}
      gap={2}
      rounded="md"
      opacity={show ? 1 : 0}
      transition="0.3s"
    >
      <AudioDevice />

      <VideoDevice />

      <IconButton
        onClick={toggleChatVisible}
        variant="outline"
        borderColor="gray.800"
        size="sm"
        px={4}
      >
        {chatVisible ? <TbMessage /> : <TbMessageOff />}
      </IconButton>
    </Box>
  );
};

export default ControlsBar;
