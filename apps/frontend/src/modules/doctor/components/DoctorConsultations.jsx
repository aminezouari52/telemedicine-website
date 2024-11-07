// HOOKS
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

// FUNCTIONS
import { getDoctorConsultations } from "@/modules/doctor/functions/doctor";
import { DateTime } from "luxon";

// STYLE
import {
  Box,
  Button,
  Heading,
  ListItem,
  Card,
  CardBody,
  Flex,
  Text,
  Icon,
  Divider,
  UnorderedList,
  Stack,
} from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";
import { FaMapPin } from "react-icons/fa";

// ASSETS
import { PhoneIcon } from "@chakra-ui/icons";
import { FaWeight } from "react-icons/fa";

const DoctorConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const user = useSelector((state) => state.user.loggedInUser);

  const loadConsultations = async () => {
    if (user) {
      const consultationsData = (await getDoctorConsultations(user?._id)).data;
      setConsultations(consultationsData);
    }
  };

  useEffect(() => {
    loadConsultations();
  }, [user]);

  const sortedUpcomingConsultations = () => {
    return consultations?.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  };

  return (
    <Flex justifyContent="space-around" p={12}>
      <Box w="40%">
        <Flex alignItems="center" justifyContent="space-between" py={5}>
          <Heading size="md">Consultations à venir</Heading>
          <Button size="xs" colorScheme="secondary" _hover={{ opacity: "0.5" }}>
            Voir tous
          </Button>
        </Flex>
        {!sortedUpcomingConsultations()?.length && (
          <div>vous n'avez pas de consultations</div>
        )}

        <Stack spacing={6}>
          {sortedUpcomingConsultations()
            ?.slice(0, 2)
            .map((consultation) => (
              <Card key={consultation?._id}>
                <Stack>
                  <Stack flexDirection="column" p={4}>
                    <Text fontWeight="bold">
                      {consultation?.firstName} {consultation?.lastName}
                    </Text>
                    <Flex gap={2} alignItems="center">
                      <Icon as={PhoneIcon} color="gray.500" />
                      <Text color="gray.500">{consultation?.phone}</Text>
                    </Flex>
                    <Flex gap={2} alignItems="center">
                      <Icon as={FaWeight} color="gray.500" />
                      <Text>{consultation?.weight}kg</Text>
                    </Flex>
                  </Stack>
                  <Divider borderColor="gray.300" />
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    p={4}
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

                    <Button
                      size="xs"
                      color="#fff"
                      bg="secondary.500"
                      variant="solid"
                      rightIcon={<CalendarIcon />}
                      _hover={{
                        opacity: 0.8,
                      }}
                    >
                      replanifier
                    </Button>
                  </Flex>
                </Stack>
              </Card>
            ))}
        </Stack>
      </Box>

      <Box w="50%">
        <Flex alignItems="center" justifyContent="space-between" py={5}>
          <Heading size="md">Prôchaine consultation</Heading>
          <Button size="xs" colorScheme="secondary" _hover={{ opacity: "0.5" }}>
            Voir Details
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
                    <Text>{sortedUpcomingConsultations()[0]?.date}</Text>
                  </Flex>
                  <Flex>
                    <Text mr={2} color="gray">
                      Heure:{" "}
                    </Text>
                    <Text>{sortedUpcomingConsultations()[0]?.time}</Text>
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

export default DoctorConsultations;
