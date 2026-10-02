"use client";

// hooks
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";

// functions
import { generateToken } from "@/services/livekitService";

import { LiveKitRoom } from "@livekit/components-react";
import ConsultationRoom from "@/features/consultation/Chat/ConsultationRoom";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ChatPage() {
  const user = useSelector((state) => state.userReducer.user);
  const { consultationId } = useParams();
  const router = useRouter();
  const [token, setToken] = useState();

  const loadToken = async () => {
    try {
      const { data } = await generateToken(consultationId);
      setToken(data);
    } catch {
      router.push("/");
    }
  };

  useEffect(() => {
    if (user) loadToken();
  }, [user]);

  return (
    <div className="flex flex-col h-screen p-4 md:p-6 bg-gradient-to-b from-primary-50 to-white">
      {token ? (
        <LiveKitRoom
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <ConsultationRoom consultationId={consultationId} user={user} />
        </LiveKitRoom>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
