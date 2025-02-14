// HOOKS
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// FUNCTIONS
import { getDoctorPatientsCount } from "@/modules/doctor/functions/doctor";
import { getDoctorConsultations } from "@/modules/consultation/functions/consultation";
import { consultationsMonthlyGrowth } from "@/utils";

// COMPONENTS
import LoadingSpinner from "@/components/LoadingSpinner";
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
import DoctorAvatar from "@/assets/avatar-doctor.jpg";
import { useQuery } from "@tanstack/react-query";

const DoctorHome = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.userReducer.user);

  const getConsultationsQuery = async () => {
    const consultationsData = (await getDoctorConsultations(user?._id)).data;
    return consultationsData
  };

  const getPatientsCountQuery = async () => {
    const patientsCount = (await getDoctorPatientsCount(user._id)).data
      .patientsCount;
    return patientsCount
  };

  //Query Invoked Using useQuery
  const {data, isPending, isError, error} = useQuery({
    queryKey : ['doctor', 'consultations'],
    queryFn : async() => {
      const consultations = await getConsultationsQuery()
      const patientsCount = await getPatientsCountQuery()
      return {doctor : {...user, patientsCount}, consultations}
    }
  })

  if(isPending){
    return <Flex direction='row' justifyContent='center' marginTop={10}><LoadingSpinner/></Flex>
  }

  if(isError){
    return <Flex direction='row' justifyContent='center' marginTop={10}>Error : {error.message}</Flex>
  }

  return (
    <Flex direction="column" gap={10} py={6} px={12}>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center" gap={4}>
          <Avatar size="lg" src={data.doctor?.photo || DoctorAvatar} />
          <Flex flexDirection="column" gap={3}>
            <Heading size="md">Hello, Dr {data.doctor?.firstName}!</Heading>
            {!user?.isProfileCompleted && (
              <Button
                rightIcon={<ArrowForwardIcon />}
                variant="link"
                colorScheme="primary"
                fontWeight="normal"
                onClick={() => navigate("/doctor/profile")}
              >
                complete your profile
              </Button>
            )}
          </Flex>
        </Flex>
        <Box>
          <Stat>
            <StatLabel>Monthly growth</StatLabel>
            <StatNumber>{data.consultations?.length}</StatNumber>
            <StatHelpText>
              <StatArrow
                type={
                  consultationsMonthlyGrowth(data.consultations) < 0
                    ? "decrease"
                    : "increase"
                }
              />{" "}
              {consultationsMonthlyGrowth(data.consultations) < 0 ? "" : "+"}
              {consultationsMonthlyGrowth(data.consultations)}%
            </StatHelpText>
          </Stat>
        </Box>
      </Flex>
      <Statistics doctor={data.doctor} consultations={data.consultations}/>
      <ConsultationsTable consultations={data.consultations} />
    </Flex>
  );
};

export default DoctorHome;
