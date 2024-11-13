// HOOKS
import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "@chakra-ui/react";

// FUNCTIONS
import {
  updateDoctor,
  uploadProfilePicture,
} from "@/modules/doctor/functions/doctor";
import { debounceFieldValue } from "@/utils";
import { getCurrentUser } from "@/modules/auth/functions/auth";
import { setUser } from "@/reducers/userReducer";
import * as Yup from "yup";

// COMPONENTS
import ImageUpload from "@/components/ImageUpload";
import TextFormControl from "./TextFormControl";
import { Field, FieldArray, Form, Formik } from "formik";

// STYLE
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  chakra,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputRightElement,
  IconButton,
  Divider,
} from "@chakra-ui/react";

// ASSETS
import { FaUser } from "react-icons/fa";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";

const General = ({ setIsLoading }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const user = useSelector((state) => state.userReducer.user);
  const memoizeDebounceFieldValue = useCallback(debounceFieldValue, []);
  const [currentUser, setCurrentUser] = useState();
  const [imageSrc, setImageSrc] = useState();

  const initialValues = {
    firstName: currentUser?.firstName,
    lastName: currentUser?.lastName,
    age: currentUser?.age,
    phone: currentUser?.phone,
    address: currentUser?.address,
    city: currentUser?.city,
    zip: currentUser?.zip,
    description: currentUser?.description,
    hospital: currentUser?.hospital,
    specialty: currentUser?.specialty,
    degrees: currentUser?.degrees,
    certifications: currentUser?.certifications,
    experience: currentUser?.experience,
    price: currentUser?.price,
    schedule: currentUser?.schedule,
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("Le prénom est requis")
      .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
    lastName: Yup.string()
      .required("Le nom de famille est requis")
      .max(50, "Le nom de famille ne peut pas dépasser 50 caractères"),
    age: Yup.number()
      .required("L'âge est requis")
      .min(18, "Vous devez avoir au moins 18 ans")
      .max(100, "L'âge ne peut pas dépasser 100 ans"),
    phone: Yup.string()
      .required("Le numéro de téléphone est requis")
      .matches(/^[0-9]*$/, "Le numéro de téléphone n'nest pas valide"),
    address: Yup.string()
      .required("L'adresse est requise")
      .max(50, "L'adresse ne peut pas dépasser 50 caractères"),
    city: Yup.string()
      .required("La ville est requise")
      .max(50, "La ville ne peut pas dépasser 50 caractères"),
    zip: Yup.string()
      .required("Le code postal est requis")
      .matches(/^[0-9]+$/, "Le code postal doit être un nombre")
      .min(4, "Le code postal doit comporter au moins 4 chiffres")
      .max(5, "Le code postal ne peut pas dépasser 5 chiffres"),
    description: Yup.string()
      .required("La description est requise")
      .max(500, "La description ne peut pas dépasser 500 caractères"),
    hospital: Yup.string()
      .oneOf(
        [
          "Hôpital Mongi Slim",
          "Hôpital Charles Nicolle",
          "Hôpital La Rabta",
          "Hôpital Razi",
          "Hôpital Sahloul",
          "Hôpital Farhat Hached",
          "Hôpital Fattouma Bourguiba",
          "Hôpital Hédi Chaker",
          "Hôpital Habib Bourguiba",
        ],
        "L'hôpital sélectionné n'est pas valide"
      )
      .required("L'hôpital est requis"),
    specialty: Yup.string()
      .oneOf(
        [
          "Généraliste",
          "Cardiologue",
          "Dermatologue",
          "Endocrinologue",
          "Gastro-entérologue",
          "Neurologue",
          "Pédiatre",
          "Psychiatre",
        ],
        "La spécialité sélectionné n'est pas valide"
      )
      .required("La spécialité est requis"),
    degrees: Yup.array()
      .of(Yup.string())
      .min(1, "Choisir au moins un dîplome")
      .max(10, "Maximum 10 dîplomes"),
    certifications: Yup.array()
      .of(Yup.string())
      .min(1, "Choisir au moins une certificat")
      .max(10, "Maximum 10 certificats"),
    price: Yup.number()
      .required("Le prix est requis")
      .min(0, "Le prix ne peut pas être négatif")
      .max(1000, "Le prix ne doit pas dépasser 1000dt/hr"),
    schedule: Yup.array().of(Yup.string()).min(1, "Choisir au moins un jour"),
  });

  const profileImageHandler = (uri) => {
    setIsLoading(true);
    setImageSrc(uri);
    setIsLoading(false);
  };

  useEffect(() => {
    const getUser = async () => {
      if (user && user.token) {
        const res = await getCurrentUser(user.token);
        setCurrentUser(res.data);
      }
    };
    getUser();
  }, [user]);

  useEffect(() => {
    if (currentUser) {
      setImageSrc(currentUser.photo);
    }
  }, [currentUser]);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        setIsLoading(true);
        if (!imageSrc || imageSrc === "") {
          toast({
            title: "Image non valide",
            description: "choisir une image valide",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          setIsLoading(false);
          return;
        }

        if (user) {
          const imageResponse = await uploadProfilePicture(user, imageSrc);
          await updateDoctor(
            { id: user._id, token: user.token },
            {
              ...values,
              photo: imageResponse.data.url,
              isProfileCompleted: true,
            }
          );
          dispatch(
            setUser({
              ...user,
              isProfileCompleted: true,
            })
          );
        } else {
          toast({
            title: "Utilisateur non valide",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          useToast;
        }
        setIsLoading(false);
      }}
    >
      {({
        handleChange,
        setFieldValue,
        values,
        errors,
        handleBlur,
        touched,
      }) => {
        return (
          <Form as={Flex} direction="column" gap={8}>
            <Box>
              <Heading fontSize="lg" lineHeight="6">
                Personelles
              </Heading>
              <Text
                my={2}
                fontSize="sm"
                color="gray.600"
                _dark={{
                  color: "gray.400",
                }}
              >
                Veuillez remplir ce formulaire pour compléter votre profil avec
                vos informations personnelles.
              </Text>
            </Box>

            <Stack
              shadow="base"
              rounded="md"
              overflow="hidden"
              bg="#fff"
              spacing={6}
              p={6}
            >
              <FormControl>
                <FormLabel
                  fontSize="sm"
                  fontWeight="md"
                  color="gray.700"
                  mb={3}
                >
                  Photo
                </FormLabel>
                <Flex alignItems="center" gap={4}>
                  <Avatar
                    boxSize={12}
                    bg="gray.100"
                    src={imageSrc}
                    icon={
                      <Icon
                        as={FaUser}
                        boxSize={9}
                        mt={3}
                        rounded="full"
                        color="gray.300"
                      />
                    }
                  />
                  <Box as="label" cursor="pointer">
                    <ImageUpload onChange={profileImageHandler} />
                    <Button
                      as="span"
                      type="button"
                      variant="outline"
                      size="sm"
                      fontWeight="medium"
                      _focus={{ shadow: "none" }}
                    >
                      Changer
                    </Button>
                  </Box>
                </Flex>
              </FormControl>

              <SimpleGrid columns={2} spacing={6}>
                <Box>
                  <TextFormControl
                    label="Prénom"
                    autoComplete="given-name"
                    value={values?.firstName || ""}
                    name="firstName"
                    onBlur={handleBlur}
                    error={touched.firstName && errors.firstName}
                    onChange={(event) => {
                      const { value } = event.target;
                      setFieldValue("firstName", value, false);
                      memoizeDebounceFieldValue(
                        "firstName",
                        value,
                        setFieldValue
                      );
                    }}
                  />
                </Box>
                <TextFormControl
                  label="Nom"
                  autoComplete="family-name"
                  value={values?.lastName || ""}
                  name="lastName"
                  error={touched.lastName && errors.lastName}
                  onBlur={handleBlur}
                  onChange={(event) => {
                    const { value } = event.target;
                    setFieldValue("lastName", value, false);
                    memoizeDebounceFieldValue("lastName", value, setFieldValue);
                  }}
                />
              </SimpleGrid>

              <SimpleGrid columns={6} spacing={6}>
                <FormControl as={GridItem} colSpan={3}>
                  <Box>
                    <FormLabel
                      htmlFor="age"
                      fontSize="sm"
                      fontWeight="md"
                      color="gray.700"
                      mb={3}
                    >
                      Age
                    </FormLabel>
                    <Field
                      as={NumberInput}
                      isValidCharacter={(value) => {
                        const regex = /^\d+$/;
                        return regex.test(value);
                      }}
                      name="age"
                      size="sm"
                      value={values?.age}
                      min={18}
                      max={100}
                      borderColor={
                        touched.age && errors?.age ? "red.300" : "inherit"
                      }
                      focusBorderColor={
                        touched.age && errors?.age ? "red.500" : "secondary.500"
                      }
                      onChange={(value) => {
                        setFieldValue("age", +value, false);
                        memoizeDebounceFieldValue("age", +value, setFieldValue);
                      }}
                      errorBorderColor="red"
                    >
                      <NumberInputField
                        rounded="md"
                        shadow="sm"
                        _hover={{
                          borderColor:
                            touched.age && errors?.age ? "red.400" : "gray.300",
                        }}
                        _focus={{
                          _hover: {
                            borderColor:
                              touched.age && errors?.age
                                ? "red.400"
                                : "secondary.500",
                          },
                        }}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </Field>
                  </Box>
                  {touched.age && errors?.age && (
                    <Text mt={1} color="red.400" fontSize="xs">
                      {errors?.age}
                    </Text>
                  )}
                </FormControl>
                <FormControl as={GridItem} colSpan={3}>
                  <FormLabel
                    htmlFor="phone"
                    fontSize="sm"
                    fontWeight="md"
                    color="gray.700"
                    mb={3}
                  >
                    Téléphone
                  </FormLabel>
                  <InputGroup size="sm">
                    <InputLeftAddon>+216</InputLeftAddon>
                    <Field
                      as={Input}
                      type="tel"
                      name="phone"
                      id="phone"
                      autoComplete="tel"
                      borderColor={
                        touched.phone && errors?.phone ? "red.300" : "inherit"
                      }
                      focusBorderColor={
                        touched.phone && errors?.phone
                          ? "red.500"
                          : "secondary.500"
                      }
                      shadow="sm"
                      w="full"
                      rounded="md"
                      value={values.phone || ""}
                      onChange={(event) => {
                        const { value } = event.target;
                        setFieldValue("phone", value, false);
                        memoizeDebounceFieldValue(
                          "phone",
                          value,
                          setFieldValue
                        );
                      }}
                      _hover={{
                        borderColor:
                          touched.phone && errors?.phone
                            ? "red.400"
                            : "gray.300",
                      }}
                      _focus={{
                        _hover: {
                          borderColor:
                            touched.phone && errors?.phone
                              ? "red.400"
                              : "secondary.500",
                        },
                      }}
                    />
                  </InputGroup>
                  {touched.phone && errors?.phone && (
                    <Text mt={1} color="red.400" fontSize="xs">
                      {errors?.phone}
                    </Text>
                  )}
                </FormControl>
              </SimpleGrid>
              <SimpleGrid columns={3} spacing={6}>
                <TextFormControl
                  label="Adresse de la rue"
                  autoComplete="street-address"
                  value={values?.address || ""}
                  name="address"
                  error={touched.address && errors?.address}
                  onChange={(event) => {
                    const { value } = event.target;
                    setFieldValue("address", value, false);
                    memoizeDebounceFieldValue("address", value, setFieldValue);
                  }}
                />
                <TextFormControl
                  label="Ville"
                  autoComplete="home city"
                  value={values?.city || ""}
                  name="city"
                  error={touched.city && errors?.city}
                  onChange={(event) => {
                    const { value } = event.target;
                    setFieldValue("city", value, false);
                    memoizeDebounceFieldValue("city", value, setFieldValue);
                  }}
                />

                <TextFormControl
                  label="Code postal / Poste"
                  autoComplete="postal-code"
                  value={values?.zip || ""}
                  name="zip"
                  error={touched.zip && errors?.zip}
                  onChange={(event) => {
                    const { value } = event.target;
                    setFieldValue("zip", value, false);
                    memoizeDebounceFieldValue("zip", value, setFieldValue);
                  }}
                />
              </SimpleGrid>
              <FormControl>
                <FormLabel
                  fontSize="sm"
                  fontWeight="md"
                  color="gray.700"
                  mb={3}
                >
                  Description
                </FormLabel>
                <Field
                  as={Textarea}
                  name="description"
                  placeholder="Brève description de votre profil."
                  rows={3}
                  shadow="sm"
                  borderColor={
                    touched.description && errors?.description
                      ? "red.300"
                      : "inherit"
                  }
                  focusBorderColor={
                    touched.description && errors?.description
                      ? "red.500"
                      : "secondary.500"
                  }
                  fontSize="sm"
                  value={values.description || ""}
                  onChange={(event) => {
                    const { value } = event.target;
                    setFieldValue("description", value, false);
                    memoizeDebounceFieldValue(
                      "description",
                      value,
                      setFieldValue
                    );
                  }}
                  _hover={{
                    borderColor:
                      touched.description && errors?.description
                        ? "red.400"
                        : "gray.300",
                  }}
                  _focus={{
                    _hover: {
                      borderColor:
                        touched.description && errors?.description
                          ? "red.400"
                          : "secondary.500",
                    },
                  }}
                />
                {touched.description && errors?.description && (
                  <Text mt={1} color="red.400" fontSize="xs">
                    {errors?.description}
                  </Text>
                )}
              </FormControl>
            </Stack>

            <GridItem colSpan={3}>
              <Divider my="5" borderColor="gray.300" />
            </GridItem>

            <GridItem colSpan={1}>
              <Box>
                <Heading fontSize="lg" lineHeight="6">
                  Professionnelles
                </Heading>
                <Text
                  my={2}
                  fontSize="sm"
                  color="gray.600"
                  _dark={{
                    color: "gray.400",
                  }}
                >
                  Fournissez des informations détaillées sur votre expérience
                  professionnelle, y compris les dîplomes , et les certificats
                </Text>
              </Box>
            </GridItem>

            <GridItem colSpan={2}>
              <Stack
                shadow="base"
                rounded="md"
                overflow="hidden"
                px={4}
                py={5}
                bg="#fff"
                spacing={6}
                p={6}
              >
                <Flex gap={6}>
                  <FormControl as={Flex} direction="column">
                    <FormLabel
                      fontSize="sm"
                      fontWeight="md"
                      color="gray.700"
                      mb={3}
                    >
                      Hôpital
                    </FormLabel>

                    <Field
                      as={Select}
                      name="hospital"
                      size="sm"
                      variant="outline"
                      rounded="md"
                      shadow="sm"
                      onChange={handleChange}
                      borderColor={
                        touched.hospital && errors?.hospital
                          ? "red.300"
                          : "inherit"
                      }
                      focusBorderColor={
                        touched.hospital && errors?.hospital
                          ? "red.500"
                          : "secondary.500"
                      }
                      _hover={{
                        borderColor:
                          touched.hospital && errors?.hospital
                            ? "red.400"
                            : "gray.300",
                      }}
                      _focus={{
                        _hover: {
                          borderColor:
                            touched.hospital && errors?.hospital
                              ? "red.400"
                              : "secondary.500",
                        },
                      }}
                      value={values?.hospital}
                    >
                      <option value="">Selectionnez un hôpital...</option>
                      <option value="Hôpital Mongi Slim">
                        Hôpital Mongi Slim
                      </option>
                      <option value="Hôpital Charles Nicolle">
                        Hôpital Charles Nicolle
                      </option>
                      <option value="Hôpital La Rabta">Hôpital La Rabta</option>
                      <option value="Hôpital Razi">Hôpital Razi</option>
                      <option value="Hôpital Sahloul">Hôpital Sahloul</option>
                      <option value="Hôpital Farhat Hached">
                        Hôpital Farhat Hached
                      </option>
                      <option value="Hôpital Fattouma Bourguiba">
                        Hôpital Fattouma Bourguiba
                      </option>
                      <option value="Hôpital Hédi Chaker">
                        Hôpital Hédi Chaker
                      </option>
                      <option value="Hôpital Habib Bourguiba">
                        Hôpital Habib Bourguiba
                      </option>
                    </Field>
                    {touched.hospital && errors?.hospital && (
                      <Text mt={1} color="red.400" fontSize="xs">
                        {errors?.hospital}
                      </Text>
                    )}
                  </FormControl>
                  <FormControl as={Flex} direction="column">
                    <FormLabel
                      fontSize="sm"
                      fontWeight="md"
                      color="gray.700"
                      mb={3}
                    >
                      Spécialité
                    </FormLabel>
                    <Field
                      as={Select}
                      size="sm"
                      variant="outline"
                      rounded="md"
                      shadow="sm"
                      name="specialty"
                      value={values?.specialty}
                      onChange={handleChange}
                      borderColor={
                        touched.specialty && errors?.specialty
                          ? "red.300"
                          : "inherit"
                      }
                      focusBorderColor={
                        touched.specialty && errors?.specialty
                          ? "red.500"
                          : "secondary.500"
                      }
                      _hover={{
                        borderColor:
                          touched.specialty && errors?.specialty
                            ? "red.400"
                            : "gray.300",
                      }}
                      _focus={{
                        _hover: {
                          borderColor:
                            touched.specialty && errors?.specialty
                              ? "red.400"
                              : "secondary.500",
                        },
                      }}
                    >
                      <option value="Généraliste">Généraliste</option>
                      <option value="Cardiologue">Cardiologue</option>
                      <option value="Dermatologue">Dermatologue</option>
                      <option value="Endocrinologue">Endocrinologue</option>
                      <option value="Gastro-entérologue">
                        Gastro-entérologue
                      </option>
                      <option value="Neurologue">Neurologue</option>
                      <option value="Pédiatre">Pédiatre</option>
                      <option value="Psychiatre">Psychiatre</option>
                    </Field>
                  </FormControl>
                </Flex>

                <Flex gap={6}>
                  <Flex direction="column" wrap="wrap" w="100%">
                    <Text fontWeight="md" fontSize="md" color="gray.900" mb={3}>
                      Dîplomes
                    </Text>
                    <FieldArray
                      name="degrees"
                      render={({ remove, push }) => (
                        <>
                          <Stack spacing={4}>
                            {values.degrees?.map((_, index) => (
                              <Flex key={index} justifyContent="flex-end">
                                <Input
                                  name={`degrees.${index}`}
                                  placeholder="Diplôme d'État de Docteur en Médecine."
                                  type="text"
                                  focusBorderColor="secondary.500"
                                  borderRightRadius={0}
                                  shadow="sm"
                                  size="sm"
                                  w="full"
                                  rounded="md"
                                  pr={6}
                                  value={values.degrees[index] || ""}
                                  onChange={(event) => {
                                    const { value } = event.target;
                                    setFieldValue(
                                      `degrees.${index}`,
                                      value,
                                      false
                                    );
                                    memoizeDebounceFieldValue(
                                      `degrees.${index}`,
                                      value,
                                      setFieldValue
                                    );
                                  }}
                                />
                                <IconButton
                                  type="button"
                                  colorScheme="red"
                                  size="sm"
                                  icon={<CloseIcon h="10px" w="10px" />}
                                  borderLeftRadius={0}
                                  onClick={() => remove(index)}
                                />
                              </Flex>
                            ))}
                          </Stack>
                          <Box mt={values.degrees?.length > 0 ? 4 : 2}>
                            <Flex gap={2}>
                              <IconButton
                                size="xs"
                                type="button"
                                borderColor="secondary.500"
                                variant="outline"
                                isRound={true}
                                onClick={() => push("")}
                                _hover={{
                                  bg: "secondary.500",
                                  "& svg": { color: "white" },
                                }}
                                icon={<AddIcon color="secondary.500" />}
                              />
                              <Text fontSize="md" color="gray.500">
                                Ajouter un dîplome
                              </Text>
                            </Flex>
                            {errors && errors?.degrees && (
                              <Text mt={2} color="red.400" fontSize="sm">
                                {errors?.degrees}
                              </Text>
                            )}
                          </Box>
                        </>
                      )}
                    />
                  </Flex>

                  <Flex direction="column" wrap="wrap" w="100%">
                    <Text fontSize="md" color="gray.900" mb={3}>
                      Certificats
                    </Text>
                    <FieldArray
                      name="certifications"
                      render={({ remove, push }) => (
                        <>
                          <Stack spacing={4}>
                            {values?.certifications?.map((_, index) => (
                              <Flex key={index} justifyContent="flex-end">
                                <Input
                                  name={`certifications.${index}`}
                                  placeholder="Fellow du Collège américain des médecins (FACP)."
                                  type="text"
                                  focusBorderColor="secondary.500"
                                  borderRightRadius={0}
                                  shadow="sm"
                                  size="sm"
                                  w="full"
                                  rounded="md"
                                  pr={6}
                                  value={values.certifications[index] || ""}
                                  onChange={(event) => {
                                    const { value } = event.target;
                                    setFieldValue(
                                      `certifications.${index}`,
                                      value,
                                      false
                                    );
                                    memoizeDebounceFieldValue(
                                      `certifications.${index}`,
                                      value,
                                      setFieldValue
                                    );
                                  }}
                                />
                                <IconButton
                                  type="button"
                                  colorScheme="red"
                                  size="sm"
                                  icon={<CloseIcon h="10px" w="10px" />}
                                  borderLeftRadius={0}
                                  onClick={() => remove(index)}
                                />
                              </Flex>
                            ))}
                          </Stack>
                          <Box mt={values.certifications?.length > 0 ? 4 : 2}>
                            <Flex gap={2}>
                              <IconButton
                                size="xs"
                                type="button"
                                borderColor="secondary.500"
                                variant="outline"
                                isRound={true}
                                onClick={() => push("")}
                                _hover={{
                                  bg: "secondary.500",
                                  "& svg": {
                                    color: "white",
                                  },
                                }}
                                icon={<AddIcon color="secondary.500" />}
                              />
                              <Text fontSize="md" color="gray.500">
                                Ajouter une certificat
                              </Text>
                            </Flex>
                            {errors && errors?.certifications && (
                              <Text mt={2} color="red.400" fontSize="sm">
                                {errors?.certifications}
                              </Text>
                            )}
                          </Box>
                        </>
                      )}
                    />
                  </Flex>
                </Flex>
                <chakra.fieldset>
                  <Box as="legend" fontSize="md" color="gray.900" mb={3}>
                    Experience
                    <Text fontSize="sm" color="gray.500">
                      Nombre d'année d'éxperience que vous avez
                    </Text>
                  </Box>
                  <RadioGroup
                    fontSize="sm"
                    color="gray.700"
                    colorScheme="primary"
                    borderColor="primary.500"
                    value={values.experience || "Moins qu'une année"}
                    onChange={(value) => setFieldValue("experience", value)}
                  >
                    <Stack spacing={4}>
                      {["Moins qu'une année", "1 - 5 ans", "+5 ans"].map(
                        (experience) => (
                          <Radio
                            key={experience}
                            spacing={3}
                            name="experience"
                            value={experience}
                          >
                            {experience}
                          </Radio>
                        )
                      )}
                    </Stack>
                  </RadioGroup>
                </chakra.fieldset>
              </Stack>
            </GridItem>

            <GridItem colSpan={3}>
              <Divider my="5" borderColor="gray.300" />
            </GridItem>

            <GridItem colSpan={1}>
              <Box>
                <Heading fontSize="lg" lineHeight="6">
                  Horaire
                </Heading>
                <Text
                  my={2}
                  fontSize="sm"
                  color="gray.600"
                  _dark={{
                    color: "gray.400",
                  }}
                >
                  Veuillez renseigner vos disponibilités hebdomadaires en
                  indiquant les jours durant lesquels vous êtes disponible.
                </Text>
              </Box>
            </GridItem>

            <GridItem colSpan={2}>
              <Stack
                shadow="base"
                rounded="md"
                overflow="hidden"
                px={4}
                py={5}
                bg="#fff"
                spacing={6}
                p={6}
              >
                <SimpleGrid columns={6} spacing={6}>
                  <FormControl as={GridItem} colSpan={3}>
                    <FormLabel
                      htmlFor="price"
                      fontSize="sm"
                      fontWeight="md"
                      color="gray.700"
                      mb={3}
                    >
                      Prix en dt / heure
                    </FormLabel>
                    <InputGroup size="sm">
                      <Input
                        id="price"
                        placeholder="Entrer le montant"
                        type="number"
                        name="price"
                        focusBorderColor="secondary.500"
                        shadow="sm"
                        w="full"
                        rounded="md"
                        min={1}
                        max={1000}
                        value={values.price || 0}
                        onChange={(event) => {
                          const { value } = event.target;
                          setFieldValue("price", value, false);
                          memoizeDebounceFieldValue(
                            "price",
                            value,
                            setFieldValue
                          );
                        }}
                      />
                      <InputRightElement
                        pointerEvents="none"
                        color="gray.500"
                        fontSize="sm"
                        h="100%"
                      >
                        dt
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </SimpleGrid>

                <chakra.fieldset>
                  <Text mb={3} fontSize="md" color="gray.900">
                    Horaire
                  </Text>
                  <Flex flexWrap="wrap" rowGap={5} columnGap={20}>
                    {[
                      "Lundi",
                      "Mardi",
                      "Mercredi",
                      "Jeudi",
                      "Vendredi",
                      "Samedi",
                      "Dimanche",
                    ].map((day, index) => (
                      <Flex key={index} alignItems="start">
                        <Checkbox
                          type="checkbox"
                          name="schedule"
                          colorScheme="primary"
                          borderColor="primary.500"
                          rounded="md"
                          value={day}
                          isChecked={values?.schedule?.includes(day)}
                          onChange={handleChange}
                        >
                          {day}
                        </Checkbox>
                      </Flex>
                    ))}
                  </Flex>
                  {errors && errors?.schedule && (
                    <Text mt={2} color="red.400" fontSize="sm">
                      {errors?.schedule}
                    </Text>
                  )}
                </chakra.fieldset>
              </Stack>
            </GridItem>

            <GridItem colSpan={3} py={3} textAlign="right">
              <Button
                type="submit"
                colorScheme="primary"
                size="sm"
                _hover={{
                  opacity: 0.8,
                }}
              >
                Sauveguarder
              </Button>
            </GridItem>
          </Form>
        );
      }}
    </Formik>
  );
};

export default General;
