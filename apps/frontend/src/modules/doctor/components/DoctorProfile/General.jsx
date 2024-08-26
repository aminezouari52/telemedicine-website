// HOOKS
import { useState } from "react";
import { useSelector } from "react-redux";

// FUNCTIONS
import {
  updateDoctor,
  uploadProfilePicture,
} from "../../../../functions/doctor";

// PACKAGES
import { Field, FieldArray, Form, Formik } from "formik";
import Resizer from "react-image-file-resizer";

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
  Spinner,
} from "@chakra-ui/react";

// ASSETS
import { FaUser } from "react-icons/fa";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";

const General = () => {
  const [imageIsLoading, setImageIsloading] = useState(false);
  const [formIsLoading, setFormIsloading] = useState(false);
  const user = useSelector((state) => state.user.loggedInUser);
  const [imageSrc, setImageSrc] = useState("");

  const profileImageHandler = (e) => {
    let image = e.target.files[0];

    // resize
    setImageIsloading(true);
    Resizer.imageFileResizer(
      image,
      720,
      720,
      "JPEG",
      100,
      0,
      async (uri) => {
        try {
          setImageSrc(uri);
          setImageIsloading(false);
        } catch (err) {
          setImageIsloading(false);
          console.log("CLOUDINARY UPLOAD ERR", err);
        }
      },
      "base64"
    );
  };

  return (
    <Formik
      initialValues={{
        photo: "",
        firstName: "",
        lastName: "",
        age: 0,
        phone: "",
        address: "",
        city: "",
        zip: 0,
        description: "",
        hospital: "",
        specialty: "Généraliste",
        price: 0,
        degrees: [],
        certifications: [],
        schedule: [],
        experience: "Moins qu'une année",
      }}
      onSubmit={async (values, setFieldValue) => {
        setFormIsloading(true);
        const imageResponse = await uploadProfilePicture(user, imageSrc);
        setFieldValue("photo", imageResponse);
        updateDoctor({ id: user._id, token: user.token }, values);
        setFormIsloading(false);
      }}
    >
      {({ handleChange, setFieldValue, values }) => {
        return (
          <SimpleGrid as={Form} display="grid" columns={3} spacing={6}>
            <GridItem colSpan={1}>
              <Box>
                <Heading fontSize="lg" lineHeight="6">
                  Profile
                </Heading>
                <Text
                  mt={1}
                  fontSize="sm"
                  color="gray.600"
                  _dark={{
                    color: "gray.400",
                  }}
                >
                  Veuillez remplir ce formulaire pour compléter votre profil
                  avec vos informations personnelles.
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
                <FormControl>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="md"
                    color="gray.700"
                    mb={3}
                  >
                    Photo
                  </FormLabel>
                  {imageIsLoading ? (
                    <Spinner
                      thickness="3px"
                      emptyColor="gray.200"
                      color="primary.500"
                      size="lg"
                    />
                  ) : (
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
                        <Input
                          type="file"
                          display="none"
                          accept="images/*"
                          onChange={profileImageHandler}
                        />
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
                  )}
                </FormControl>

                <SimpleGrid columns={6} spacing={6}>
                  <FormControl as={GridItem} colSpan={3}>
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
                    />
                  </FormControl>
                  <FormControl as={GridItem} colSpan={3}>
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
                      as={Field}
                      type="text"
                      name="lastName"
                      id="lastName"
                      autoComplete="family-name"
                      focusBorderColor="secondary.500"
                      shadow="sm"
                      size="sm"
                      w="full"
                      rounded="md"
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
                      defaultValue={1}
                      min={1}
                      max={100}
                      focusBorderColor="secondary.500"
                      onChange={(value) => {
                        setFieldValue("age", +value);
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
                    onChange={handleChange}
                    name="description"
                    placeholder="Brève description de votre profil."
                    rows={3}
                    shadow="sm"
                    focusBorderColor="secondary.500"
                    fontSize="sm"
                  />
                </FormControl>
              </Stack>
            </GridItem>

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
                <SimpleGrid columns={3} spacing={6}>
                  <FormControl as={GridItem} colSpan={[6, 4]}>
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
                </SimpleGrid>
                <SimpleGrid columns={3} spacing={6}>
                  <FormControl as={GridItem} colSpan={[6, 4]}>
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
                </SimpleGrid>

                <Flex direction="column" wrap="wrap">
                  <Text fontWeight="md" fontSize="md" color="gray.900" mb={3}>
                    Dîplomes
                  </Text>
                  <FieldArray
                    name="degrees"
                    render={({ remove, push }) => (
                      <>
                        <Stack spacing={4}>
                          {values.degrees?.map((degree, index) => (
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
                                value={degree}
                                onChange={handleChange}
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

                <Flex direction="column" wrap="wrap">
                  <Text fontSize="md" color="gray.900" mb={3}>
                    Certificats
                  </Text>
                  <FieldArray
                    name="certifications"
                    render={({ remove, push }) => (
                      <>
                        <Stack spacing={4}>
                          {values?.certifications?.map(
                            (certification, index) => (
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
                                  value={certification}
                                  onChange={handleChange}
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
                            )
                          )}
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
                    defaultValue="Moins qu'une année"
                    borderColor="primary.500"
                  >
                    <Stack spacing={4}>
                      {["Moins qu'une année", "1 - 5 ans", "+5 ans"].map(
                        (experience) => (
                          <Radio
                            key={experience}
                            spacing={3}
                            onChange={handleChange}
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
                        onChange={handleChange}
                        min={1}
                        max={1000}
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
                isLoading={formIsLoading}
                _hover={{
                  opacity: 0.8,
                }}
              >
                Sauveguarder
              </Button>
            </GridItem>
          </SimpleGrid>
        );
      }}
    </Formik>
  );
};

export default General;
