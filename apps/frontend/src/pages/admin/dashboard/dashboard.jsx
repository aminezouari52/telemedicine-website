import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Square,
  Text,
  WrapItem,
} from "@chakra-ui/react";
import React from "react";

import Avatar1 from "@/images/avatars/6.jpg";
import Avatar2 from "@/images/avatars/7.jpg";
import Avatar3 from "@/images/avatars/8.jpg";
import Avatar4 from "@/images/avatars/9.jpg";

function Dashboard() {
  return (
    <Box mt={5}>
      <Flex color="white" gap={4}>
        <Card flex="2">
          <CardHeader>
            <Flex gap={4} justifyContent={"space-between"}>
              <Heading size="md"> Docteurs populaires</Heading>
              <Button
                size="sm"
                colorScheme="primary"
                variant="ghost"
                _hover={{
                  opacity: 0.8,
                }}
              >
                Voir plus <Icon as={ArrowForwardIcon} mr={2} />
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
                        <Text>
                          Médecin généraliste, soignant maladies courantes
                        </Text>
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
                        <Text>
                          Chirurgien spécialisé en interventions complexes
                        </Text>
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
                        <Text>
                          Pédiatre, expert en santé des enfants et adolescents.
                        </Text>
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
                        <Text>
                          Cardiologue, traitant maladies du cœur et problèmes
                          vasculaires.
                        </Text>
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
            <Heading size="md">Tableau de bord des utilisateurs</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              Affichez un résumé de tous vos utilisateurs au cours du mois
              dernier.
            </Text>
          </CardBody>
        </Card>
      </Flex>
    </Box>
  );
}

export default Dashboard;
