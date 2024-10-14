// HOOKS
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// FUNCTIONS
import {
  getDoctorById,
  getDoctorPatientsCount,
  getDoctorConsultations,
} from "@/modules/doctor/functions/doctor";

// STYLE
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";

// ASSETS
import { ArrowForwardIcon } from "@chakra-ui/icons";

const DoctorHome = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState();
  const [consultations, setConsultations] = useState([]);
  const user = useSelector((state) => state.user.loggedInUser);

  const consultationsThisMonth = () => {
    return consultations?.filter((consultation) => {
      const date = new Date(consultation.createdAt);
      const now = new Date();
      return (
        consultation.status === "completed" &&
        date.getMonth() === now.getMonth()
      );
    });
  };

  const fetchData = async () => {
    if (user) {
      const doctorData = (await getDoctorById(user._id)).data;
      const consultationsData = (await getDoctorConsultations(user?._id)).data;
      const patientsCount = (await getDoctorPatientsCount(user._id)).data
        .patientsCount;
      setDoctor({ ...doctorData, patientsCount });
      setConsultations(consultationsData);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <Box p={10}>
      <Flex alignItems="center" gap={4}>
        <Avatar size="lg" src="https://bit.ly/broken-link" />
        <Flex flexDirection="column" gap={3}>
          <Heading size="md">Bonjour, Dr {doctor?.firstName}</Heading>
          {!user?.isProfileCompleted && (
            <Button
              rightIcon={<ArrowForwardIcon />}
              variant="link"
              colorScheme="primary"
              fontWeight="normal"
              onClick={() => navigate("/doctor/profile")}
            >
              complètez votre compte
            </Button>
          )}
        </Flex>
      </Flex>
      <Flex my={4} color="white" gap={4}>
        <Card>
          <CardBody>
            <Text fontSize="2xl" fontWeight="bold">
              Consultations ce mois
            </Text>
            <Text textAlign="center" p={4}>
              {consultationsThisMonth()?.length} Consultations
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="2xl" fontWeight="bold">
              Nombre total des patiens
            </Text>
            <Text textAlign="center" p={4}>
              {doctor?.patientsCount} Patietns
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Text fontSize="2xl" fontWeight="bold">
              Nombre total des Consultations
            </Text>
            <Text textAlign="center" p={4}>
              {consultations?.length} consultations
            </Text>
          </CardBody>
        </Card>
      </Flex>
    </Box>
  );
};

export default DoctorHome;
