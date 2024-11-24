// HOOKS
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/reducers/userReducer";

// FUNCTIONS
import { socket } from "@/socket";
import {
  getDoctorConsultations,
  getPatientConsultations,
} from "@/modules/consultation/functions/consultation";

// STYLE
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react";

const ConsultationAlert = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useSelector((state) => state.userReducer.user);
  const userRef = useRef(user);
  const cancelRef = useRef();

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const handleStartConsultation = (consultation) => {
    if (userRef.current) {
      if (
        [consultation.patientId, consultation.doctorId].includes(
          userRef.current?._id
        )
      ) {
        onOpen();
        dispatch(
          setUser({
            ...userRef.current,
            consultationId: consultation.consultationId,
          })
        );
      }
    }
  };

  useEffect(() => {
    socket.on("start", handleStartConsultation);
    return () => socket.off("start", handleStartConsultation);
  }, []);

  const fetchConsultation = async () => {
    let consultations = [];
    if (user.role === "patient") {
      consultations = await getPatientConsultations(user?._id);
    }
    if (user.role === "doctor") {
      consultations = await getDoctorConsultations(user?._id);
    }

    const inProgressconsultation = consultations?.data?.find(
      (c) => c.status === "in-progress"
    );

    if (
      inProgressconsultation &&
      inProgressconsultation?.doctor?._id &&
      inProgressconsultation?.patient?._id
    ) {
      handleStartConsultation({
        consultationId: inProgressconsultation?._id,
        doctorId: inProgressconsultation?.doctor?._id,
        patientId: inProgressconsultation?.patient?._id,
      });
    }
  };

  useEffect(() => {
    fetchConsultation();
  }, []);

  const handleConfirm = () => {
    onClose();
    navigate(`/${user?.consultationId}`);
  };

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Vous avez une consultation!</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          Vous avez une consultation, joingnez maintenant!
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button size="sm" ref={cancelRef} onClick={onClose}>
            Pas maintenant
          </Button>
          <Button
            colorScheme="primary"
            size="sm"
            ml={3}
            onClick={handleConfirm}
            _hover={{
              opacity: 0.8,
            }}
          >
            Joindre
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConsultationAlert;
