"use client";

import { useTracks, VideoTrack } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useMemo, useState } from "react";
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
    <div className="h-full w-full flex justify-center items-center">
      {fullscreenTrackRef &&
      fullscreenTrackRef.publication &&
      !fullscreenTrackRef.publication.isMuted ? (
        <VideoTrack
          trackRef={fullscreenTrackRef}
          style={{ objectFit: "contain" }}
        />
      ) : (
        <FiCameraOff className="w-12 h-12" />
      )}
      <div
        className="absolute ml-8 mt-8 right-8 bottom-8 w-9 min-h-5 sm:w-16 sm:min-h-8 rounded-md overflow-hidden cursor-pointer flex bg-white justify-center items-center"
        onClick={() => setFullscreenTrackIndex((prev) => (prev === 1 ? 0 : 1))}
      >
        {minimizedTrackRef &&
        minimizedTrackRef.publication &&
        !minimizedTrackRef.publication.isMuted ? (
          <VideoTrack
            trackRef={minimizedTrackRef}
            style={{ objectFit: "contain" }}
          />
        ) : (
          <FiCameraOff className="w-8 h-8" />
        )}
      </div>
    </div>
  );
};

export default VideoRenderer;
