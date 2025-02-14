// HOOKS
import { useNavigate } from "react-router-dom";

// FUNCTIONS
import { getDoctorPatientsCount } from "@/modules/doctor/functions/doctor";

//COMPONENTS
import LoadingSpinner from "@/components/LoadingSpinner";

// STYLE
import { Flex, Image, Heading, Text, Button, Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";

// ASSETS
import { FaRegHospital } from "react-icons/fa";
import { IoPeopleOutline } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  const {
    photo,
    firstName = "first name",
    lastName = "last name",
    price = 0,
    hospital = "hospital",
    id,
  } = doctor;

  const getPatientCount = async (doctorID) => {
    if (doctorID) {
      const response = (await getDoctorPatientsCount(id)).data.patientsCount;
      return response
    }
  };

  //Query Invoked Using useQuery
  const { data: patientsCount, isPending} = useQuery({
    queryKey : ['patientCount', id],
    queryFn : () => getPatientCount(id)
  })

  return (
    <Flex
      bg="#fff"
      w="340px"
      direction="column"
      justifyContent="space-between"
      borderRadius={6}
      shadow="xl"
    >
      <Flex
        cursor="pointer"
        onClick={() => navigate(`/patient/doctors/${doctor.id}`)}
      >
        <motion.div
          whileHover={{
            y: -10,
          }}
          style={{
            zIndex: 1,
          }}
        >
          <Image
            borderTopRadius={6}
            src={photo}
            alt="profile image"
            w="340px"
            h="380px"
          />
        </motion.div>
      </Flex>

      <Flex direction="column" justifyContent="space-around" gap={2} py={4}>
        <Heading textAlign="center" fontSize="lg">
          {firstName} {lastName}
        </Heading>
        <Flex justifyContent="center" alignItems="center" gap={2}>
          <Icon as={FaRegHospital} color="gray" />
          <Text color="gray">{hospital}</Text>
        </Flex>
        <Flex justifyContent="center" alignItems="center" gap={2}>
          <Icon as={IoPeopleOutline} color="gray" />
          <Text fontWeight="bolder" color="#000">
            {isPending ? <LoadingSpinner size='small'/> : patientsCount}
          </Text>
          <Text color="gray">Patients</Text>
        </Flex>

        <Flex justifyContent="space-evenly" alignItems="center">
          <Text color="primary.500" fontWeight="bold" fontSize="large">
            {price}.00dt
          </Text>
          <Button
            size="sm"
            variant="solid"
            colorScheme="primary"
            isDisabled={doctor?.quantity < 1}
            onClick={() => navigate(`/patient/consultation/${doctor.id}`)}
            _hover={{
              opacity: 0.8,
            }}
          >
            Book
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default DoctorCard;
