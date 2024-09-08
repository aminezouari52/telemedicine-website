// HOOKS
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";

// FUNCTIONS
import {
  updateDoctor,
  uploadProfilePicture,
} from "../../../../functions/doctor";
import { debounceFieldValue } from "../../../../utils";
import { getCurrentUser } from "../../../../functions/auth";

// PACKAGES
import { Field, FieldArray, Form, Formik } from "formik";

// COMPONENTS
import ImageUpload from "../../../../components/ImageUpload";

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
  const user = useSelector((state) => state.user.loggedInUser);
  const memoizeDebounceFieldValue = useCallback(debounceFieldValue, []);
  const [currentUser, setCurrentUser] = useState();
  const [imageSrc, setImageSrc] = useState();

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
      initialValues={{
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
        price: currentUser?.price,
        degrees: currentUser?.degrees,
        certifications: currentUser?.certifications,
        schedule: currentUser?.schedule,
        experience: currentUser?.experience,
      }}
      onSubmit={async (values) => {
        setIsLoading(true);
        const imageResponse = await uploadProfilePicture(user, imageSrc);
        updateDoctor(
          { id: user._id, token: user.token },
          { ...values, photo: imageResponse.data.url }
        );
        setIsLoading(false);
      }}
    >
      {({ handleChange, setFieldValue, values }) => {
        return (
          <Flex as={Form} direction="column" gap={8}>
            <Box>
              <Heading fontSize="lg" lineHeight="6">
                Personelles
              </Heading>
              <Text
                mt={1}
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
              py={6}
              px={6}
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
                        as={!imageSrc && FaUser}
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
                <FormControl>
                  <FormLabel
                    htmlFor="firstName"
                    fontSize="sm"
                    fontWeight="md"
                    color="gray.700"
                    mb={3}
                  >
                    Prénom
                  </FormLabel>
                  <Input
                    as={Field}
                    type="text"
                    name="firstName"
                    id="firstName"
                    autoComplete="given-name"
                    focusBorderColor="secondary.500"
                    shadow="sm"
                    size="sm"
                    w="full"
                    rounded="md"
                    value={values?.firstName || ""}
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
                </FormControl>
                <FormControl>
                  <FormLabel
                    htmlFor="lastName"
                    fontSize="sm"
                    fontWeight="md"
                    color="gray.700"
                    mb={3}
                  >
                    Nom
                  </FormLabel>
                  <Input
                    type="text"
                    name="lastName"
                    id="lastName"
                    autoComplete="family-name"
                    focusBorderColor="secondary.500"
                    shadow="sm"
                    size="sm"
                    w="full"
                    rounded="md"
                    value={values?.lastName || ""}
                    onChange={(event) => {
                      const { value } = event.target;
                      setFieldValue("lastName", value, false);
                      memoizeDebounceFieldValue(
                        "lastName",
                        value,
                        setFieldValue
                      );
                    }}
                  />
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={6} spacing={6}>
                <FormControl as={GridItem} colSpan={3}>
                  <FormLabel
                    htmlFor="age"
                    fontSize="sm"
                    fontWeight="md"
                    color="gray.700"
                    mb={3}
                  >
                    Age
                  </FormLabel>
                  <NumberInput
                    name="age"
                    size="sm"
                    value={values?.age}
                    min={1}
                    max={100}
                    focusBorderColor="secondary.500"
                    onChange={(value) => {
                      setFieldValue("age", value, false);
                      memoizeDebounceFieldValue("age", +value, setFieldValue);
                    }}
                  >
                    <NumberInputField rounded="md" shadow="sm" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
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
                    <Input
                      as={Field}
                      type="tel"
                      name="phone"
                      id="phone"
                      autoComplete="tel"
                      focusBorderColor="secondary.500"
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
                    />
                  </InputGroup>
                </FormControl>
              </SimpleGrid>
              <SimpleGrid columns={6} spacing={6}>
                <FormControl as={GridItem} colSpan={2}>
                  <FormLabel
                    htmlFor="address"
                    fontSize="sm"
                    fontWeight="md"
                    color="gray.700"
                    mb={3}
                  >
                    Adresse de la rue
                  </FormLabel>
                  <Input
                    as={Field}
                    type="text"
                    name="address"
                    id="address"
                    autoComplete="street-address"
                    focusBorderColor="secondary.500"
                    shadow="sm"
                    size="sm"
                    w="full"
                    rounded="md"
                    value={values.address || ""}
                    onChange={(event) => {
                      const { value } = event.target;
                      setFieldValue("address", value, false);
                      memoizeDebounceFieldValue(
                        "address",
                        value,
                        setFieldValue
                      );
                    }}
                  />
                </FormControl>

                <FormControl as={GridItem} colSpan={2}>
                  <FormLabel
                    htmlFor="city"
                    fontSize="sm"
                    fontWeight="md"
                    color="gray.700"
                    mb={3}
                  >
                    Ville
                  </FormLabel>
                  <Input
                    as={Field}
                    type="text"
                    name="city"
                    id="city"
                    autoComplete="city"
                    focusBorderColor="secondary.500"
                    shadow="sm"
                    size="sm"
                    w="full"
                    rounded="md"
                    value={values.city || ""}
                    onChange={(event) => {
                      const { value } = event.target;
                      setFieldValue("city", value, false);
                      memoizeDebounceFieldValue("city", value, setFieldValue);
                    }}
                  />
                </FormControl>

                <FormControl as={GridItem} colSpan={2}>
                  <FormLabel
                    htmlFor="zip"
                    fontSize="sm"
                    fontWeight="md"
                    color="gray.700"
                    mb={3}
                  >
                    Code postal / Poste
                  </FormLabel>
                  <Input
                    as={Field}
                    type="text"
                    name="zip"
                    id="zip"
                    autoComplete="postal-code"
                    focusBorderColor="secondary.500"
                    shadow="sm"
                    size="sm"
                    w="full"
                    rounded="md"
                    value={values.zip || ""}
                    onChange={(event) => {
                      const { value } = event.target;
                      setFieldValue("zip", value, false);
                      memoizeDebounceFieldValue("zip", value, setFieldValue);
                    }}
                  />
                </FormControl>
              </SimpleGrid>
              <FormControl mt={1}>
                <FormLabel
                  fontSize="sm"
                  fontWeight="md"
                  color="gray.700"
                  mb={3}
                >
                  Description
                </FormLabel>
                <Textarea
                  name="description"
                  placeholder="Brève description de votre profil."
                  rows={3}
                  shadow="sm"
                  focusBorderColor="secondary.500"
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
                />
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
                  mt={1}
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

                    <Select
                      name="hospital"
                      size="sm"
                      variant="outline"
                      focusBorderColor="secondary.500"
                      rounded="md"
                      shadow="sm"
                      onChange={handleChange}
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
                    </Select>
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
                    <Select
                      size="sm"
                      variant="outline"
                      focusBorderColor="secondary.500"
                      rounded="md"
                      shadow="sm"
                      name="specialty"
                      value={values?.specialty}
                      onChange={handleChange}
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
                    </Select>
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
                          <Flex gap={2} mt={2}>
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
                          <Flex gap={2} mt={2}>
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
                  mt={1}
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
          </Flex>
        );
      }}
    </Formik>
  );
};

export default General;
