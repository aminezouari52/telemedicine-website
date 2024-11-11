// HOOKS
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

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
} from "@chakra-ui/react";

const DoctorPatients = () => {
  const [consultations, setConsultations] = useState([]);
  const user = useSelector((state) => state.userReducer.user);

  const loadConsultations = async () => {
    const consultationsData = (await getDoctorConsultations(user?._id)).data;
    setConsultations(consultationsData);
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

  return (
    <Box mx={6} mt={5}>
      {!uniquePatientConsultations?.length && (
        <Text>Vous n'avez pas de patients</Text>
      )}
      <SimpleGrid color="#fff" columns={4} gap={4}>
        {uniquePatientConsultations?.map((consultation, index) => {
          return (
            <Card key={index}>
              <CardBody>
                <Stack>
                  <Heading size="md">
                    {consultation?.patient.firstName}{" "}
                    {consultation?.patient.lastName}
                  </Heading>
                  <Text>
                    <strong>Téléphone: </strong>
                    {consultation?.patient.phone}
                  </Text>
                  <Text>
                    <strong>age: </strong>
                    {consultation?.patient.age}
                  </Text>
                  <Text>
                    <strong>Créer le: </strong>
                    {DateTime.fromJSDate(
                      new Date(consultation?.createdAt)
                    ).toFormat("dd-MM-yyyy 'à' HH:mm")}
                    {}
                  </Text>
                </Stack>
              </CardBody>
            </Card>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default DoctorPatients;
