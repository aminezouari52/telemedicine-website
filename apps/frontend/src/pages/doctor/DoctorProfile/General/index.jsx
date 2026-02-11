// HOOKS
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useToast, useUserCheck } from "@/hooks";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// FUNCTIONS
import { updateDoctor, uploadProfilePicture } from "@/services/doctorService";
import { getCurrentUser } from "@/services/authService";
import { setUser } from "@/reducers/userReducer";
import * as Yup from "yup";

// COMPONENTS
import ImageUpload from "@/components/ImageUpload";
import TextFormControl from "./TextFormControl";

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
  const [currentUser, setCurrentUser] = useState();
  const [imageSrc, setImageSrc] = useState();

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

  const methods = useForm({
    defaultValues: {
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      age: currentUser?.age || "",
      phone: currentUser?.phone || "",
      address: currentUser?.address || "",
      city: currentUser?.city || "",
      zip: currentUser?.zip || "",
      description: currentUser?.description || "",
      hospital: currentUser?.hospital || "",
      specialty: currentUser?.specialty || "",
      degrees: currentUser?.degrees || [""],
      certifications: currentUser?.certifications || [""],
      experience: currentUser?.experience || "Less than a year",
      price: currentUser?.price || "",
      schedule: currentUser?.schedule || [],
    },
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;
  const {
    fields: degreeFields,
    append: appendDegree,
    remove: removeDegree,
  } = useFieldArray({ control, name: "degrees" });
  const {
    fields: certificationFields,
    append: appendCertification,
    remove: removeCertification,
  } = useFieldArray({ control, name: "certifications" });

  const onSubmit = async (values) => {
    console.log("Form submitted with values:", values);
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
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column" gap={8}>
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
            <FormLabel fontSize="sm" fontWeight="md" color="gray.700" mb={3}>
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
                name="firstName"
                error={errors.firstName}
                control={control}
              />
            </Box>
            <Box>
              <TextFormControl
                label="Lastname"
                autoComplete="family-name"
                name="lastName"
                error={errors.lastName}
                control={control}
              />
            </Box>
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
                <Controller
                  name="age"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      isValidCharacter={(value) => {
                        const regex = /^\d+$/;
                        return regex.test(value);
                      }}
                      size="sm"
                      min={18}
                      max={100}
                      borderColor={errors.age ? "red.300" : "inherit"}
                      focusBorderColor={
                        errors.age ? "red.500" : "secondary.500"
                      }
                      onChange={(value) => field.onChange(+value)}
                      value={field.value}
                      errorBorderColor="red"
                    >
                      <NumberInputField
                        rounded="md"
                        shadow="sm"
                        _hover={{
                          borderColor: errors.age ? "red.400" : "gray.300",
                        }}
                        _focus={{
                          _hover: {
                            borderColor: errors.age
                              ? "red.400"
                              : "secondary.500",
                          },
                        }}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  )}
                />
                {errors.age && (
                  <Text mt={1} color="red.400" fontSize="xs">
                    {errors.age.message}
                  </Text>
                )}
              </Box>
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
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="tel"
                      id="phone"
                      autoComplete="tel"
                      borderColor={errors.phone ? "red.300" : "inherit"}
                      focusBorderColor={
                        errors.phone ? "red.500" : "secondary.500"
                      }
                      shadow="sm"
                      w="full"
                      rounded="md"
                      _hover={{
                        borderColor: errors.phone ? "red.400" : "gray.300",
                      }}
                      _focus={{
                        _hover: {
                          borderColor: errors.phone
                            ? "red.400"
                            : "secondary.500",
                        },
                      }}
                      {...field}
                    />
                  )}
                />
              </InputGroup>
              {errors.phone && (
                <Text mt={1} color="red.400" fontSize="xs">
                  {errors.phone.message}
                </Text>
              )}
            </FormControl>
          </SimpleGrid>
          <SimpleGrid columns={3} spacing={6}>
            <TextFormControl
              label="Street address"
              autoComplete="street-address"
              name="address"
              error={errors.address}
              control={control}
            />
            <TextFormControl
              label="City"
              autoComplete="home city"
              name="city"
              error={errors.city}
              control={control}
            />

            <TextFormControl
              label="ZIP"
              autoComplete="postal-code"
              name="zip"
              error={errors.zip}
              control={control}
            />
          </SimpleGrid>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="md" color="gray.700" mb={3}>
              Description
            </FormLabel>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  placeholder="Brief description of your profile."
                  rows={3}
                  shadow="sm"
                  borderColor={errors.description ? "red.300" : "inherit"}
                  focusBorderColor={
                    errors.description ? "red.500" : "secondary.500"
                  }
                  fontSize="sm"
                  _hover={{
                    borderColor: errors.description ? "red.400" : "gray.300",
                  }}
                  _focus={{
                    _hover: {
                      borderColor: errors.description
                        ? "red.400"
                        : "secondary.500",
                    },
                  }}
                  {...field}
                />
              )}
            />
            {errors.description && (
              <Text mt={1} color="red.400" fontSize="xs">
                {errors.description.message}
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
              Provide detailed information about your professional experience
              including degrees, diplomas and certificates
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

                <Controller
                  name="hospital"
                  control={control}
                  render={({ field }) => (
                    <Select
                      size="sm"
                      variant="outline"
                      rounded="md"
                      shadow="sm"
                      borderColor={errors.hospital ? "red.300" : "inherit"}
                      focusBorderColor={
                        errors.hospital ? "red.500" : "secondary.500"
                      }
                      _hover={{
                        borderColor: errors.hospital ? "red.400" : "gray.300",
                      }}
                      _focus={{
                        _hover: {
                          borderColor: errors.hospital
                            ? "red.400"
                            : "secondary.500",
                        },
                      }}
                      {...field}
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
                    </Select>
                  )}
                />
                {errors.hospital && (
                  <Text mt={1} color="red.400" fontSize="xs">
                    {errors.hospital.message}
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
                <Controller
                  name="specialty"
                  control={control}
                  render={({ field }) => (
                    <Select
                      size="sm"
                      variant="outline"
                      rounded="md"
                      shadow="sm"
                      borderColor={errors.specialty ? "red.300" : "inherit"}
                      focusBorderColor={
                        errors.specialty ? "red.500" : "secondary.500"
                      }
                      _hover={{
                        borderColor: errors.specialty ? "red.400" : "gray.300",
                      }}
                      _focus={{
                        _hover: {
                          borderColor: errors.specialty
                            ? "red.400"
                            : "secondary.500",
                        },
                      }}
                      {...field}
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
                    </Select>
                  )}
                />
              </FormControl>
            </Flex>

            <Flex gap={6}>
              <Flex direction="column" wrap="wrap" w="100%">
                <Text fontWeight="md" fontSize="md" color="gray.900" mb={3}>
                  Degrees
                </Text>
                <>
                  <Stack spacing={4}>
                    {degreeFields.map((field, index) => (
                      <Flex key={field.id} justifyContent="flex-end">
                        <Controller
                          name={`degrees.${index}`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              placeholder="State Diploma of Doctor of Medicine."
                              type="text"
                              focusBorderColor="secondary.500"
                              borderRightRadius={0}
                              shadow="sm"
                              size="sm"
                              w="full"
                              rounded="md"
                              pr={6}
                              {...field}
                            />
                          )}
                        />
                        <IconButton
                          type="button"
                          colorScheme="red"
                          size="sm"
                          icon={<CloseIcon h="10px" w="10px" />}
                          borderLeftRadius={0}
                          onClick={() => removeDegree(index)}
                        />
                      </Flex>
                    ))}
                  </Stack>
                  <Box mt={degreeFields.length > 0 ? 4 : 2}>
                    <Flex gap={2}>
                      <IconButton
                        size="xs"
                        type="button"
                        borderColor="secondary.500"
                        variant="outline"
                        isRound={true}
                        onClick={() => appendDegree("")}
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
                    {errors.degrees && (
                      <Text mt={2} color="red.400" fontSize="sm">
                        {errors.degrees.message}
                      </Text>
                    )}
                  </Box>
                </>
              </Flex>

              <Flex direction="column" wrap="wrap" w="100%">
                <Text fontSize="md" color="gray.900" mb={3}>
                  Certificates
                </Text>
                <>
                  <Stack spacing={4}>
                    {certificationFields.map((field, index) => (
                      <Flex key={field.id} justifyContent="flex-end">
                        <Controller
                          name={`certifications.${index}`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              placeholder="Fellow, American College of Physicians (FACP)"
                              type="text"
                              focusBorderColor="secondary.500"
                              borderRightRadius={0}
                              shadow="sm"
                              size="sm"
                              w="full"
                              rounded="md"
                              pr={6}
                              {...field}
                            />
                          )}
                        />
                        <IconButton
                          type="button"
                          colorScheme="red"
                          size="sm"
                          icon={<CloseIcon h="10px" w="10px" />}
                          borderLeftRadius={0}
                          onClick={() => removeCertification(index)}
                        />
                      </Flex>
                    ))}
                  </Stack>
                  <Box mt={certificationFields.length > 0 ? 4 : 2}>
                    <Flex gap={2}>
                      <IconButton
                        size="xs"
                        type="button"
                        borderColor="secondary.500"
                        variant="outline"
                        isRound={true}
                        onClick={() => appendCertification("")}
                        _hover={{
                          bg: "secondary.500",
                          "& svg": { color: "white" },
                        }}
                        icon={<AddIcon color="secondary.500" />}
                      />
                      <Text fontSize="md" color="gray.500">
                        Add a certificate
                      </Text>
                    </Flex>
                    {errors.certifications && (
                      <Text mt={2} color="red.400" fontSize="sm">
                        {errors.certifications.message}
                      </Text>
                    )}
                  </Box>
                </>
              </Flex>
            </Flex>
            <chakra.fieldset>
              <Box as="legend" fontSize="md" color="gray.900" mb={3}>
                Experience
                <Text fontSize="sm" color="gray.500">
                  Number of years of experience you have
                </Text>
              </Box>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    fontSize="sm"
                    color="gray.700"
                    colorScheme="primary"
                    borderColor="primary.500"
                    value={field.value || "Less than a year"}
                    onChange={(value) => field.onChange(value)}
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
                )}
              />
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
              Please enter your weekly availability by indicating the days on
              which you are available.
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
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="price"
                        placeholder="Enter amount"
                        type="number"
                        focusBorderColor="secondary.500"
                        shadow="sm"
                        w="full"
                        rounded="md"
                        min={1}
                        max={1000}
                        {...field}
                      />
                    )}
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
                    <Controller
                      name="schedule"
                      control={control}
                      render={({ field }) => {
                        const isChecked = field.value?.includes(day);
                        return (
                          <Checkbox
                            type="checkbox"
                            colorScheme="primary"
                            borderColor="primary.500"
                            rounded="md"
                            value={day}
                            isChecked={isChecked}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...(field.value || []), day]
                                : field.value?.filter((d) => d !== day) || [];
                              field.onChange(newValue);
                            }}
                          >
                            {day}
                          </Checkbox>
                        );
                      }}
                    />
                  </Flex>
                ))}
              </Flex>
              {errors.schedule && (
                <Text mt={2} color="red.400" fontSize="sm">
                  {errors.schedule.message}
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
      </Flex>
    </form>
  );
};

export default General;
