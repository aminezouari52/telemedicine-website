// HOOKS
import { useSelector } from "react-redux";
import { useDisclosure } from "@chakra-ui/react";

// COMPONENTS
import AllConsultationsModal from "./AllConsultationsModal";
import ConsultationCard from "./ConsultationCard";

// FUNCTIONS
import { getDoctorConsultations } from "@/modules/consultation/functions/consultation";
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
  Alert,
  Stack,
  CloseButton,
} from "@chakra-ui/react";

// ASSETS
import { CalendarIcon, InfoIcon } from "@chakra-ui/icons";
import { FaMapPin } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

//COMPONENTS
import LoadingSpinner from "@/components/LoadingSpinner";

const DoctorConsultations = () => {
  const { isOpen: isOpenAlert, onClose: onCloseAlert } = useDisclosure({
    defaultIsOpen: true,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useSelector((state) => state.userReducer.user);

  const getDoctorConsultationsQuery = async () => {
    const consultationsData = (await getDoctorConsultations(user?._id)).data;
    return consultationsData.filter((c) => c.status === "pending");
  };

  //Query Invoked Using useQuery
const { data: consultations, isPending, isError, error} = useQuery({
  queryKey : ['consultations'],
  queryFn : () => getDoctorConsultationsQuery()
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
          <Box w="40%">
            <Flex alignItems="center" justifyContent="space-between" py={5}>
              <Box>
                <Heading size="md">Upcoming consultations</Heading>
              </Box>
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
            {!sortedUpcomingConsultations()?.length && (
              <div>You don't have any consultations</div>
            )}

            <Stack spacing={6}>
              {sortedUpcomingConsultations()
                ?.slice(0, 2)
                .map((consultation, index) => (
                  <ConsultationCard key={index} consultation={consultation} />
                ))}
            </Stack>
          </Box>

          <Box w="50%">
            {sortedUpcomingConsultations()?.length !== 0 && (
              <>
                <Flex alignItems="center" justifyContent="space-between" py={5}>
                  <Heading size="md">Next consultation</Heading>
                </Flex>
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
              </>
            )}
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default DoctorConsultations;
