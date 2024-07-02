import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Divider,
  Flex,
  Heading,
  Icon,
  Image,
  SimpleGrid,
  Square,
  Stack,
  Text,
  IconButton,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { IoMdPerson } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Avatar1 from "../../images/avatars/1.jpg";
import Avatar2 from "../../images/avatars/2.jpg";
import Avatar3 from "../../images/avatars/3.jpg";
import Avatar4 from "../../images/avatars/4.jpg";
import Avatar5 from "../../images/avatars/5.jpg";
import Avatar6 from "../../images/avatars/6.jpg";
import Avatar7 from "../../images/avatars/8.jpg";

function PatientList() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Noah Sinclair",
      avatar: Avatar1,
      phone: "554",
      age: "35",
      lastConsultation: "05/12/2024",
    },
    {
      id: 1,
      name: "Mohamed Amine",
      avatar: Avatar2,
      phone: "546",
      age: "22",
      lastConsultation: "09/12/2024",
    },
    {
      id: 1,
      name: "Jameson Rivers",
      avatar: Avatar3,
      phone: "985",
      age: "45",
      lastConsultation: "05/08/2024",
    },
    {
      id: 1,
      name: "Charlotte Davenport",
      avatar: Avatar4,
      phone: "745",
      age: "32",
      lastConsultation: "09/03/2024",
    },
    {
      id: 1,
      name: "Amelia Prescott",
      avatar: Avatar5,
      phone: "312",
      age: "19",
      lastConsultation: "05/05/2024",
    },
    {
      id: 1,
      name: "Lucas Montgomery",
      avatar: Avatar6,
      phone: "465",
      age: "26",
      lastConsultation: "05/02/2024",
    },
    {
      id: 1,
      name: "Benjamin Hawthorne",
      avatar: Avatar7,
      phone: "978",
      age: "27",
      lastConsultation: "05/07/2024",
    },
  ]);
  return (
    <Box mx={6} mt={5}>
      <Card flex="1">
        <CardBody>
          <Flex justifyContent="space-between">
            <Flex alignItems="center" gap={4}>
              <Flex>
                <Avatar
                  size="xl"
                  name="Segun Adebayo"
                  src="https://bit.ly/sage-adebayo"
                />
              </Flex>
              <Flex flexDirection="column" gap={3}>
                <Heading size="md">Bonjour, Dr Olivia Mercer</Heading>
                <Button
                  rightIcon={<ArrowForwardIcon />}
                  variant="link"
                  colorScheme="primary"
                  fontWeight="normal"
                >
                  Affichez un résumé de tous vos clients au cours du mois
                  dernier
                </Button>
              </Flex>
            </Flex>

            <Flex gap={4}>
              <IconButton icon={<IoMdSettings />} />
            </Flex>
          </Flex>
        </CardBody>
      </Card>
      <Flex my={4} color="white" gap={4}>
        <Card flex="1">
          <CardBody>
            <Text fontSize="2xl" as="b">
              Moyen des Consultation
            </Text>
            <Center>
              <Flex alignItems={"center"} justifyContent={"center"} gap={4}>
                <Flex alignItems={"center"} justifyContent={"center"} gap={4}>
                  <Text>5 Consultation par jour</Text>
                  <Icon as={ArrowForwardIcon} mr={2} />
                </Flex>
              </Flex>
            </Center>
          </CardBody>
        </Card>
        <Card flex="1">
          <CardBody>
            <Text fontSize="2xl" as="b">
              Nombre total des patiens
            </Text>
            <Center>
              <Flex alignItems={"center"} justifyContent={"center"} gap={4}>
                <Flex alignItems={"center"} justifyContent={"center"} gap={4}>
                  <Text>120 Patietns</Text>
                  <Icon as={ArrowForwardIcon} mr={2} />
                </Flex>
              </Flex>
            </Center>
          </CardBody>
        </Card>
        <Card flex="1">
          <CardBody>
            <Text fontSize="2xl" as="b">
              Nombre total des Rendez-vous
            </Text>
            <Center>
              <Flex alignItems={"center"} justifyContent={"center"} gap={4}>
                <Flex alignItems={"center"} justifyContent={"center"} gap={4}>
                  <Text>50 rendez-vous</Text>
                  <Icon as={ArrowForwardIcon} mr={2} />
                </Flex>
              </Flex>
            </Center>
          </CardBody>
        </Card>
      </Flex>
      <SimpleGrid color="white" columns={4} gap={4}>
        {patients.map((patient) => {
          return (
            <Card flex={1} maxW="sm">
              <CardBody>
                <Image h="280px" src={patient.avatar} borderRadius="lg" />
                <Stack mt="6" spacing="3">
                  <Heading size="md">{patient.name}</Heading>
                  <Text>Numero : {patient.phone}</Text>
                  <Text>age : {patient.age}</Text>
                  <Text>
                    derniere consultation : {patient.lastConsultation}
                  </Text>
                </Stack>
              </CardBody>
              <Divider />
              <CardFooter>
                <Flex className="float-end" justify={"flex-end"} spacing="2">
                  <Button
                    onClick={() => navigate(`/doctor/patientDetails`)}
                    variant="solid"
                    colorScheme="blue"
                    size="sm"
                  >
                    Voir plus <Icon as={ArrowForwardIcon} mr={2} />
                  </Button>
                </Flex>
              </CardFooter>
            </Card>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}

export default PatientList;
