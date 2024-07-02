import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  Heading,
  List,
  ListItem,
  ListIcon,
  Card,
  CardHeader,
  CardBody,
  Center,
  Flex,
  Avatar,
  Text,
  Icon,
  CardFooter,
  Divider,
  UnorderedList,
} from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";
import { ArrowForwardIcon, CalendarIcon } from "@chakra-ui/icons";
import { FaMapPin } from "react-icons/fa";
import { CiPill } from "react-icons/ci";
import { CiViewList } from "react-icons/ci";
import Avatar1 from "../../images/avatars/1.jpg";
import Avatar2 from "../../images/avatars/2.jpg";

const Consultations = () => {
  return (
    <Flex>
      <Card my={4} mx={8} w="40%">
        <CardHeader>
          <Flex gap={4} alignItems="center" justifyContent={"space-between"}>
            <Heading size="md">Consultations à venir</Heading>
            <Button size="sm" variant="ghost" color="primary.500">
              Voir tous
            </Button>
          </Flex>
        </CardHeader>
        <CardBody>
          <Card>
            <CardBody>
              <Flex bg="gray.50" p={4} gap={4}>
                <Avatar size="lg" name="Segun Adebayo" src={Avatar1} />
                <Flex flexDirection="column">
                  <Text fontWeight="bold">Dr. Mohamed Amine</Text>
                  <Text color="gray">Docteur de consultation générale</Text>
                  <Flex gap={2}>
                    <Icon as={FaMapPin} color="red.500" />
                    <Text>Hopital farhat hachett sousse </Text>
                  </Flex>
                </Flex>
              </Flex>
            </CardBody>
            <Divider borderColor="gray" />
            <CardFooter>
              <Flex justifyContent="space-between" alignItem="center" w="100%">
                <Flex alignItems="center" gap="10px">
                  <Icon as={CalendarIcon} color="gray.500" />
                  <Flex fontSize="12px" flexDirection="column">
                    <Text color="gray">Votre consultation</Text>
                    <Text>9h 23 Mai 2024</Text>
                  </Flex>
                </Flex>

                <Button
                  size="sm"
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
            </CardFooter>
          </Card>
          <Card>
            <CardBody>
              <Flex bg="gray.50" p={4} gap={4}>
                <Avatar size="lg" name="Segun Adebayo" src={Avatar2} />
                <Flex flexDirection="column">
                  <Text fontWeight="bold">Dr. Ahmed</Text>
                  <Text color="gray">Ophtalmologue</Text>
                  <Flex gap={2}>
                    <Icon as={FaMapPin} color="red.500" />
                    <Text>Hopital sahloul sousse </Text>
                  </Flex>
                </Flex>
              </Flex>
            </CardBody>
            <Divider borderColor="gray" />
            <CardFooter>
              <Flex justifyContent="space-between" alignItem="center" w="100%">
                <Flex alignItems="center" gap="10px">
                  <Icon as={CalendarIcon} color="gray.500" />
                  <Flex fontSize="12px" flexDirection="column">
                    <Text color="gray">Votre consultation</Text>
                    <Text>9h 31 Mai 2024</Text>
                  </Flex>
                </Flex>

                <Button
                  size="sm"
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
            </CardFooter>
          </Card>
        </CardBody>
      </Card>

      <Card p={4} m={4} gap={4} w="50%">
        <Flex alignItems="center" justifyContent="space-between">
          <Heading size="md">Dossier médical</Heading>
          <Button size="sm" variant="ghost" color="primary.500">
            Voir tous
          </Button>
        </Flex>
        <Flex bg="gray.50" justifyContent="space-between" p={4} gap={4}>
          <Avatar
            size="lg"
            name="Segun Adebayo"
            src="https://bit.ly/sage-adebayo"
          />
          <Flex flexDirection="column" gap={2}>
            <Text fontWeight="bold">John Doe</Text>
            <Flex gap={2}>
              <Icon as={FaMapPin} color="red.500" />
              <Text>Hopital sahloul sousse </Text>
            </Flex>
          </Flex>
          <Divider ml={6} borderColor="gray" orientation="vertical" />
          <Flex alignItems="center" gap="20px">
            <Flex fontSize="16px" flexDirection="column">
              <Flex>
                <Text mr={2} color="gray">
                  Date:{" "}
                </Text>
                <Text>23 Mai 2024</Text>
              </Flex>
              <Flex>
                <Text mr={2} color="gray">
                  Heure:{" "}
                </Text>
                <Text>9h30</Text>
              </Flex>
            </Flex>
            <Icon fontSize="xl" as={CalendarIcon} color="gray.500" />
          </Flex>
        </Flex>
        <Box>
          <Flex gap={2} alignItems="center">
            <Text color="gray" fontWeight="bold">
              Docteur
            </Text>
            <Text fontSize="smaller" fontWeight="bold">
              Dr. Mohamed Amine
            </Text>
          </Flex>
          <Text color="gray" fontWeight="bold">
            Diagnostic Principal
          </Text>
          <UnorderedList fontSize="smaller" p={2}>
            <ListItem>
              <strong>Stade:</strong> Stade 1
            </ListItem>
            <ListItem>
              <strong>Lecture de la Pression Artérielle:</strong> 145/90 mmHg
            </ListItem>
            <ListItem>
              <strong>Conditions Secondaires: </strong>Aucune
            </ListItem>
          </UnorderedList>
        </Box>
        <Box>
          <Flex alignItems="center" gap="10px">
            <Icon as={CiViewList} />
            <Text color="gray" fontWeight="bold">
              Résumé
            </Text>
          </Flex>
          <UnorderedList fontSize="smaller" p={2}>
            <ListItem>
              <strong>Condition:</strong> Le patient s'est présenté avec des
              symptômes d'hypertension artérielle et des étourdissements
              occasionnels.
            </ListItem>
            <ListItem>
              <strong>Plan de Traitement:</strong> Le médecin a conseillé au
              patient de suivre un régime pauvre en sodium, d'augmenter
              l'activité physique et de surveiller la pression artérielle
              quotidiennement.
            </ListItem>
            <ListItem>
              <strong>Conseils Donnés: </strong> Le médecin a recommandé de
              réduire le stress par des pratiques de pleine conscience et de
              garantir un sommeil adéquat.
            </ListItem>
          </UnorderedList>
        </Box>
        <Box>
          <Flex alignItems="center" gap="10px">
            <Icon as={CiPill} />
            <Text color="gray" fontWeight="bold">
              Médicament
            </Text>
          </Flex>
          <UnorderedList fontSize="smaller" p={2}>
            <ListItem>
              <strong>Nom:</strong> Lisinopril
            </ListItem>
            <ListItem>
              <strong>Dosage:</strong> 10 mg
            </ListItem>
            <ListItem>
              <strong>Fréquence: </strong> Une fois par jour
            </ListItem>
            <ListItem>
              <strong>Instructions: </strong> Prenez le médicament à la même
              heure chaque jour, avec ou sans nourriture.
            </ListItem>
          </UnorderedList>
        </Box>
      </Card>
    </Flex>
  );
};

export default Consultations;
