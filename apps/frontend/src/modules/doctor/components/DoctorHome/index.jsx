// HOOKS
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// FUNCTIONS
import { getDoctorPatientsCount } from "@/modules/doctor/functions/doctor";
import { getDoctorConsultations } from "@/modules/consultation/functions/consultation";
import { consultationsMonthlyGrowth } from "@/utils";

// COMPONENTS
import Statistics from "./Statistics";
import ConsultationsTable from "./ConsultationsTable";

// STYLE
import {
  Box,
  Button,
  Flex,
  Avatar,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from "@chakra-ui/react";

// ASSETS
import { ArrowForwardIcon } from "@chakra-ui/icons";
import DoctorAvatar from "@/images/avatar-doctor.jpg";

const DoctorHome = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState();
  const [consultations, setConsultations] = useState([]);
  const user = useSelector((state) => state.userReducer.user);

  const loadConsultations = async () => {
    const consultationsData = (await getDoctorConsultations(user?._id)).data;
    setConsultations(consultationsData);
  };

  const loadDoctor = async () => {
    const patientsCount = (await getDoctorPatientsCount(user._id)).data
      .patientsCount;
    setDoctor({ ...user, patientsCount });
  };

  useEffect(() => {
    if (user) {
      loadDoctor(user);
      loadConsultations(user);
    }
  }, [user]);

  return (
    <Flex direction="column" gap={10} p={10}>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center" gap={4}>
          <Avatar size="lg" src={doctor?.photo || DoctorAvatar} />
          <Flex flexDirection="column" gap={3}>
            <Heading size="md">Salut, Dr {doctor?.firstName}</Heading>
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
        <Box>
          <Stat>
            <StatLabel>Croissance mensuelle</StatLabel>
            <StatNumber>{consultations?.length}</StatNumber>
            <StatHelpText>
              <StatArrow
                type={
                  consultationsMonthlyGrowth(consultations) < 0
                    ? "decrease"
                    : "increase"
                }
              />{" "}
              {consultationsMonthlyGrowth(consultations) < 0 ? "" : "+"}
              {consultationsMonthlyGrowth(consultations)}%
            </StatHelpText>
          </Stat>
        </Box>
      </Flex>

      <Statistics />

      <ConsultationsTable consultations={consultations} />
    </Flex>
  );
};

export default DoctorHome;
