// HOOKS
import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// FUNCTIONS
import { DateTime } from "luxon";
import { getDoctorConsultations } from "@/services/consultationService";
import { generateAvailableHours } from "@/utils/consultation";

// STYLE
import {
  Flex,
  Stack,
  Text,
  Button,
  Heading,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react";

// DATE
import DatePicker from "react-datepicker";

const DateStep = ({ goToNext, goToPrevious }) => {
  const { values, setFieldValue } = useFormikContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { isOpen, onClose, onOpen } = useDisclosure();

  const datePickerOnChangeHandler = (date) => {
    setSelectedDate(date);
    onOpen();
  };

  const onSaveTime = (date) => {
    setFieldValue("date", date);
    onClose();
  };

  return (
    <>
      <TimeModal
        date={selectedDate}
        isOpen={isOpen}
        onClose={onClose}
        onSaveTime={onSaveTime}
      />

      <Flex h="100%" direction="column" justifyContent="end" gap={8} px={20}>
        <Flex flexDirection="column" w="100%">
          <Heading size="xs" color="gray.600" pb={4}>
            Choose date and time
          </Heading>
          <DatePicker
            required
            name="date"
            selected={selectedDate}
            onChange={datePickerOnChangeHandler}
            inline
          />
        </Flex>
        <Stack spacing={7} maxWidth="600px">
          <Text mr={2}>
            <strong>Selected date: </strong>
            {values?.date
              ? DateTime.fromJSDate(new Date(values.date)).toFormat(
                  "dd-MM-yyyy 'à' HH:00",
                )
              : null}
          </Text>
          <Flex justifyContent="end">
            <Button
              size="sm"
              variant="ghost"
              color="#000"
              _hover={{
                opacity: 0.8,
              }}
              onClick={goToPrevious}
            >
              Previous
            </Button>
            <Button
              size="sm"
              onClick={() => goToNext(values)}
              colorScheme="secondary"
              _hover={{
                opacity: 0.8,
              }}
            >
              Save & Continue
            </Button>
          </Flex>
        </Stack>
      </Flex>
    </>
  );
};

const TimeModal = ({ date, isOpen, onClose, onSaveTime }) => {
  const [timeOptions, setTimeOptions] = useState([]);
  const params = useParams();
  const selectedDate = date.toISOString().slice(0, 10);
  const [finalTime, setFinalTime] = useState();

  const loadConsultations = async () => {
    const consultationsData = (await getDoctorConsultations(params?.id)).data;
    setTimeOptions(generateAvailableHours(consultationsData, selectedDate));
  };

  useEffect(() => {
    loadConsultations();
  }, [date]);

  const onChangeHandler = (event) => {
    const newDate = new Date(date);
    newDate.setHours(event.target.value, 0, 0, 0);
    setFinalTime(newDate);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xs" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Available times</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Select
            focusBorderColor="secondary.500"
            onChange={onChangeHandler}
            defaultValue={timeOptions[0]?.value}
          >
            {timeOptions?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            colorScheme="primary"
            onClick={() => {
              if (finalTime) {
                onSaveTime(finalTime);
              }
            }}
            _hover={{
              opacity: finalTime && 0.8,
            }}
            isDisabled={!finalTime}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DateStep;
