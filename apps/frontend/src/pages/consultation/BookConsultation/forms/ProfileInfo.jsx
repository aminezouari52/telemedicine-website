// HOOKS
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";

// COMPONENTS
import InputField from "@/components/InputField";

// STYLE
import { Flex, Button } from "@chakra-ui/react";

const ProfileInfo = ({ goToNext }) => {
  const [disableButton, setDisableButton] = useState(false);

  const {
    formState: { errors },
    trigger,
    getValues,
  } = useFormContext();

  const nextFormHandler = async () => {
    const isValid = await trigger([
      "firstName",
      "lastName",
      "phone",
      "address",
      "city",
      "zip",
      "age",
    ]);

    if (!isValid) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
      const values = getValues();
      goToNext(values);
    }
  };

  useEffect(() => {
    if (
      errors.firstName ||
      errors.lastName ||
      errors.phone ||
      errors.address ||
      errors.city ||
      errors.zip ||
      errors.age
    ) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [errors]);

  return (
    <Flex w="80%" direction="column" gap={8}>
      <Flex flexDirection="column" gap={15} w="100%">
        <Flex>
          <InputField
            label="Prenom"
            name="firstName"
            placeholder="your firstname"
            borderRadius="0px"
            labelColor="#000"
            secondarycolor="secondary.500"
          />
          <InputField
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
            label="Adresse"
            name="address"
            placeholder="your address"
            borderRadius="0px"
            labelColor="#000"
            secondarycolor="secondary.500"
          />
          <InputField
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
            label="Ville"
            autoComplete="home city"
            placeholder="your city"
            name="city"
            borderRadius="0px"
            labelColor="#000"
            secondarycolor="secondary.500"
          />

          <InputField
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
            label="Age"
            type="number"
            name="age"
            placeholder="your age"
            borderRadius="0px"
            labelColor="#000"
            secondarycolor="secondary.500"
          />
          <InputField
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
          isDisabled={disableButton}
          _hover={{
            opacity: !disableButton && 0.8,
          }}
          onClick={nextFormHandler}
        >
          Save & Continue
        </Button>
      </Flex>
    </Flex>
  );
};

export default ProfileInfo;
