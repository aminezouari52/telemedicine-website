// Hooks
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// STYLE
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  ModalFooter,
  Stack,
  Heading,
} from "@chakra-ui/react";
import { DateTime } from "luxon";

const VerifyData = ({ isOpen, onClose, getValues, handleSubmit }) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const navigate = useNavigate();
  const formValues = getValues ? getValues() : {};

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
                  <strong>Consultation date:</strong>{" "}
                  {formValues?.date
                    ? DateTime.fromJSDate(new Date(formValues.date)).toFormat(
                        "dd-MM-yyyy 'à' HH:mm",
                      )
                    : null}
                </Text>
                <Text mr={2}>
                  <strong>Complete name:</strong> {formValues?.firstName}{" "}
                  {formValues?.lastName}
                </Text>

                <Text mr={2}>
                  <strong>Address: </strong>
                  {formValues?.address}
                </Text>
                <Text mr={2}>
                  <strong>City: </strong>
                  {formValues?.city}
                </Text>
                <Text mr={2}>
                  <strong>ZIP: </strong>
                  {formValues?.zip}
                </Text>
                <Text mr={2}>
                  <strong>Phone:</strong> {formValues?.phone}
                </Text>
                <Text mr={2}>
                  <strong>Age:</strong> {formValues?.age}
                </Text>
                {formValues?.weight && (
                  <Text mr={2}>
                    <strong>Weight:</strong> {formValues?.weight}kg
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
                  handleSubmit();
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
