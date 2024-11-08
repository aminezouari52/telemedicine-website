// STYLED
import { Stack, Flex, Text, Select, Button } from "@chakra-ui/react";
import InputField from "@/components/InputField";
import { useFormikContext } from "formik";

const OtherInformation = ({ prevForm, nextForm }) => {
  const prevStepHandler = () => {
    prevForm();
  };

  const { values, handleChange } = useFormikContext();

  return (
    <Stack spacing={4} w="100%">
      <InputField
        type="text"
        label="Fournisseur d'assurance"
        name="provider"
        borderRadius="0px"
        labelColor="#000"
        placeholder="entrer votre fournisseur d'assurance"
        secondarycolor="secondary.500"
      />

      <Flex direction="column" gap="12px">
        <Text color="#000" ms="4px" fontWeight="normal">
          Type de plan{" "}
        </Text>
        <Select
          value={values?.type}
          name="type"
          borderRadius="0px"
          borderColor="secondary.500"
          focusBorderColor="secondary.500"
          onChange={handleChange}
        >
          <option value="HMO">HMO (Health Maintenance Organization):</option>
          <option value="EPO">EPO (Exclusive Provider Organization)</option>
          <option value="POS">POS (Point of Service):</option>
        </Select>
      </Flex>

      <InputField
        label="numéro de police"
        name="police"
        borderRadius="0px"
        labelColor="#000"
        placeholder="ABCD123456789"
        secondarycolor="secondary.500"
      />

      <InputField
        type="date"
        label="Date de l'assurance"
        name="dateInsurance"
        borderRadius="0px"
        labelColor="#000"
        secondarycolor="secondary.500"
      />

      <Flex justifyContent="end" gap={4}>
        <Button
          size="sm"
          onClick={prevStepHandler}
          variant="ghost"
          _hover={{
            opacity: 0.8,
          }}
        >
          Précédent
        </Button>
        <Button
          size="sm"
          colorScheme="secondary"
          _hover={{
            opacity: 0.8,
          }}
          onClick={() => nextForm(values)}
        >
          Enregistrer
        </Button>
      </Flex>
    </Stack>
  );
};

export default OtherInformation;
