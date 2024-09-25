// HOOKS
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// FUNCTIONS
import { getDoctorById } from "@/modules/doctor/functions/doctor";

// STYLE
import {
  Button,
  Flex,
  Heading,
  Image,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";

function DoctorDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState();

  const getDoctorByIdFunction = async () => {
    const response = await getDoctorById(params.id);
    setDoctor(response.data);
  };

  useEffect(() => {
    getDoctorByIdFunction();
  }, []);

  return (
    <Flex>
      <Flex direction="column" w="35%" p={5} bg="#fff" gap={6}>
        <Image
          src={doctor?.photo}
          alt="doctor-image"
          borderRadius="lg"
          maxHeight="400px"
        />
        <Flex direction="column" gap={2}>
          <Flex direction="column">
            <Heading size="lg">
              Dr, {doctor?.firstName} {doctor?.lastName}
            </Heading>
            <Text fontWeight="semibold" color="primary.500" fontSize="sm">
              {doctor?.specialty}
            </Text>
          </Flex>

          <Heading size="md"></Heading>
          <Text>{doctor?.description}</Text>
        </Flex>
      </Flex>
      <Flex p={10} w="65%" direction="column" gap={4}>
        <Flex>
          <Flex
            direction="column"
            p={6}
            bg="#fff"
            gap={5}
            borderTopLeftRadius="lg"
            w="100%"
          >
            <Flex direction="column" gap={2}>
              <Heading size="sm">Téléphone</Heading>
              <Text>{doctor?.phone}</Text>
            </Flex>
            <Flex direction="column" gap={2}>
              <Heading size="sm">Email</Heading>
              <Text>{doctor?.email}</Text>
            </Flex>

            <Flex direction="column" gap={2}>
              <Heading size="sm">Certifications</Heading>
              <UnorderedList>
                {doctor?.certifications?.map((certification, index) => (
                  <ListItem key={index}>{certification}</ListItem>
                ))}
              </UnorderedList>
            </Flex>
            <Flex direction="column" gap={2}>
              <Heading size="sm">Diplôme</Heading>
              <UnorderedList>
                {doctor?.degrees?.map((degree, index) => (
                  <ListItem key={index}>{degree}</ListItem>
                ))}
              </UnorderedList>
            </Flex>
            <Flex direction="column" gap={2}>
              <Heading size="sm">Experience</Heading>
              <Text>{doctor?.experience}</Text>
            </Flex>
          </Flex>

          <Flex
            direction="column"
            p={6}
            bg="#fff"
            gap={5}
            borderTopRightRadius="lg"
            w="100%"
          >
            <Flex direction="column" gap={2}>
              <Heading size="sm">Hôpital</Heading>
              <Text>{doctor?.hospital}</Text>
            </Flex>
            <Flex direction="column" gap={2}>
              <Heading size="sm">Adresse</Heading>
              <Text>
                {doctor?.address}, {doctor?.city} {doctor?.zip}
              </Text>
            </Flex>
            <Flex direction="column" gap={2}>
              <Heading size="sm">Horaire</Heading>
              <Text>{doctor?.schedule.join(", ")}</Text>
            </Flex>
            <Flex direction="column" gap={2}>
              <Heading size="sm">Prix de consultation</Heading>
              <Text>{doctor?.price} dt/h</Text>
            </Flex>
          </Flex>
        </Flex>

        <Flex justifyContent="flex-end">
          <Button
            size="sm"
            colorScheme="primary"
            _hover={{
              opacity: "0.8",
            }}
            onClick={() => navigate(`/patient/consultation/${params.id}`)}
          >
            Prenez un rendez-vous
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default DoctorDetails;
