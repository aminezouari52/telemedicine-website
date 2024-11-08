import {
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalHeader,
  Box,
} from "@chakra-ui/react";
import ConsultationCard from "./ConsultationCard";

function AllConsultationsModal({ consultations, onClose, isOpen }) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tout les consultations</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box p={4}>
              {consultations.map((consultation, index) => (
                <ConsultationCard key={index} consultation={consultation} />
              ))}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AllConsultationsModal;
