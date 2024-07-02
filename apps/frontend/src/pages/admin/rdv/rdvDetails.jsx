import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  Input,
  Tag,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import { Form } from "react-router-dom";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { FaEye } from "react-icons/fa";

function RdvDetails({ mode, data, gestion }) {
  const gestionnaire = gestion ? gestion : "";
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [input, setInput] = useState("");
  const [doctor, setDoctor] = useState({
    name: "nibel",
    speciality: "ortho",
    cabine: "sousse",
  });
  const [patient, setpatient] = useState({
    name: "nibel",
    speciality: "ortho",
    cabine: "sousse",
  });
  const [date, setDate] = useState({
    date: "06/08",
    day: "monday",
    start: "8:00 AM",
    end: "9:30 AM",
  });
  const handleInputChange = (e) => setInput(e.target.value);

  const isError = input === "";
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
    <>
      <Button
        size={mode == "edit" ? "sm" : `md`}
        colorScheme={mode == "edit" ? "yellow" : `blue`}
        mr={2}
        onClick={onOpen}>
        <Icon as={FaEye} />
      </Button>
      <Modal size={"lg"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {mode == "edit" ? "Modifier" : "Creer"} un {gestionnaire}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex color="white" gap={4}>
              <Card bg="gray.50" flex="1">
                <CardBody>
                  <Center>
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      gap={4}
                      direction="column">
                      <Avatar
                        size="lg"
                        name="Segun Adebayo"
                        src="https://bit.ly/sage-adebayo"
                      />
                      <Flex
                        alignItems={"center"}
                        justifyContent={"center"}
                        direction="column"
                        p={4}>
                        <Text>{doctor.name}</Text>

                        <Text>{doctor.speciality}</Text>

                        <Text>{doctor.cabine}</Text>

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
                      direction="column">
                      <Avatar
                        size="lg"
                        name="Segun Adebayo"
                        src="https://bit.ly/sage-adebayo"
                      />
                      <Flex
                        alignItems={"center"}
                        justifyContent={"center"}
                        direction="column"
                        p={4}>
                        <Text>{patient.name}</Text>

                        <Text>{patient.email}</Text>

                        <Text>{patient.cabine}</Text>

                        <Icon as={ArrowForwardIcon} mr={2} />
                      </Flex>
                    </Flex>
                  </Center>
                </CardBody>
              </Card>
            </Flex>
            <Card mt={3} bg="gray.50" flex="1">
              <CardBody>
                <Center>
                  <HStack spacing={4}>
                    {Object.keys(date).map((key) => (
                      <Tag
                        size={"lg"}
                        key={date[`${key}`]}
                        borderRadius="full"
                        variant="solid"
                        colorScheme="primary">
                        <TagLabel>{date[`${key}`]}</TagLabel>
                      </Tag>
                    ))}
                  </HStack>
                </Center>
              </CardBody>
            </Card>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} type="submit">
              Fermer
            </Button>
            <Button color="primary.500">
              {mode == "edit" ? "Modifier" : "Creer"}{" "}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default RdvDetails;
