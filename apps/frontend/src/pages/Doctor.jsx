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
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
  Heading,
  Icon,
  Text,
  IconButton,
} from "@chakra-ui/react";
import React from "react";
import { IoMdSettings } from "react-icons/io";

import Avatar1 from "../images/avatars/10.jpg";
import Avatar2 from "../images/avatars/7.jpg";
import Avatar3 from "../images/avatars/11.jpg";
import Avatar4 from "../images/avatars/12.jpg";

const Doctor = () => {
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

      <Flex color="white" gap={4}>
        <Card flex="1">
          <CardHeader>
            <Flex gap={4} justifyContent={"space-between"}>
              <Heading size="md"> Mes patients</Heading>
              <Button
                rightIcon={<ArrowForwardIcon />}
                colorScheme="secondary"
                size="sm"
                _hover={{
                  opacity: 0.8,
                }}
              >
                Voir plus
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            <Flex color="white" gap={4}>
              <Card bg="gray.50" flex="1">
                <CardBody>
                  <Center>
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      gap={4}
                    >
                      <Avatar size="lg" name="Segun Adebayo" src={Avatar1} />
                      <Flex
                        alignItems={"center"}
                        justifyContent={"center"}
                        gap={4}
                      >
                        <Flex flexDirection="column">
                          <Text fontWeight="bold">Mme. Ahlem</Text>
                          <Text color="gray">derniere consultation 5/5/24</Text>
                          <Flex gap={2}>
                            <Text>Hopital farhat hachett sousse </Text>
                          </Flex>
                        </Flex>
                        <Icon as={ArrowForwardIcon} mr={2} />
                      </Flex>
                    </Flex>
                  </Center>
                </CardBody>
              </Card>

              <Card bg="gray.50" flex="1">
                <CardBody>
                  <Center>
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      gap={4}
                    >
                      <Avatar size="lg" name="Segun Adebayo" src={Avatar2} />
                      <Flex
                        alignItems={"center"}
                        justifyContent={"center"}
                        gap={4}
                      >
                        <Flex flexDirection="column">
                          <Text fontWeight="bold">Mr. Ahmed</Text>
                          <Text color="gray">derniere consultation 5/5/24</Text>
                          <Flex gap={2}>
                            <Text>Hopital Sahloul sousse </Text>
                          </Flex>
                        </Flex>
                        <Icon as={ArrowForwardIcon} mr={2} />
                      </Flex>
                    </Flex>
                  </Center>
                </CardBody>
              </Card>
            </Flex>
            <Flex mt={4} color="white" gap={4}>
              <Card bg="gray.50" flex="1">
                <CardBody>
                  <Center>
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      gap={4}
                    >
                      <Avatar size="lg" name="Segun Adebayo" src={Avatar3} />
                      <Flex
                        alignItems={"center"}
                        justifyContent={"center"}
                        gap={4}
                      >
                        <Flex flexDirection="column">
                          <Text fontWeight="bold">Mr. Hend</Text>
                          <Text color="gray">derniere consultation 5/5/24</Text>
                          <Flex gap={2}>
                            <Text>Hopital farhat hachett sousse </Text>
                          </Flex>
                        </Flex>
                        <Icon as={ArrowForwardIcon} mr={2} />
                      </Flex>
                    </Flex>
                  </Center>
                </CardBody>
              </Card>
              <Card bg="gray.50" flex="1">
                <CardBody>
                  <Center>
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      gap={4}
                    >
                      <Avatar size="lg" name="Segun Adebayo" src={Avatar4} />
                      <Flex
                        alignItems={"center"}
                        justifyContent={"center"}
                        gap={4}
                      >
                        <Flex flexDirection="column">
                          <Text fontWeight="bold">Mr. Ons</Text>
                          <Text color="gray">derniere consultation 5/5/24</Text>
                          <Flex gap={2}>
                            <Text>Hopital farhat hachett sousse </Text>
                          </Flex>
                        </Flex>
                        <Icon as={ArrowForwardIcon} mr={2} />
                      </Flex>
                    </Flex>
                  </Center>
                </CardBody>
              </Card>
            </Flex>
          </CardBody>
        </Card>
        <Card flex="1">
          <CardHeader>
            <Heading size="md">
              <Flex gap={4} justifyContent={"space-between"}>
                <Heading size="md"> Mes Rendez-vous</Heading>
                <Button
                  rightIcon={<ArrowForwardIcon />}
                  colorScheme="secondary"
                  size="sm"
                  _hover={{
                    opacity: 0.8,
                  }}
                >
                  Voir plus
                </Button>
              </Flex>
            </Heading>
          </CardHeader>
          <CardBody>
            <Accordion>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      9 heurs
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Flex alignItems={"center"} justifyContent={"center"} gap={4}>
                    <Avatar
                      size="lg"
                      name="Segun Adebayo"
                      src="https://bit.ly/sage-adebayo"
                    />
                    <Box>
                      <Text fontSize="lg  " as="b">
                        Patient
                      </Text>
                      <Text>alex vermont</Text>
                      <Text fontSize="lg  " as="b">
                        Numero du tel
                      </Text>
                      <Text>+216 55978365</Text>
                      <Text fontSize="lg  " as="b">
                        Details
                      </Text>
                      <Text>
                        View a summary of all your customers over the last
                        month.
                      </Text>
                    </Box>
                    <Icon as={ArrowForwardIcon} mr={2} />
                  </Flex>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      10 heurs 30 minute
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Flex alignItems={"center"} justifyContent={"center"} gap={4}>
                    <Avatar
                      size="lg"
                      name="Segun Adebayo"
                      src="https://bit.ly/sage-adebayo"
                    />
                    <Box>
                      <Text fontSize="lg  " as="b">
                        Patient
                      </Text>
                      <Text>alex vermont</Text>
                      <Text fontSize="lg  " as="b">
                        Numero du tel
                      </Text>
                      <Text>+216 55978365</Text>
                      <Text fontSize="lg  " as="b">
                        Details
                      </Text>
                      <Text>
                        View a summary of all your customers over the last
                        month.
                      </Text>
                    </Box>
                    <Icon as={ArrowForwardIcon} mr={2} />
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </CardBody>
        </Card>
      </Flex>
    </Box>
  );
};

export default Doctor;
