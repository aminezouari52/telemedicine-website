// HOOKS
import { useEffect, useState } from "react";

// STYLE
import {
  Box,
  Button,
  Heading,
  ListItem,
  Card,
  CardBody,
  Flex,
  Avatar,
  Text,
  Icon,
  CardFooter,
  Divider,
  UnorderedList,
} from "@chakra-ui/react";

// FUNCTIONS
import { useSelector } from "react-redux";
import { getPatientConsultations } from "@/modules/patient/functions/patient";
import { DateTime } from "luxon";

// ASSETS
import { CalendarIcon } from "@chakra-ui/icons";
import { FaMapPin } from "react-icons/fa";

const PatientConsultations = () => {
  const user = useSelector((state) => state.user.loggedInUser);
  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    const getPatientConsultationsFunction = async () => {
      const response = await getPatientConsultations(user?._id);
      setConsultations(response.data);
    };
    getPatientConsultationsFunction();
  }, []);

  const sortedUpcomingConsultations = () => {
    return consultations?.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  return (
    <Flex justifyContent="space-around" p={12}>
      <Box w="40%">
        <Flex gap={4} mb={6} alignItems="center" justifyContent="space-between">
          <Heading size="md">Consultations à venir</Heading>
          <Button size="xs" colorScheme="secondary" _hover={{ opacity: "0.5" }}>
            Voir tous
          </Button>
        </Flex>
        <Flex direction="column" gap={6}>
          {sortedUpcomingConsultations()
            ?.slice(0, 2)
            ?.map((consultation) => (
              <Card key={consultation._id}>
                <CardBody>
                  <Flex p={4} gap={4}>
                    <Avatar
                      size="lg"
                      name="Segun Adebayo"
                      src={consultation?.doctor?.photo}
                    />
                    <Flex flexDirection="column">
                      <Text fontWeight="bold">
                        Dr. {consultation?.doctor?.firstName}{" "}
                        {consultation?.doctor?.lastName}
                      </Text>
                      <Text color="gray">
                        {consultation?.doctor?.specialty}
                      </Text>
                      <Flex gap={2}>
                        <Icon as={FaMapPin} color="red.500" />
                        <Text>{consultation?.doctor?.hospital}</Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </CardBody>
                <Divider borderColor="gray" />
                <CardFooter>
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    w="100%"
                  >
                    <Flex alignItems="center" gap="10px">
                      <Icon as={CalendarIcon} color="gray.500" />
                      <Flex fontSize="12px" flexDirection="column">
                        <Text color="gray">Votre consultation</Text>
                        <Text>
                          le{" "}
                          {consultation?.date
                            ? DateTime.fromJSDate(
                                new Date(consultation.date)
                              ).toFormat("dd-MM-yyyy 'à' HH:mm")
                            : null}
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </CardFooter>
              </Card>
            ))}
        </Flex>
      </Box>

      <Box w="50%">
        <Flex gap={4} mb={6} alignItems="center" justifyContent="space-between">
          <Heading size="md">Dossier médical</Heading>
          <Button size="xs" colorScheme="secondary" _hover={{ opacity: "0.5" }}>
            Voir details
          </Button>
        </Flex>
        <Card>
          <CardBody>
            <Flex justifyContent="space-between" pb={4} gap={4}>
              <Flex flexDirection="column" gap={2}>
                <Text fontWeight="bold">
                  {sortedUpcomingConsultations()[0]?.firstName}{" "}
                  {sortedUpcomingConsultations()[0]?.lastName}
                </Text>
                <Flex alignItems="center" gap={2}>
                  <Icon as={FaMapPin} color="red.500" />
                  <Text>{sortedUpcomingConsultations()[0]?.address}</Text>
                </Flex>
              </Flex>
              <Divider ml={6} orientation="vertical" />
              <Flex alignItems="center" gap="20px">
                <Flex fontSize="12px" flexDirection="column">
                  <Flex>
                    <Text mr={2} color="gray">
                      Date:{" "}
                    </Text>
                    <Text>
                      {DateTime.fromJSDate(
                        new Date(sortedUpcomingConsultations()[0]?.date)
                      ).toFormat("dd-MM-yyyy")}
                    </Text>
                  </Flex>
                  <Flex>
                    <Text mr={2} color="gray">
                      Heure:{" "}
                    </Text>
                    <Text>
                      {DateTime.fromJSDate(
                        new Date(sortedUpcomingConsultations()[0]?.date)
                      ).toFormat("HH:mm")}
                    </Text>
                  </Flex>
                </Flex>
                <Icon as={CalendarIcon} color="gray.500" />
              </Flex>
            </Flex>
            <Box>
              <Text color="gray" fontWeight="bold">
                Details
              </Text>
              <UnorderedList fontSize="smaller" p={2}>
                <ListItem>
                  <strong>Téléphone:</strong>{" "}
                  {sortedUpcomingConsultations()[0]?.phone}
                </ListItem>
                <ListItem>
                  <strong>Age:</strong> {sortedUpcomingConsultations()[0]?.age}
                </ListItem>
                <ListItem>
                  <strong>Poids: </strong>
                  {sortedUpcomingConsultations()[0]?.weight}kg
                </ListItem>
              </UnorderedList>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </Flex>
  );
};

export default PatientConsultations;
