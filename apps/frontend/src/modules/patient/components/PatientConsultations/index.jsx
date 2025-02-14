// HOOKS
import { useDisclosure } from "@chakra-ui/react";

import AllConsultationsModal from "./AllConsultationsModal";

// STYLE
import {
  Box,
  Heading,
  ListItem,
  Card,
  CardBody,
  Flex,
  Avatar,
  Text,
  Icon,
  Button,
  CardFooter,
  Divider,
  UnorderedList,
  Alert,
  CloseButton,
} from "@chakra-ui/react";

// FUNCTIONS
import { useSelector } from "react-redux";
import { getPatientConsultations } from "@/modules/consultation/functions/consultation";
import { DateTime } from "luxon";

//COMPONENTS
import LoadingSpinner from "@/components/LoadingSpinner";

// ASSETS
import { CalendarIcon, InfoIcon } from "@chakra-ui/icons";
import { FaMapPin } from "react-icons/fa";
import DoctorAvatar from "@/assets/avatar-doctor.jpg";
import PatientAvatar from "@/assets/avatar-patient.png";
import { useQuery } from "@tanstack/react-query";

const PatientConsultations = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenAlert, onClose: onCloseAlert } = useDisclosure({
    defaultIsOpen: true,
  });
  const user = useSelector((state) => state.userReducer.user);

  const getPatientConsultationsQuery = async () => {
    const consultationsData = (await getPatientConsultations(user?._id)).data;
    return consultationsData.filter((c) => c.status === "pending");
  };

//Query Invoked Using useQuery
const { data: consultations, isPending, isError, error} = useQuery({
  queryKey : ['consultations'],
  queryFn : () => getPatientConsultationsQuery()
})
  
  const sortedUpcomingConsultations = () => {
    return consultations?.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  if(isPending){
    return <Flex direction='row' justifyContent='center' marginTop={10}><LoadingSpinner/></Flex>
  }

  if(isError){
    return <Flex direction='row' justifyContent='center' marginTop={10}>Error : {error.message}</Flex>
  }

  return (
    <>
      <AllConsultationsModal
        consultations={consultations}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Flex direction="column">
        {isOpenAlert && (
          <Flex justifyContent="flex-end">
            <Alert
              status="info"
              w="489px"
              justifyContent="space-between"
              borderRadius="md"
              shadow="md"
              m={2}
            >
              <InfoIcon color="primary.500" />
              <Box>we check every two minutes for new consultations</Box>
              <CloseButton
                alignSelf="flex-start"
                position="relative"
                size="sm"
                onClick={onCloseAlert}
              />
            </Alert>
          </Flex>
        )}

        <Flex justifyContent="space-around" py={6} px={12}>
          <Flex w="40%" direction="column" gap={6}>
            <Flex alignItems="center" justifyContent="space-between">
              <Heading size="md">Upcoming consultations</Heading>
              {consultations?.length > 2 && (
                <Button
                  size="xs"
                  colorScheme="secondary"
                  _hover={{ opacity: "0.8" }}
                  onClick={onOpen}
                >
                  See all
                </Button>
              )}
            </Flex>
            {sortedUpcomingConsultations()?.length < 1 && (
              <Text>You still have no consultations</Text>
            )}
            {sortedUpcomingConsultations()
              ?.slice(0, 2)
              ?.map((consultation) => (
                <Card key={consultation._id}>
                  <CardBody>
                    <Flex p={4} gap={4}>
                      <Avatar
                        size="lg"
                        name="Doctor"
                        src={consultation?.doctor?.photo || DoctorAvatar}
                      />
                      <Flex flexDirection="column">
                        <Text fontWeight="bold">
                          Dr. {consultation?.doctor?.firstName}{" "}
                          {consultation?.doctor?.lastName}
                        </Text>
                        <Text color="gray">
                          {consultation?.doctor?.specialty}
                        </Text>
                        <Flex gap={2} alignItems="center">
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
                          <Text color="gray">Your consultation</Text>
                          <Text>
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
          <Flex w="50%" direction="column" gap={6}>
            <Heading size="md">Profile</Heading>
            {sortedUpcomingConsultations()?.length > 0 && (
              <Card>
                <CardBody>
                  <Flex justifyContent="space-between" pb={4} gap={4}>
                    <Flex flexDirection="column" gap={2}>
                      <Flex alignItems="center" gap={2}>
                        <Avatar name="Patient" src={PatientAvatar} />
                        <Text fontWeight="bold">
                          {sortedUpcomingConsultations()[0]?.patient?.firstName}{" "}
                          {sortedUpcomingConsultations()[0]?.patient?.lastName}
                        </Text>
                      </Flex>
                      <Text fontWeight="bold"></Text>
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
                            Time:{" "}
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
                        <strong>Phone:</strong>{" "}
                        {sortedUpcomingConsultations()[0]?.patient?.phone}
                      </ListItem>
                      <ListItem>
                        <strong>Age:</strong>{" "}
                        {sortedUpcomingConsultations()[0]?.patient?.age}
                      </ListItem>
                      <ListItem>
                        <strong>Weight: </strong>
                        {sortedUpcomingConsultations()[0]?.patient?.weight}kg
                      </ListItem>
                    </UnorderedList>
                  </Box>
                </CardBody>
              </Card>
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default PatientConsultations;
