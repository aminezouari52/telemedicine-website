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
import { getPatientConsultations } from "@/modules/consultation/functions/consultation";
import { DateTime } from "luxon";

// ASSETS
import { CalendarIcon } from "@chakra-ui/icons";
import { FaMapPin } from "react-icons/fa";

const PatientConsultations = () => {
  const user = useSelector((state) => state.userReducer.user);
  const [consultations, setConsultations] = useState([]);

  const loadConsultations = async () => {
    const consultationsData = (await getPatientConsultations(user?._id)).data;
    setConsultations(consultationsData.filter((c) => c.status === "pending"));
  };

  useEffect(() => {
    if (user) {
      loadConsultations();
    }
  }, [user]);

  const sortedUpcomingConsultations = () => {
    return consultations?.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  return (
    <Flex justifyContent="space-around" p={12}>
      <Box w="40%">
        <Flex gap={4} mb={6} alignItems="center" justifyContent="space-between">
          <Heading size="md">Consultations à venir</Heading>
        </Flex>
        {sortedUpcomingConsultations()?.length < 1 && (
          <Text>Vous n'avez encore de consultations</Text>
        )}
        <Flex direction="column" gap={6}>
          {sortedUpcomingConsultations()?.map((consultation) => (
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
                    <Text color="gray">{consultation?.doctor?.specialty}</Text>
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
          <Heading size="md">Profil</Heading>
        </Flex>
        {sortedUpcomingConsultations()?.length > 0 && (
          <Card>
            <CardBody>
              <Flex justifyContent="space-between" pb={4} gap={4}>
                <Flex flexDirection="column" gap={2}>
                  <Text fontWeight="bold">
                    {sortedUpcomingConsultations()[0]?.patient?.firstName}{" "}
                    {sortedUpcomingConsultations()[0]?.patient?.lastName}
                  </Text>
                  <Flex alignItems="center" gap={2}>
                    <Icon as={FaMapPin} color="red.500" />
                    <Text>
                      {sortedUpcomingConsultations()[0]?.patient?.address}
                    </Text>
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
                    {sortedUpcomingConsultations()[0]?.patient?.phone}
                  </ListItem>
                  <ListItem>
                    <strong>Age:</strong>{" "}
                    {sortedUpcomingConsultations()[0]?.patient?.age}
                  </ListItem>
                  <ListItem>
                    <strong>Poids: </strong>
                    {sortedUpcomingConsultations()[0]?.patient?.weight}kg
                  </ListItem>
                </UnorderedList>
              </Box>
            </CardBody>
          </Card>
        )}
      </Box>
    </Flex>
  );
};

export default PatientConsultations;
