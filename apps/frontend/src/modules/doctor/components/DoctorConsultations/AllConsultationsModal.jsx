import {
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalHeader,
  Flex,
} from "@chakra-ui/react";
import ConsultationCard from "./ConsultationCard";

function AllConsultationsModal({ consultations, onClose, isOpen }) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>All consultations</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" p={4} gap={4}>
              {consultations.map((consultation, index) => (
                <ConsultationCard key={index} consultation={consultation} />
              ))}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AllConsultationsModal;
