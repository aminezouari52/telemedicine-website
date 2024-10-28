// HOOKS
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// FUNCTIONS
import { getDoctorConsultations } from "@/modules/doctor/functions/doctor";

// STYLE
import {
  Box,
  Card,
  CardBody,
  Divider,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";

const DoctorPatients = () => {
  const [consultations, setConsultations] = useState([]);
  const user = useSelector((state) => state.user.loggedInUser);

  const fetchData = async () => {
    if (user) {
      const consultationsData = (await getDoctorConsultations(user?._id)).data;
      setConsultations(consultationsData);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const uniquePatients = consultations?.filter(
    (obj, index, self) =>
      index === self.findIndex((o) => o.patientId === obj.patientId)
  );

  return (
    <Box mx={6} mt={5}>
      {!uniquePatients?.length && <Text>Vous n'avez pas de patients</Text>}
      <SimpleGrid color="white" columns={4} gap={4}>
        {uniquePatients?.map((patient, index) => {
          return (
            <Card key={index}>
              <CardBody>
                <Stack>
                  <Heading size="md">
                    {patient.firstName} {patient.lastName}
                  </Heading>
                  <Text>
                    <strong>Téléphone: </strong>
                    {patient.phone}
                  </Text>
                  <Text>
                    <strong>age: </strong>
                    {patient.age}
                  </Text>
                  <Text>
                    <strong>Créer le: </strong>
                    {patient.createdAt}
                  </Text>
                </Stack>
              </CardBody>
              <Divider />
            </Card>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default DoctorPatients;
