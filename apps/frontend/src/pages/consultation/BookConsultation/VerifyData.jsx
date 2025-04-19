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
              <Text>Your consultation has been saved ✅</Text>
              <Text fontSize="sm" fontWeight="500">
                Please check your details before confirming your reservation
              </Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4} mt={2}>
                <Text mr={2}>
                  <strong>Consultation date:</strong>
                  {values?.date
                    ? DateTime.fromJSDate(new Date(values.date)).toFormat(
                        "dd-MM-yyyy 'à' HH:mm",
                      )
                    : null}
                </Text>
                <Text mr={2}>
                  <strong>Complete name:</strong> {values?.firstName}{" "}
                  {values?.lastName}
                </Text>

                <Text mr={2}>
                  <strong>Address: </strong>
                  {values?.address}
                </Text>
                <Text mr={2}>
                  <strong>City: </strong>
                  {values?.city}
                </Text>
                <Text mr={2}>
                  <strong>ZIP: </strong>
                  {values?.zip}
                </Text>
                <Text mr={2}>
                  <strong>Phone:</strong> {values?.phone}
                </Text>
                <Text mr={2}>
                  <strong>Age:</strong> {values?.age}
                </Text>
                {values?.weight && (
                  <Text mr={2}>
                    <strong>Weight:</strong> {values?.weight}kg
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
                Submit & Finish!
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ) : (
        <Modal isOpen={!!hasSubmitted} onClose={() => navigate("/")} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody mx={12} mt={12} p={8} bg="secondary.500" rounded="md">
              <Heading fontSize="xl" textAlign="center" color="#fff">
                Your consultation has been successfully submitted! 🎉
              </Heading>
            </ModalBody>
            <ModalFooter w="100%">
              <Button
                size="sm"
                colorScheme="primary"
                onClick={() => {
                  navigate("/patient/home");
                }}
                _hover={{
                  bg: "secondary.500",
                }}
              >
                Finish
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default VerifyData;
