import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Form } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import moment from "moment";
import "moment/locale/fr"; // without this line it didn't work
moment.locale("fr");

function DoctorProfile() {
  const [data, , setData] = useState({});
  const [displayDetails, setdisplayDetails] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [bookedReservations, setBookedReservations] = useState({});

  function cancelChangeDisplay() {
    setdisplayDetails(
      <Flex alignItems="center" justifyContent="space-between">
        <Card flex="2">
          <CardBody>
            <Stack mt="6" spacing="3">
              <Formik
                initialValues={{ name: "Sasuke" }}
                onSubmit={(values, actions) => {
                  setTimeout(() => {
                    alert(JSON.stringify(values, null, 2));
                    actions.setSubmitting(false);
                  }, 1000);
                }}
              >
                <Form>
                  <Field my={4} name="fname" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <FormLabel>Nom</FormLabel>
                        <Text>Ben ftima</Text>
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field my={4} name="lname" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <FormLabel>PreNom</FormLabel>
                        <Text>Nader</Text>

                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field my={4} name="email" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <FormLabel>Email</FormLabel>
                        <Text>Naderbenftima@gmail.com</Text>
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field my={4} name="address" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <FormLabel>Adresse</FormLabel>
                        <Text>Rue 9 avril tunis Tunisie</Text>
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field my={4} name="speciality" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <FormLabel>Specialite</FormLabel>
                        <Text>Orthepedist</Text>
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Form>
              </Formik>
            </Stack>
            <Button onClick={changeDisplay}>Modifier</Button>
          </CardBody>
        </Card>
      </Flex>
    );
  }

  useEffect(() => {
    if (!displayDetails) {
      cancelChangeDisplay();
    }
  }, [displayDetails]);
  function changeDisplay() {
    setdisplayDetails(
      <Flex alignItems="center" justifyContent="space-between">
        <Card flex="2">
          <CardBody>
            <Stack mt="6" spacing="3">
              <Formik
                initialValues={{ name: "Sasuke" }}
                onSubmit={(values, actions) => {
                  setTimeout(() => {
                    alert(JSON.stringify(values, null, 2));
                    actions.setSubmitting(false);
                  }, 1000);
                }}
              >
                <Form>
                  <Field my={4} name="fname" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <FormLabel>Nom</FormLabel>
                        <Input
                          defaultValue={data?.fname}
                          {...field}
                          placeholder="Nom"
                        />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field my={4} name="lname" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <FormLabel>PreNom</FormLabel>
                        <Input
                          defaultValue={data?.lname}
                          {...field}
                          placeholder="PreNom"
                        />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field my={4} name="email" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <FormLabel>Email</FormLabel>
                        <Input
                          defaultValue={data?.email}
                          {...field}
                          placeholder="Email"
                        />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field my={4} name="address" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <FormLabel>Adresse</FormLabel>
                        <Input
                          defaultValue={data?.address}
                          {...field}
                          placeholder="Adresse"
                        />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field my={4} name="speciality" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <FormLabel>Specialite</FormLabel>
                        <Input
                          defaultValue={data?.speciality}
                          {...field}
                          placeholder="Specialite"
                        />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field my={4} name="role" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <FormLabel>Role</FormLabel>
                        <Input
                          defaultValue={data?.role}
                          {...field}
                          placeholder="Role"
                        />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Form>
              </Formik>
            </Stack>
            <Flex>
              <Button>Modifier</Button>
              <Button onClick={cancelChangeDisplay}>Annuler</Button>
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    );
  }
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

  const [reservations, setReservations] = useState([
    { time: "jour", date: "2024-05-29" },
  ]);
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
  function validateName(value) {
    let error;
    zzz;
    if (!value) {
      error = "Ce champs est obligatoire";
    } else if (value.toLowerCase() === "") {
      error = "valeur invalid";
    }
    return error;
  }
  return (
    <Box>
      <Flex gap={4}>
        <Card flex="1" maxW="sm">
          <CardBody>
            <Image
              src="https://bit.ly/sage-adebayo"
              alt="Green double couch with wooden legs"
              borderRadius="lg"
            />
            <Stack mt="6" spacing="3">
              <Heading size="md">Dr Nader ben ftima</Heading>
              <Text>
                Je m'appelle Dr. Nader ben ftima, et je suis spécialisé en
                orthepedie. Après avoir obtenu mon diplôme de médecine à
                l'Université de Paris Descartes, j'ai poursuivi une formation
                approfondie en cardiologie à l'Hôpital Cochin.
              </Text>
              <Button colorScheme="danger" size="md">
                Supprimer compte
              </Button>
            </Stack>
          </CardBody>
        </Card>
        <Card flex="2">
          <CardBody>
            <Tabs variant="enclosed">
              <TabList>
                <Tab>Generale</Tab>
                <Tab>Callendrier</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Heading size="md">Details</Heading>
                  {displayDetails}
                </TabPanel>
                <TabPanel>
                  <Flex
                    flexDirection="column"
                    w="100%"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <DatePicker
                      required
                      name="date"
                      selected={startDate}
                      locale="fr"
                      dateFormat="yyyy/mm/dd h:mm aa"
                      onChange={(date) => {
                        setStartDate(date);
                        setFieldValue(
                          "date",
                          moment(date).format("YYYY-MM-DD")
                        );
                      }}
                      inline
                      dayClassName={(date) => {
                        const dayDate = moment(date).format("YYYY-MM-DD");
                        return checkReservation(dayDate);
                      }}
                    />
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </Flex>
    </Box>
  );
}

export default DoctorProfile;
