"use client";

import { useTracks, VideoTrack } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useMemo, useState } from "react";
import { Box, Icon } from "@chakra-ui/react";
import { FiCameraOff } from "react-icons/fi";

const VideoRenderer = () => {
  const trackRefs = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
  ]);
  const [fullscreenTrackIndex, setFullscreenTrackIndex] = useState(0);
  const fullscreenTrackRef = useMemo(
    () => trackRefs[fullscreenTrackIndex],
    [trackRefs, fullscreenTrackIndex],
  );
  const minimizedTrackRef = useMemo(
    () => trackRefs[fullscreenTrackIndex === 1 ? 0 : 1],
    [trackRefs, fullscreenTrackIndex],
  );

  return (
    <Box
      h="full"
      w="full"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {fullscreenTrackRef &&
      fullscreenTrackRef.publication &&
      !fullscreenTrackRef.publication.isMuted ? (
        <VideoTrack
          trackRef={fullscreenTrackRef}
          style={{ objectFit: "contain" }}
        />
      ) : (
        <Icon width={12} height={12} as={FiCameraOff} />
      )}
      <Box
        position="absolute"
        ml="8"
        mt="8"
        right="8"
        bottom="8"
        sx={{
          width: 36,
          minH: 20,
          "@media (min-width: 400px)": {
            width: 64,
            minH: 32,
          },
        }}
        rounded="md"
        overflow="hidden"
        cursor="pointer"
        onClick={() => setFullscreenTrackIndex((prev) => (prev === 1 ? 0 : 1))}
        display="flex"
        background="white"
        justifyContent="center"
        alignItems="center"
      >
        {minimizedTrackRef &&
        minimizedTrackRef.publication &&
        !minimizedTrackRef.publication.isMuted ? (
          <VideoTrack
            trackRef={minimizedTrackRef}
            style={{ objectFit: "contain" }}
          />
        ) : (
          <Icon width={8} height={8} as={FiCameraOff} />
        )}
      </Box>
    </Box>
  );
};

export default VideoRenderer;
