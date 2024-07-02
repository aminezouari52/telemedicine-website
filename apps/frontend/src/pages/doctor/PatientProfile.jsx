import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Center,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Image,
  Input,
  ListItem,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import React, { useState } from "react";
import { Form } from "react-router-dom";
import { FaMapPin } from "react-icons/fa";
import { ArrowForwardIcon, CalendarIcon } from "@chakra-ui/icons";
import { CiPill } from "react-icons/ci";
import { CiViewList } from "react-icons/ci";

function PatientProfile() {
  const [data, , setData] = useState({});
  function validateName(value) {
    let error;
    if (!value) {
      error = "Ce champs est obligatoire";
    } else if (value.toLowerCase() === "") {
      error = "valeur invalid";
    }
    return error;
  }
  return (
    <Box>
      <Flex gap={4}>
        <Card flex="1" maxW="sm">
          <CardBody>
            <Image
              src="https://bit.ly/sage-adebayo"
              alt="Green double couch with wooden legs"
              borderRadius="lg"
            />
            <Stack mt="6" spacing="3">
              <Heading size="md">Mr/Mrs Nader ben ftima</Heading>
              <Text>
                This sofa is perfect for modern tropical spaces, baroque
                inspired spaces, earthy toned spaces and for people who love a
                chic design with a sprinkle of vintage design.
              </Text>
              <Button colorScheme="danger" size="md">
                Supprimer compte
              </Button>
            </Stack>
          </CardBody>
        </Card>
        <Card flex="2">
          <CardBody>
            <Tabs variant="enclosed">
              <TabList>
                <Tab>Generale</Tab>
                <Tab>Rendez-vous</Tab>
                <Tab>Consultations</Tab>
                {/* <Tab>Dossier Medical</Tab> */}
                <Tab>Notes</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Flex alignItems="center" justifyContent="space-between">
                    <Heading size="md">Details Generale </Heading>
                    <Button size="sm" variant="ghost" color="primary.500">
                      Voir tous
                    </Button>
                  </Flex>
                  <Flex
                    bg="gray.50"
                    justifyContent="space-between"
                    p={4}
                    gap={4}>
                    <Avatar
                      size="lg"
                      name="Segun Adebayo"
                      src="https://bit.ly/sage-adebayo"
                    />
                    <Flex flexDirection="column">
                      <Text fontWeight="bold">Mr. Ahlem</Text>
                      <Text color="gray">Ophtalmologue</Text>
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
                    <Text color="gray" fontWeight="bold">
                      Diagnostic Principal
                    </Text>
                    <UnorderedList fontSize="smaller" p={2}>
                      <ListItem>
                        <strong>Stade:</strong> Stade 1
                      </ListItem>
                      <ListItem>
                        <strong>Lecture de la Pression Artérielle:</strong>{" "}
                        145/90 mmHg
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
                        <strong>Condition:</strong> Le patient s'est présenté
                        avec des symptômes d'hypertension artérielle et des
                        étourdissements occasionnels.
                      </ListItem>
                      <ListItem>
                        <strong>Plan de Traitement:</strong> Le médecin a
                        conseillé au patient de suivre un régime pauvre en
                        sodium, d'augmenter l'activité physique et de surveiller
                        la pression artérielle quotidiennement.
                      </ListItem>
                      <ListItem>
                        <strong>Conseils Donnés: </strong> Le médecin a
                        recommandé de réduire le stress par des pratiques de
                        pleine conscience et de garantir un sommeil adéquat.
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
                        <strong>Instructions: </strong> Prenez le médicament à
                        la même heure chaque jour, avec ou sans nourriture.
                      </ListItem>
                    </UnorderedList>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Flex alignItems="center" justifyContent="space-between">
                    <Heading size="md">Details Generale </Heading>
                    <Button size="sm" variant="ghost" color="primary.500">
                      Voir tous
                    </Button>
                  </Flex>
                  <Flex
                    bg="gray.50"
                    justifyContent="space-between"
                    p={4}
                    gap={4}>
                    <Avatar
                      size="lg"
                      name="Segun Adebayo"
                      src="https://bit.ly/sage-adebayo"
                    />
                    <Flex flexDirection="column">
                      <Text fontWeight="bold">Mr. Ahlem</Text>
                      <Text color="gray">Ophtalmologue</Text>
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
                  <Flex
                    my={4}
                    bg="gray.50"
                    justifyContent="space-between"
                    p={4}
                    gap={4}>
                    <Avatar
                      size="lg"
                      name="Segun Adebayo"
                      src="https://bit.ly/sage-adebayo"
                    />
                    <Flex flexDirection="column">
                      <Text fontWeight="bold">Mr. Ahlem</Text>
                      <Text color="gray">Ophtalmologue</Text>
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
                  <Flex
                    my={4}
                    bg="gray.50"
                    justifyContent="space-between"
                    p={4}
                    gap={4}>
                    <Avatar
                      size="lg"
                      name="Segun Adebayo"
                      src="https://bit.ly/sage-adebayo"
                    />
                    <Flex flexDirection="column">
                      <Text fontWeight="bold">Mr. Ahlem</Text>
                      <Text color="gray">Ophtalmologue</Text>
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
                  <Flex
                    my={4}
                    bg="gray.50"
                    justifyContent="space-between"
                    p={4}
                    gap={4}>
                    <Avatar
                      size="lg"
                      name="Segun Adebayo"
                      src="https://bit.ly/sage-adebayo"
                    />
                    <Flex flexDirection="column">
                      <Text fontWeight="bold">Mr. Ahlem</Text>
                      <Text color="gray">Ophtalmologue</Text>
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
                </TabPanel>
                <TabPanel>
                  <Card my={4}>
                    <CardBody>
                      <Flex bg="gray.50" p={4} gap={4}>
                        <Avatar
                          size="lg"
                          name="Segun Adebayo"
                          src="https://bit.ly/sage-adebayo"
                        />
                        <Flex flexDirection="column">
                          <Text fontWeight="bold">Mr. Mohamed Amine</Text>
                          <Text color="gray">derniere consultation 6/6/24</Text>
                          <Flex gap={2}>
                            <Icon as={FaMapPin} color="red.500" />
                            <Text>Hopital farhat hachett sousse </Text>
                          </Flex>
                        </Flex>
                      </Flex>
                    </CardBody>
                    <Divider borderColor="gray" />
                    <CardFooter>
                      <Flex
                        justifyContent="space-between"
                        alignItem="center"
                        w="100%">
                        <Flex alignItems="center" gap="10px">
                          <Icon as={CalendarIcon} color="gray.500" />
                          <Flex fontSize="12px" flexDirection="column">
                            <Text color="gray">Votre consultation</Text>
                            <Text>9h 23 Mai 2024</Text>
                          </Flex>
                        </Flex>
                        <Flex alignItems="center" gap="10px">
                          <Button
                            size="sm"
                            color="#fff"
                            bg="secondary.500"
                            variant="solid"
                            rightIcon={<CalendarIcon />}
                            _hover={{
                              opacity: 0.8,
                            }}>
                            replanifier
                          </Button>
                          <Button
                            size="sm"
                            color="#fff"
                            bg="secondary.500"
                            variant="solid"
                            rightIcon={<ArrowForwardIcon />}
                            _hover={{
                              opacity: 0.8,
                            }}>
                            details
                          </Button>
                        </Flex>
                      </Flex>
                    </CardFooter>
                  </Card>{" "}
                  <Card my={4}>
                    <CardBody>
                      <Flex bg="gray.50" p={4} gap={4}>
                        <Avatar
                          size="lg"
                          name="Segun Adebayo"
                          src="https://bit.ly/sage-adebayo"
                        />
                        <Flex flexDirection="column">
                          <Text fontWeight="bold">Mr. Mohamed Amine</Text>
                          <Text color="gray">derniere consultation 6/6/24</Text>
                          <Flex gap={2}>
                            <Icon as={FaMapPin} color="red.500" />
                            <Text>Hopital farhat hachett sousse </Text>
                          </Flex>
                        </Flex>
                      </Flex>
                    </CardBody>
                    <Divider borderColor="gray" />
                    <CardFooter>
                      <Flex
                        justifyContent="space-between"
                        alignItem="center"
                        w="100%">
                        <Flex alignItems="center" gap="10px">
                          <Icon as={CalendarIcon} color="gray.500" />
                          <Flex fontSize="12px" flexDirection="column">
                            <Text color="gray">Votre consultation</Text>
                            <Text>9h 23 Mai 2024</Text>
                          </Flex>
                        </Flex>

                        <Flex alignItems="center" gap="10px">
                          <Button
                            size="sm"
                            color="#fff"
                            bg="secondary.500"
                            variant="solid"
                            rightIcon={<CalendarIcon />}
                            _hover={{
                              opacity: 0.8,
                            }}>
                            replanifier
                          </Button>
                          <Button
                            size="sm"
                            color="#fff"
                            bg="secondary.500"
                            variant="solid"
                            rightIcon={<ArrowForwardIcon />}
                            _hover={{
                              opacity: 0.8,
                            }}>
                            details
                          </Button>
                        </Flex>
                      </Flex>
                    </CardFooter>
                  </Card>
                  <Card my={4}>
                    <CardBody>
                      <Flex bg="gray.50" p={4} gap={4}>
                        <Avatar
                          size="lg"
                          name="Segun Adebayo"
                          src="https://bit.ly/sage-adebayo"
                        />
                        <Flex flexDirection="column">
                          <Text fontWeight="bold">Mr. Mohamed Amine</Text>
                          <Text color="gray">derniere consultation 6/6/24</Text>
                          <Flex gap={2}>
                            <Icon as={FaMapPin} color="red.500" />
                            <Text>Hopital farhat hachett sousse </Text>
                          </Flex>
                        </Flex>
                      </Flex>
                    </CardBody>
                    <Divider borderColor="gray" />
                    <CardFooter>
                      <Flex
                        justifyContent="space-between"
                        alignItem="center"
                        w="100%">
                        <Flex alignItems="center" gap="10px">
                          <Icon as={CalendarIcon} color="gray.500" />
                          <Flex fontSize="12px" flexDirection="column">
                            <Text color="gray">Votre consultation</Text>
                            <Text>9h 23 Mai 2024</Text>
                          </Flex>
                        </Flex>

                        <Flex alignItems="center" gap="10px">
                          <Button
                            size="sm"
                            color="#fff"
                            bg="secondary.500"
                            variant="solid"
                            rightIcon={<CalendarIcon />}
                            _hover={{
                              opacity: 0.8,
                            }}>
                            replanifier
                          </Button>
                          <Button
                            size="sm"
                            color="#fff"
                            bg="secondary.500"
                            variant="solid"
                            rightIcon={<ArrowForwardIcon />}
                            _hover={{
                              opacity: 0.8,
                            }}>
                            details
                          </Button>
                        </Flex>
                      </Flex>
                    </CardFooter>
                  </Card>
                </TabPanel>
                {/* <TabPanel>
                  <p>tw5 o!</p>
                </TabPanel> */}
                <TabPanel>
                  <Card my={4} bg="gray.50" flex="1">
                    <CardBody>
                      <Flex
                        direction={"row"}
                        alignItems={"start"}
                        justifyContent={"start"}
                        gap={4}>
                        <Flex
                          alignItems={"center"}
                          justifyContent={"center"}
                          gap={4}>
                          <Flex flexDirection="column">
                            <Text fontWeight="bold">Note Medicament</Text>
                            <Text color="gray">
                              derniere modification 5/5/24
                            </Text>
                            <Flex gap={2}>
                              <Text>Medicament a augmenter </Text>
                            </Flex>
                          </Flex>
                        </Flex>
                      </Flex>
                    </CardBody>
                  </Card>
                  <Card my={4} bg="gray.50" flex="1">
                    <CardBody>
                      <Flex
                        direction={"row"}
                        alignItems={"start"}
                        justifyContent={"start"}
                        gap={4}>
                        <Flex
                          alignItems={"center"}
                          justifyContent={"center"}
                          gap={4}>
                          <Flex flexDirection="column">
                            <Text fontWeight="bold">Note Medicament</Text>
                            <Text color="gray">
                              derniere modification 5/5/24
                            </Text>
                            <Flex gap={2}>
                              <Text>Medicament a augmenter </Text>
                            </Flex>
                          </Flex>
                        </Flex>
                      </Flex>
                    </CardBody>
                  </Card>
                  <Card my={4} bg="gray.50" flex="1">
                    <CardBody>
                      <Flex
                        direction={"row"}
                        alignItems={"start"}
                        justifyContent={"start"}
                        gap={4}>
                        <Flex
                          alignItems={"center"}
                          justifyContent={"center"}
                          gap={4}>
                          <Flex flexDirection="column">
                            <Text fontWeight="bold">Note Medicament</Text>
                            <Text color="gray">
                              derniere modification 5/5/24
                            </Text>
                            <Flex gap={2}>
                              <Text>Medicament a augmenter </Text>
                            </Flex>
                          </Flex>
                        </Flex>
                      </Flex>
                    </CardBody>
                  </Card>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </Flex>
    </Box>
  );
}

export default PatientProfile;
