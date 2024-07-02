import {
  Flex,
  Box,
  Button,
  Heading,
  Icon,
  Text,
  AlertDialogOverlay,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Card,
  CardBody,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import LocalSearch from "../../../components/forms/LocalSearch";
import { useNavigate } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import CreateUser from "../users/createUser";

function AllDoctors() {
  const pageName = "Liste des Medecins";
  const cancelRef = useRef();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [users, setUsers] = useState([
    {
      _id: "1",
      fname: "Sophie ",
      lname: "Harrington",
      email: "sophie@gmail.com",
      speciality: "psychiatrie",
      address: "sousse, 4034",
      role: "Docteur",
    },
    {
      _id: "2",
      fname: "Aiden ",
      lname: "Bellamy",
      email: "aiden@gmail.com",
      speciality: "pédiatrie",
      address: "tunis, 1000",
      role: "Docteur",
    },
    {
      _id: "3",
      fname: "ahmed",
      lname: "salah",
      email: "salah@gmail.com",
      speciality: "pédiatrie",
      address: "beja, 2060",
      role: "Docteur",
    },
  ]);
  const [keyword, setKeyword] = useState("");
  const searched = (keyword) => (c) => c?.name?.includes(keyword);
  const handleRemove = async () => {
    try {
      toast({
        title: `"$res.data.name" deleted`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Failed to remove category",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    onClose();
  };
  return (
    <Box overflowY="hidden">
      <Heading size="md" my={5}>
        {pageName}
      </Heading>
      <CreateUser mode="create" user="" gestion="medecin" />
      <Card my={2}>
        <CardBody>
          <LocalSearch keyword={keyword} setKeyword={setKeyword} />

          <Flex direction="column">
            <TableContainer>
              <Table variant="simple">
                {/* <TableCaption>
                  Imperial to metric conversion factors
                </TableCaption> */}
                <Thead>
                  <Tr>
                    <Th>id</Th>
                    <Th>Nom</Th>
                    <Th>PreNom</Th>
                    <Th>Email</Th>
                    <Th>Specialite</Th>
                    <Th>adresse</Th>
                    <Th>role</Th>
                    <Th>action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user) => (
                    <Tr>
                      <Td>{user?._id}</Td>
                      <Td>{user?.fname}</Td>
                      <Td>{user?.lname}</Td>
                      <Td>{user?.email}</Td>
                      <Td>{user?.speciality}</Td>
                      <Td>{user?.address}</Td>
                      <Td>{user?.role}</Td>
                      <Td>
                        <Flex>
                          <CreateUser
                            mode="edit"
                            data={user}
                            gestion="medecin"
                          />

                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => {
                              //   setCategorySlug(c.slug);
                              onOpen();
                            }}
                          >
                            <Icon as={AiFillDelete} />
                          </Button>
                          <AlertDialog
                            isOpen={isOpen}
                            leastDestructiveRef={cancelRef}
                            onClose={onClose}
                          >
                            <AlertDialogOverlay bgColor="rgba(0, 0, 0, 0.2)">
                              <AlertDialogContent>
                                <AlertDialogHeader
                                  fontSize="lg"
                                  fontWeight="bold"
                                >
                                  Delete Category
                                </AlertDialogHeader>

                                <AlertDialogBody>
                                  Are you sure? You can't undo this action
                                  afterwards.
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                  <Button ref={cancelRef} onClick={onClose}>
                                    Cancel
                                  </Button>
                                  <Button
                                    colorScheme="red"
                                    onClick={handleRemove}
                                    ml={3}
                                  >
                                    Delete
                                  </Button>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialogOverlay>
                          </AlertDialog>
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
                {/* <Tfoot>
                  <Tr>
                    <Th>To convert</Th>
                    <Th>into</Th>
                    <Th isNumeric>multiply by</Th>
                  </Tr>
                </Tfoot> */}
              </Table>
            </TableContainer>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  );
}

export default AllDoctors;
