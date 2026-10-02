"use client";

import { useTracks, VideoTrack } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useState } from "react";
import { CameraOff } from "lucide-react";

const CameraView = ({ trackRef, iconClassName }) =>
  trackRef?.publication && !trackRef.publication.isMuted ? (
    <VideoTrack trackRef={trackRef} style={{ objectFit: "contain" }} />
  ) : (
    <CameraOff className={iconClassName} />
  );

const VideoRenderer = () => {
  const trackRefs = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
  ]);
  const [fullscreenTrackIndex, setFullscreenTrackIndex] = useState(0);
  const minimizedTrackIndex = fullscreenTrackIndex === 1 ? 0 : 1;

  return (
    <div className="h-full w-full flex justify-center items-center">
      <CameraView
        trackRef={trackRefs[fullscreenTrackIndex]}
        iconClassName="w-12 h-12"
      />
      <div
        className="absolute ml-8 mt-8 right-8 bottom-8 w-9 min-h-5 sm:w-16 sm:min-h-8 rounded-md overflow-hidden cursor-pointer flex bg-white justify-center items-center"
        onClick={() => setFullscreenTrackIndex(minimizedTrackIndex)}
      >
        <CameraView
          trackRef={trackRefs[minimizedTrackIndex]}
          iconClassName="w-8 h-8"
        />
      </div>
    </div>
  );
};

export default VideoRenderer;
