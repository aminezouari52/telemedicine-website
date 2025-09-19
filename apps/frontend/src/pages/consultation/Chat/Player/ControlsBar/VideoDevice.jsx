import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  CameraDisabledIcon,
  CameraIcon,
  useLocalParticipant,
  useMediaDeviceSelect,
} from "@livekit/components-react";

const VideoDevice = () => {
  const { isCameraEnabled, localParticipant } = useLocalParticipant();
  const { devices, activeDeviceId, setActiveMediaDevice } =
    useMediaDeviceSelect({
      kind: "videoinput",
    });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toggleCamera = () => {
    localParticipant.setCameraEnabled(!localParticipant.isCameraEnabled);
  };

  return (
    <ButtonGroup size="sm" isAttached variant="outline">
      <Button onClick={toggleCamera} px={4} borderColor="gray.800">
        {isCameraEnabled ? <CameraIcon /> : <CameraDisabledIcon />}
      </Button>

      <Popover isOpen={isOpen} onClose={onClose}>
        <PopoverTrigger>
          <IconButton onClick={onOpen} borderColor="gray.800">
            {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </IconButton>
        </PopoverTrigger>
        <PopoverContent>
          <Box bg="white" shadow="md" borderRadius="md">
            {devices.map((device) => (
              <Box
                key={device.deviceId}
                p={2}
                _hover={{
                  bg:
                    device.deviceId === activeDeviceId
                      ? "primary.300"
                      : "primary.100",
                }}
                cursor={device.deviceId !== activeDeviceId && "pointer"}
                _disabled={device.deviceId === activeDeviceId}
                bg={device.deviceId === activeDeviceId && "primary.300"}
                onClick={() => {
                  setActiveMediaDevice(device.deviceId);
                  onClose();
                }}
              >
                {device.label}
              </Box>
            ))}
          </Box>
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  );
};

export default VideoDevice;
