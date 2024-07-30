// HOOKS
import { useFormikContext } from "formik";
import { useState, useEffect } from "react";
// import { transformEnglishDaytoFrench } from 'utils/functions';

// CALENDER
import DatePicker, { registerLocale } from "react-datepicker";
import "./calender.css";
import moment from "moment";
import "moment/locale/fr";

// STYLED
import { Flex, Stack, Text, Input, Button, Heading } from "@chakra-ui/react";

import { fr } from "date-fns/locale/fr"; // without this line it didn't work
moment.locale("fr");
registerLocale("fr", fr);

const DateStep = ({ nextForm }) => {
  const [bookedReservations, setBookedReservations] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  // const { data: reservations, refetch } = useGetReservationsQuery({});
  const [reservations, setReservations] = useState([
    { time: "jour", date: "2024-05-29" },
  ]);

  function checkReservation(targetDate) {
    let hasJour = false;
    let hasSoir = false;

    reservations?.forEach((reservation) => {
      if (reservation.date === targetDate) {
        if (reservation.time === "jour") {
          hasJour = true;
        } else if (reservation.time === "soir") {
          hasSoir = true;
        }
      }
    });

    if (hasJour && hasSoir) {
      return "jour-soir";
    } else {
      return "";
    }
  }

  useEffect(() => {
    const newReservations = reservations?.map((res) => {
      let message = "";
      if (checkReservation(res?.date) === "jour-soir") return;
      if (res?.time === "soir") {
        message = "seulement jour est disponible";
      }
      if (res?.time === "jour") {
        message = "seulement soir est disponible";
      }
      return { date: res?.date, holidayName: message };
    });
    const bookedReservationsObj = newReservations?.filter(
      (item) => item !== undefined
    );
    if (bookedReservationsObj !== undefined) {
      bookedReservationsObj?.forEach((element) => {
        setBookedReservations((prev) => {
          return {
            ...prev,
            // eslint-disable-next-line no-constant-condition
            [element.date]:
              element.holidayName === "seulement jour est disponible"
                ? "jour"
                : "soir",
          };
        });
      });
    }
  }, [reservations]);

  // useEffect(() => {
  //   // refetch();
  // }, [reservations]);

  const [disableButton, setDisableButton] = useState(false);

  const {
    values,
    setFieldValue,
    errors,
    validateForm,
    setFieldTouched,
    validateField,
    touched,
  } = useFormikContext();

  const nextFormHandler = async () => {
    const asyncErrors = await validateForm();
    if (asyncErrors.date || asyncErrors.time) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
      nextForm(values);
    }
  };

  useEffect(() => {
    if (errors.date || errors.time) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [errors]);

  return (
    <Flex
      h="100%"
      w="100%"
      direction="column"
      justifyContent="end"
      gap={8}
      ps={20}
      pe={20}
    >
      <Flex flexDirection="column" w="100%">
        <Heading size="xs" color="gray.600" pb={4}>
          Choisir la date et l'heure
        </Heading>
        <DatePicker
          required
          name="date"
          selected={startDate}
          locale="fr"
          dateFormat="yyyy/mm/dd h:mm aa"
          onChange={(date) => {
            setStartDate(date);
            setFieldValue("date", moment(date).format("YYYY-MM-DD"));
            validateField("date");
          }}
          inline
          dayClassName={(date) => {
            const dayDate = moment(date).format("YYYY-MM-DD");
            return checkReservation(dayDate);
          }}
          // holidays={holidaysFunction()}
        />
        <Text py={2} color="red">
          {errors?.date}
        </Text>
      </Flex>
      <Stack spacing={7} maxWidth="600px">
        <Flex gap="20px">
          <Text mt="6px" fontWeight="bold">
            Temps:
          </Text>
          <Flex flexDirection="column" gap="6px" w="100%">
            <Input
              value={values.time}
              name="time"
              onChange={(e) => {
                setFieldValue("time", e.target.value);
              }}
              colorScheme="primary.500"
              focusBorderColor="secondary.500"
              type="time"
            />
          </Flex>
        </Flex>
        <Text py={2} color="red">
          {touched.time && errors?.time}
        </Text>
        <Text mr={2}>
          <strong>Date choisis: </strong> {}
          {`${values.date} à ${values.time}`}
        </Text>
        <Flex justifyContent="end">
          <Button
            size="sm"
            onClick={nextFormHandler}
            colorScheme="secondary"
            isDisabled={disableButton}
            _hover={{
              opacity: !disableButton && 0.8,
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
