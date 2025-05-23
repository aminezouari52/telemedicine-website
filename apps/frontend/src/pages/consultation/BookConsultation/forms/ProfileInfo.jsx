// COMPONENTS
import InputField from "@/components/InputField";

// STYLE
import { Flex, Button } from "@chakra-ui/react";

const ProfileInfo = ({ control, errors, goToNext }) => {
  const hasErrors = Object.keys(errors).some((key) =>
    [
      "firstName",
      "lastName",
      "phone",
      "address",
      "city",
      "zip",
      "age",
    ].includes(key),
  );

  return (
    <Flex w="80%" direction="column" gap={8}>
      <Flex flexDirection="column" gap={15} w="100%">
        <Flex>
          <InputField
            control={control}
            label="Prenom"
            name="firstName"
            placeholder="your firstname"
            borderRadius="0px"
            labelColor="#000"
            secondarycolor="secondary.500"
          />
          <InputField
            control={control}
            label="Nom"
            name="lastName"
            placeholder="your lastname"
            borderRadius="0px"
            labelColor="#000"
            secondarycolor="secondary.500"
          />
        </Flex>
        <Flex>
          <InputField
            control={control}
            label="Adresse"
            name="address"
            placeholder="your address"
            borderRadius="0px"
            labelColor="#000"
            secondarycolor="secondary.500"
          />
          <InputField
            control={control}
            label="Phone"
            name="phone"
            placeholder="your phone number"
            borderRadius="0px"
            labelColor="#000"
            secondarycolor="secondary.500"
          />
        </Flex>
        <Flex>
          <InputField
            control={control}
            label="Ville"
            autoComplete="home city"
            placeholder="your city"
            name="city"
            borderRadius="0px"
            labelColor="#000"
            secondarycolor="secondary.500"
          />
          <InputField
            control={control}
            label="Code postal / Poste"
            autoComplete="postal-code"
            name="zip"
            placeholder="your zip number"
            borderRadius="0px"
            labelColor="#000"
            secondarycolor="secondary.500"
          />
        </Flex>
        <Flex>
          <InputField
            control={control}
            label="Age"
            type="number"
            name="age"
            placeholder="your age"
            borderRadius="0px"
            labelColor="#000"
            secondarycolor="secondary.500"
          />
          <InputField
            control={control}
            label="Poids"
            name="weight"
            placeholder="your weight"
            borderRadius="0px"
            labelColor="#000"
            secondarycolor="secondary.500"
          />
        </Flex>
      </Flex>

      <Flex justifyContent="end" gap={4}>
        <Button
          size="sm"
          colorScheme="secondary"
          isDisabled={hasErrors}
          _hover={{
            opacity: !hasErrors && 0.8,
          }}
          onClick={goToNext}
        >
          Save & Continue
        </Button>
      </Flex>
    </Flex>
  );
};

export default ProfileInfo;
