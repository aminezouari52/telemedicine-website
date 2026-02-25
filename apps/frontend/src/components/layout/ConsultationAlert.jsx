"use client";

// HOOKS
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/reducers/userReducer";

// FUNCTIONS
import { socket } from "@/socket";
import {
  getDoctorConsultations,
  getPatientConsultations,
} from "@/services/consultationService";

// STYLE
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ConsultationAlert = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.userReducer.user);
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const handleStartConsultation = (consultation) => {
    if (userRef.current) {
      if (
        [consultation.patientId, consultation.doctorId].includes(
          userRef.current?._id,
        )
      ) {
        setIsOpen(true);
        dispatch(
          setUser({
            ...userRef.current,
            consultationId: consultation.consultationId,
          }),
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
      (c) => c.status === "in-progress",
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
    try {
      fetchConsultation();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    router.push(`/${user?.consultationId}`);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You have a consultation!</AlertDialogTitle>
          <AlertDialogDescription>
            You have a consultation, join now!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            Maybe later
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="hover:opacity-80"
          >
            Join
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConsultationAlert;
