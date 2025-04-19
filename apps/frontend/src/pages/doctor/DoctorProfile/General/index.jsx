// HOOKS
import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useToast, useUserCheck } from "@/hooks";

// FUNCTIONS
import { updateDoctor, uploadProfilePicture } from "@/services/doctorService";
import { debounceFieldValue } from "@/utils/helpers";
import { getCurrentUser } from "@/services/authService";
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
  const userCheck = useUserCheck();
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
      .required("First name is required")
      .max(50, "First name cannot exceed 50 characters"),
    lastName: Yup.string()
      .required("Last name is required")
      .max(50, "Last name cannot exceed 50 characters"),
    age: Yup.number()
      .required("Age is required")
      .min(18, "You must be at least 18 years old")
      .max(100, "Age cannot exceed 100 years"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]*$/, "Phone number is not valid"),
    address: Yup.string()
      .required("Address is required")
      .max(50, "Address cannot exceed 50 characters"),
    city: Yup.string()
      .required("City is required")
      .max(50, "City cannot exceed 50 characters"),
    zip: Yup.string()
      .required("Postal code is required")
      .matches(/^[0-9]+$/, "Postal code must be a number")
      .min(4, "Postal code must be at least 4 digits")
      .max(5, "Postal code cannot exceed 5 digits"),
    description: Yup.string()
      .required("Description is required")
      .max(500, "Description cannot exceed 500 characters"),
    hospital: Yup.string()
      .oneOf(
        [
          "Hospital Mongi Slim",
          "Hospital Charles Nicolle",
          "Hospital La Rabta",
          "Hospital Razi",
          "Hospital Sahloul",
          "Hospital Farhat Hached",
          "Hospital Fattouma Bourguiba",
          "Hospital Hédi Chaker",
          "Hospital Habib Bourguiba",
        ],
        "Selected hospital is not valid",
      )
      .required("Hospital is required"),
    specialty: Yup.string()
      .oneOf(
        [
          "Generalist",
          "Cardiologist",
          "Dermatologist",
          "Endocrinologist",
          "Gastroenterologist",
          "Neurologist",
          "Pediatrician",
          "Psychiatrist",
        ],
        "Selected specialty is not valid",
      )
      .required("Specialty is required"),
    degrees: Yup.array()
      .of(Yup.string())
      .min(1, "Add at least one degree")
      .max(10, "Maximum 10 degrees"),
    certifications: Yup.array()
      .of(Yup.string())
      .min(1, "Choose at least one certificate")
      .max(10, "Maximum 10 certificates"),
    price: Yup.number()
      .required("Price is required")
      .min(0, "Price cannot be negative")
      .max(1000, "Price must not exceed 1000dt/hr"),
    schedule: Yup.array().of(Yup.string()).min(1, "Choose at least one day"),
  });

  const profileImageHandler = (uri) => {
    setIsLoading(true);
    setImageSrc(uri);
    setIsLoading(false);
  };

  useEffect(() => {
    const getUser = async () => {
      userCheck(async (token) => {
        const res = await getCurrentUser(token);
        setCurrentUser(res.data);
      });
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
          toast("Image is not valid", "error");
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
            },
          );
          dispatch(
            setUser({
              ...user,
              isProfileCompleted: true,
            }),
          );
        } else {
          toast("User is not valid", "error");
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
                Please fill out this form to complete your profile with your
                personal information.
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
                      Change
                    </Button>
                  </Box>
                </Flex>
              </FormControl>

              <SimpleGrid columns={2} spacing={6}>
                <Box>
                  <TextFormControl
                    label="Firstname"
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
                        setFieldValue,
                      );
                    }}
                  />
                </Box>
                <TextFormControl
                  label="Lastname"
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
                    Phone number
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
                          setFieldValue,
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
                  label="Street address"
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
                  label="City"
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
                  label="ZIP"
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
                  placeholder="Brief description of your profile."
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
                      setFieldValue,
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
                  Professionals
                </Heading>
                <Text
                  my={2}
                  fontSize="sm"
                  color="gray.600"
                  _dark={{
                    color: "gray.400",
                  }}
                >
                  Provide detailed information about your professional
                  experience including degrees, diplomas and certificates
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
                      Hospital
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
                      <option value="">Select a hospital...</option>
                      <option value="Hospital Mongi Slim">
                        Hospital Mongi Slim
                      </option>
                      <option value="Hospital Charles Nicolle">
                        Hospital Charles Nicolle
                      </option>
                      <option value="Hospital La Rabta">
                        Hospital La Rabta
                      </option>
                      <option value="Hospital Razi">Hospital Razi</option>
                      <option value="Hospital Sahloul">Hospital Sahloul</option>
                      <option value="Hospital Farhat Hached">
                        Hospital Farhat Hached
                      </option>
                      <option value="Hospital Fattouma Bourguiba">
                        Hospital Fattouma Bourguiba
                      </option>
                      <option value="Hospital Hédi Chaker">
                        Hospital Hédi Chaker
                      </option>
                      <option value="Hospital Habib Bourguiba">
                        Hospital Habib Bourguiba
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
                      Speciality
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
                      <option value="Generalist">Generalist</option>
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Dermatologist">Dermatologist</option>
                      <option value="Endocrinologist">Endocrinologist</option>
                      <option value="Gastroenterologist">
                        Gastroenterologist
                      </option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Pediatrician">Pediatrician</option>
                      <option value="Psychiatrist">Psychiatrist</option>
                    </Field>
                  </FormControl>
                </Flex>

                <Flex gap={6}>
                  <Flex direction="column" wrap="wrap" w="100%">
                    <Text fontWeight="md" fontSize="md" color="gray.900" mb={3}>
                      Degrees
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
                                  placeholder="State Diploma of Doctor of Medicine."
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
                                      false,
                                    );
                                    memoizeDebounceFieldValue(
                                      `degrees.${index}`,
                                      value,
                                      setFieldValue,
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
                                Add a degree
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
                      Certificates
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
                                  placeholder="Fellow, American College of Physicians (FACP)"
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
                                      false,
                                    );
                                    memoizeDebounceFieldValue(
                                      `certifications.${index}`,
                                      value,
                                      setFieldValue,
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
                                Add a certificate
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
                      Number of years of experience you have
                    </Text>
                  </Box>
                  <RadioGroup
                    fontSize="sm"
                    color="gray.700"
                    colorScheme="primary"
                    borderColor="primary.500"
                    value={values.experience || "Less than a year"}
                    onChange={(value) => setFieldValue("experience", value)}
                  >
                    <Stack spacing={4}>
                      {["Less than a year", "1 - 5 years", "+5 years"].map(
                        (experience) => (
                          <Radio
                            key={experience}
                            spacing={3}
                            name="experience"
                            value={experience}
                          >
                            {experience}
                          </Radio>
                        ),
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
                  Schedule
                </Heading>
                <Text
                  my={2}
                  fontSize="sm"
                  color="gray.600"
                  _dark={{
                    color: "gray.400",
                  }}
                >
                  Please enter your weekly availability by indicating the days
                  on which you are available.
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
                      Price in dt / hour
                    </FormLabel>
                    <InputGroup size="sm">
                      <Input
                        id="price"
                        placeholder="Enter amount"
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
                            setFieldValue,
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
                    Schedule
                  </Text>
                  <Flex flexWrap="wrap" rowGap={5} columnGap={20}>
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
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
                Save
              </Button>
            </GridItem>
          </Form>
        );
      }}
    </Formik>
  );
};

export default General;
