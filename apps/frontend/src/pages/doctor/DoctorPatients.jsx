// HOOKS
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

//  COMPONENTS
import DataTable from "@/components/DataTable";

// FUNCTIONS
import { getDoctorConsultations } from "@/services/consultationService";
import { DateTime } from "luxon";

// STYLE
import { Box, Heading, Tr, Td } from "@chakra-ui/react";

const DoctorPatients = () => {
  const [consultations, setConsultations] = useState([]);
  const user = useSelector((state) => state.userReducer.user);

  const loadConsultations = async () => {
    const consultationsData = (await getDoctorConsultations(user?._id)).data;
    setConsultations(
      consultationsData?.filter((c) => c.status === "completed"),
    );
  };

  useEffect(() => {
    if (user) {
      loadConsultations();
    }
  }, [user]);

  const uniquePatientConsultations = consultations?.filter(
    (consultation, index, self) =>
      index ===
      self.findIndex((c) => c.patient?._id === consultation.patient?._id),
  );

  const headers = ["Patient", "Phone", "Age", "Created at"];

  const renderRow = (consultation, index) => (
    <Tr key={index} fontSize="xs">
      <Td fontWeight="bold">
        {consultation?.patient?.firstName} {consultation?.patient?.lastName}
      </Td>
      <Td>{consultation?.patient?.phone}</Td>
      <Td>{consultation?.patient?.age}</Td>
      <Td>
        {DateTime.fromJSDate(new Date(consultation?.createdAt)).toFormat(
          "dd-MM-yyyy 'à' HH:mm",
        )}
      </Td>
    </Tr>
  );

  return (
    <Box px={12} py={6}>
      <Heading my={4} fontSize="lg">
        Patients who have completed their consultation
      </Heading>
      <DataTable
        data={uniquePatientConsultations}
        renderRow={renderRow}
        headers={headers}
      />
    </Box>
  );
};

export default DoctorPatients;
