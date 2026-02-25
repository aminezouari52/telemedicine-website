"use client";

// hooks
import { useSelector } from "react-redux";

// components
import DataTable from "@/components/DataTable";
import LoadingSpinner from "@/components/LoadingSpinner";

// functions
import { getDoctorConsultations } from "@/services/consultationService";
import { DateTime } from "luxon";

// style
import { useQuery } from "@tanstack/react-query";

export default function DoctorPatientsPage() {
  const user = useSelector((state) => state.userReducer.user);

  const getConsultations = async () => {
    const consultationsData = (await getDoctorConsultations(user?._id)).data;
    return consultationsData?.filter((c) => c.status === "completed");
  };

  const {
    data: consultations,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["patients"],
    queryFn: () => getConsultations(),
  });

  if (isPending) {
    return (
      <div className="flex flex-row justify-center mt-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-row justify-center mt-10">
        Error : {error.message}
      </div>
    );
  }

  const uniquePatientConsultations = consultations?.filter(
    (consultation, index, self) =>
      index ===
      self.findIndex((c) => c.patient?._id === consultation.patient?._id),
  );

  const headers = ["Patient", "Phone", "Age", "Created at"];

  const renderRow = (consultation, index) => (
    <tr key={index} className="text-xs">
      <td className="font-bold">
        {consultation?.patient?.firstName} {consultation?.patient?.lastName}
      </td>
      <td>{consultation?.patient?.phone}</td>
      <td>{consultation?.patient?.age}</td>
      <td>
        {DateTime.fromJSDate(new Date(consultation?.createdAt)).toFormat(
          "dd-MM-yyyy 'à' HH:mm",
        )}
      </td>
    </tr>
  );

  return (
    <div className="px-12 py-6">
      <h2 className="my-4 text-lg font-semibold">
        Patients who have completed their consultation
      </h2>
      <DataTable
        data={uniquePatientConsultations}
        renderRow={renderRow}
        headers={headers}
      />
    </div>
  );
}
