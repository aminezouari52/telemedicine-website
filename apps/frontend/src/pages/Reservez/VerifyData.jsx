// Hooks
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// STYLED
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Stack,
  Heading,
  Text,
} from "@chakra-ui/react";
import { Button } from "./Button/Button";
import moment from "moment";
import { useFormikContext } from "formik";

const VerifyData = ({ isOpen, onClose }) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const navigate = useNavigate();

  const { values, submitForm } = useFormikContext();

  return (
    <>
      {!hasSubmitted ? (
        <Modal
          onClose={onClose}
          isOpen={isOpen}
          scrollBehavior="outside"
          size="xl"
        >
          <ModalOverlay bg="blackAlpha.700" />
          <ModalContent>
            <ModalHeader>
              <Text>Votre reservation a été Enregistrer ✅</Text>
              <Text fontSize="sm" fontWeight="500">
                Veuillez vérifier vos données avant de confirmer votre
                réservation
              </Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4} mt={2}>
                <Text mr={2}>
                  <strong> Date de l'évenement:</strong> le{" "}
                  {moment(values?.date).format("DD MMM YYYY")}, {values?.time}
                </Text>
                <Text mr={2}>
                  <strong> Nom complet:</strong> {values?.firstName}{" "}
                  {values?.lastName}
                </Text>

                <Text mr={2}>
                  <strong>Addresse: </strong>
                  {values?.address}
                </Text>
                <Text mr={2}>
                  <strong> Téléphone:</strong> {values?.phone}
                </Text>
                <Text mr={2}>
                  <strong> Age:</strong> {values?.age}
                </Text>
                <Text mr={2}>
                  <strong> Poids:</strong> {values?.weight}
                </Text>
                <Text mr={2}>
                  <strong>Docteur: </strong>
                  {values?.doctor}
                </Text>
                <Text mr={2}>
                  <strong>Type d'assurance: </strong>
                  {values?.type}
                </Text>
                <Text mr={2}>
                  <strong>Date d'assurance: </strong>
                  {moment(values?.dateInsurance).format("DD-MM-YYYY")}
                </Text>
                <Text mr={2}>
                  <strong>Fournisseur: </strong>
                  {values?.provider}
                </Text>
                <Text mr={2}>
                  <strong>Numéro de police: </strong>
                  {values?.police}
                </Text>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={() => {
                  submitForm();
                  setHasSubmitted(true);
                }}
                bg="primary.500"
                _hover={{
                  opacity: 0.7,
                }}
              >
                Soumettre & Terminé!
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ) : (
        <Modal
          isOpen={!!hasSubmitted}
          onClose={() => navigate("/")}
          size={{ lg: "3xl", md: "2xl", sm: "xs", base: "xs" }}
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody mx={12} mt={12} p={8} bg="secondary.500" rounded="md">
              <Heading fontSize="xl" textAlign="center" color="#fff">
                Votre reservation à été soumise avec succèes! 🎉
              </Heading>
            </ModalBody>
            <ModalFooter w="100%">
              <Button
                colorScheme="primary"
                onClick={() => {
                  navigate("/patient/home");
                }}
                _hover={{
                  bg: "secondary.500",
                }}
              >
                Terminer
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default VerifyData;
