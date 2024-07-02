// HOOKS
import { useEffect } from "react";

// VIDEO REACT SDK
import {
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./style.css";

const apiKey = "mmhfdzb5evj2"; // the API key can be found in the "Credentials" section
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiR2VuZXJhbF9Eb2Rvbm5hIiwiaXNzIjoiaHR0cHM6Ly9wcm9udG8uZ2V0c3RyZWFtLmlvIiwic3ViIjoidXNlci9HZW5lcmFsX0RvZG9ubmEiLCJpYXQiOjE3MTkwNTU3NjEsImV4cCI6MTcxOTY2MDU2Nn0.fBD-FHiYSDvuUzGni9clv81TOdnF-kar_TdEwLprqOQ"; // the token can be found in the "Credentials" section
const userId = "General_Dodonna"; // the user id can be found in the "Credentials" section
const callId = "z00WSDN3jGFD"; // the call id can be found in the "Credentials" section
const user = {
  id: userId,
  name: "Oliver",
  image: "https://getstream.io/random_svg/?id=oliver&name=Oliver",
};
const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call("default", callId);

// STYLE
import { Box, Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function App() {
  useEffect(() => {
    call.join({ create: true });
    return () => {
      call.endCall();
    };
  }, []);

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MyUILayout />
      </StreamCall>
    </StreamVideo>
  );
}

export const MyUILayout = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  if (callingState !== CallingState.JOINED) {
    return (
      <>
        <Box h="100%" w="100%" zIndex="-4" bg="#000" opacity="0.1"></Box>
        <Spinner
          position="absolute"
          top="50%"
          right="50%"
          thickness="4px"
          emptyColor="gray.200"
          color="primary.500"
          size="xl"
        />
      </>
    );
  }

  return (
    <StreamTheme>
      <SpeakerLayout participantsBarPosition="bottom" />
      <CallControls onLeave={() => navigate("/patient/home")} />
    </StreamTheme>
  );
};
