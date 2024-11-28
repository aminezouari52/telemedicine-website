// HOOKS
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import DataTable from "@/components/DataTable";

// FUNCTIONS
import { getDoctorConsultations } from "@/modules/consultation/functions/consultation";
import { DateTime } from "luxon";

// STYLE
import {
  Box,
  Card,
  CardBody,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  Tr,
  Td,
} from "@chakra-ui/react";

const DoctorPatients = () => {
  const [consultations, setConsultations] = useState([]);
  const user = useSelector((state) => state.userReducer.user);

  const loadConsultations = async () => {
    const consultationsData = (await getDoctorConsultations(user?._id)).data;
    setConsultations(
      consultationsData?.filter((c) => c.status === "completed")
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
      self.findIndex((c) => c.patient?._id === consultation.patient?._id)
  );

  const headers = ["Patient", "Phone", "Age", "Créer le"];

  const renderRow = (consultation, index) => (
    <Tr key={index} fontSize="xs">
      <Td fontWeight="bold">
        {consultation?.patient?.firstName} {consultation?.patient?.lastName}
      </Td>
      <Td>{consultation?.patient?.phone}</Td>
      <Td>{consultation?.patient?.age}</Td>
      <Td>
        {DateTime.fromJSDate(new Date(consultation?.createdAt)).toFormat(
          "dd-MM-yyyy 'à' HH:mm"
        )}
      </Td>
    </Tr>
  );

  return (
    <Box m={6}>
      <Heading my={4} fontSize="lg">
        Les patients qui ont compléter leur consultation
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
