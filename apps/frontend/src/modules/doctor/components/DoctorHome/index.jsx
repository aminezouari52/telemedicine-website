// HOOKS
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// FUNCTIONS
import { getDoctorPatientsCount } from "@/modules/doctor/functions/doctor";
import { getDoctorConsultations } from "@/modules/consultation/functions/consultation";

// STYLE
import { Box, Button, Flex, Avatar, Heading } from "@chakra-ui/react";

// ASSETS
import { ArrowForwardIcon } from "@chakra-ui/icons";
import DoctorAvatar from "@/images/avatar-doctor.jpg";
import StatisticsBox from "./StatisticsBox";

const DoctorHome = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState();
  const [consultations, setConsultations] = useState([]);
  const user = useSelector((state) => state.userReducer.user);

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
    <Box p={10}>
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
      <Flex my={4} color="white" gap={4}>
        <StatisticsBox
          title="Consultations ce mois"
          number={consultationsThisMonth()?.length}
          icon={undefined}
        />
        <StatisticsBox
          title="Consultations en attente"
          number={undefined}
          icon={undefined}
        />
        <StatisticsBox
          title="Nouveau consultations"
          number={undefined}
          icon={undefined}
        />
        <StatisticsBox
          title="Nombre total des patiens"
          number={doctor?.patientsCount}
          icon={undefined}
        />
        <StatisticsBox
          title="Nombre total des Consultations"
          number={consultations?.length}
          icon={undefined}
        />
      </Flex>
    </Box>
  );
};

export default DoctorHome;
