// HOOKS
import { useState, useEffect } from "react";
import { useFormikContext } from "formik";

// COMPONENTS
import InputField from "@/components/InputField";

// STYLE
import { Flex, Button } from "@chakra-ui/react";

const ContactInfo = ({ nextForm, prevForm }) => {
  const prevStepHandler = () => {
    prevForm();
  };

  const [disableButton, setDisableButton] = useState(false);

  const { values, errors, validateForm } = useFormikContext();

  const nextFormHandler = async () => {
    const asyncErrors = await validateForm();
    if (asyncErrors.firstName || asyncErrors.lastName || asyncErrors.phone) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
      nextForm(values);
    }
  };

  useEffect(() => {
    if (errors.firstName || errors.lastName || errors.phone) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [errors]);

  return (
    <Flex w="100%" direction="column" gap={8}>
      <Flex flexDirection="column" gap={15} w="100%">
        <Flex>
          <InputField
            label="Prenom"
            name="firstName"
            placeholder="Votre prenom"
            borderRadius="0px"
            labelColor="#000"
            secondarycolor="secondary.500"
          />
          <InputField
            label="Nom"
            name="lastName"
            placeholder="Votre nom"
            borderRadius="0px"
            labelColor="#000"
            secondarycolor="secondary.500"
          />
        </Flex>
        <Flex>
          <InputField
            label="Adresse"
            name="address"
            placeholder="Votre adresse"
            borderRadius="0px"
            labelColor="#000"
            secondarycolor="secondary.500"
          />
          <InputField
            label="Téléphone"
            name="phone"
            placeholder="Votre numero de téléphone"
            borderRadius="0px"
            labelColor="#000"
            secondarycolor="secondary.500"
          />
        </Flex>
        <Flex>
          <InputField
            label="Age"
            name="age"
            placeholder="Votre age"
            borderRadius="0px"
            labelColor="#000"
            secondarycolor="secondary.500"
          />
          <InputField
            label="Poids"
            name="weight"
            placeholder="Votre poids"
            borderRadius="0px"
            labelColor="#000"
            secondarycolor="secondary.500"
          />
        </Flex>
      </Flex>

      <Flex justifyContent="end" gap={4}>
        <Button
          size="sm"
          variant="ghost"
          color="#000"
          _hover={{
            opacity: 0.8,
          }}
          onClick={prevStepHandler}
        >
          Précédent
        </Button>
        <Button
          size="sm"
          colorScheme="secondary"
          isDisabled={disableButton}
          _hover={{
            opacity: !disableButton && 0.8,
          }}
          onClick={nextFormHandler}
        >
          Enregistrer & Continuer
        </Button>
      </Flex>
    </Flex>
  );
};

export default ContactInfo;
