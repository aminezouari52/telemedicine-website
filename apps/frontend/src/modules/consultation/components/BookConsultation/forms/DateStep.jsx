// HOOKS
import { useFormikContext } from "formik";
import { useState } from "react";

// FUNCTIONS
import { DateTime } from "luxon";

// STYLE
import { Flex, Stack, Text, Input, Button, Heading } from "@chakra-ui/react";
import "./calender.css";

// DATE
import DatePicker, { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr"; // without this line it didn't work
registerLocale("fr", fr);

const DateStep = ({ goToNext, goToPrevious }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { values, setFieldValue } = useFormikContext();

  return (
    <Flex
      h="100%"
      w="100%"
      direction="column"
      justifyContent="end"
      gap={8}
      px={20}
    >
      <Flex flexDirection="column" w="100%">
        <Heading size="xs" color="gray.600" pb={4}>
          Choisir la date et l'heure
        </Heading>
        <DatePicker
          required
          name="date"
          selected={selectedDate}
          locale="fr"
          onChange={(date) => {
            setSelectedDate(date);
            setFieldValue("date", date);
          }}
          inline
        />
      </Flex>
      <Stack spacing={7} maxWidth="600px">
        <Flex gap="20px">
          <Text mt="6px" fontWeight="bold">
            Temps:
          </Text>
          <Flex flexDirection="column" gap="6px" w="100%">
            <Input
              type="time"
              defaultValue={DateTime.fromJSDate(new Date()).toFormat("HH:mm")}
              colorScheme="primary.500"
              focusBorderColor="secondary.500"
              onChange={(e) => {
                const date = values?.date;
                const [hours, minutes] = e.target.value.split(":").map(Number);
                date.setHours(hours, minutes, 0, 0);
                setFieldValue("date", date);
              }}
            />
          </Flex>
        </Flex>
        <Text mr={2}>
          <strong>Date choisis: </strong>
          le{" "}
          {values?.date
            ? DateTime.fromJSDate(new Date(values.date)).toFormat(
                "dd-MM-yyyy 'à' HH:mm"
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
            Précédent
          </Button>
          <Button
            size="sm"
            onClick={() => goToNext(values)}
            colorScheme="secondary"
            _hover={{
              opacity: 0.8,
            }}
          >
            Enregistrer & Continuer
          </Button>
        </Flex>
      </Stack>
    </Flex>
  );
};

export default DateStep;
