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
import LocalSearch from "@/components/forms/LocalSearch";
import { useNavigate } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import CreateUser from "../users/createUser";
import RdvDetails from "./rdvDetails";
import RdvModal from "./rdvModal";

function Rdv() {
  const pageName = "Liste des Rendez-vous";
  const cancelRef = useRef();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [users, setUsers] = useState([
    {
      _id: "1",
      doctor: "Sophie Harringtonlo",
      patient: "Liam Callo",
      date: "05-06-2024",
      time: "09:00",
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
      {/* <CreateUser mode="create" user="" gestion="rendez-vous" /> */}
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
                    <Th>Docteur</Th>
                    <Th>Patient</Th>
                    <Th>Date</Th>
                    <Th>Heure</Th>
                    <Th>action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user) => (
                    <Tr>
                      <Td>{user?._id}</Td>
                      <Td>{user?.doctor}</Td>
                      <Td>{user?.patient}</Td>
                      <Td>{user?.date}</Td>
                      <Td>{user?.time}</Td>
                      <Td>
                        <Flex>
                          <RdvDetails
                            mode="edit"
                            data={user}
                            gestion="rendez-vous"
                          />
                          {/* <RdvModal
                            mode="edit"
                            data={user}
                            gestion="rendez-vous"
                          /> */}
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

export default Rdv;
