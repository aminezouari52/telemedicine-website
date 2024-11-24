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
  Button,
} from "@chakra-ui/react";
import { useFormikContext } from "formik";
import { DateTime } from "luxon";

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
              <Text>Votre consultation a été Enregistrer ✅</Text>
              <Text fontSize="sm" fontWeight="500">
                Veuillez vérifier vos données avant de confirmer votre
                réservation
              </Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4} mt={2}>
                <Text mr={2}>
                  <strong> Date de la consultation:</strong> le{" "}
                  {values?.date
                    ? DateTime.fromJSDate(new Date(values.date)).toFormat(
                        "dd-MM-yyyy 'à' HH:mm"
                      )
                    : null}
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
                  <strong>Ville: </strong>
                  {values?.city}
                </Text>
                <Text mr={2}>
                  <strong>Code postal: </strong>
                  {values?.zip}
                </Text>
                <Text mr={2}>
                  <strong> Téléphone:</strong> {values?.phone}
                </Text>
                <Text mr={2}>
                  <strong> Age:</strong> {values?.age}
                </Text>
                {values?.weight && (
                  <Text mr={2}>
                    <strong> Poids:</strong> {values?.weight}
                  </Text>
                )}
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button
                size="sm"
                colorScheme="primary"
                _hover={{
                  opacity: 0.8,
                }}
                onClick={() => {
                  submitForm();
                  setHasSubmitted(true);
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
                Votre consultation à été soumise avec succèes! 🎉
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
