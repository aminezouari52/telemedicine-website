import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  getDoctorConsultations,
  getPatientConsultations,
} from "@/services/consultationService";

const useMyConsultations = (options) => {
  const user = useSelector((state) => state.userReducer.user);
  const getConsultations =
    user?.role === "doctor" ? getDoctorConsultations : getPatientConsultations;

  return useQuery({
    queryKey: ["consultations", user?._id],
    queryFn: async () => (await getConsultations(user._id)).data,
    enabled: !!user?._id,
    ...options,
  });
};

export default useMyConsultations;
