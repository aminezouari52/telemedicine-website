// STYLED
import { Button } from "../Button/Button";

import { Stack, Flex, Text, Select } from "@chakra-ui/react";
import InputField from "../InputField";
import AutoCompleteComponent from "./AutoComplete";
import { useFormikContext } from "formik";

const OtherInformation = ({ prevForm, nextForm }) => {
  const prevStepHandler = () => {
    prevForm();
  };

  const { values, handleChange, setFieldValue } = useFormikContext();

  return (
    <div style={{ width: "100%" }}>
      <Stack spacing={4}>
        <Flex direction="column" gap="12px">
          <Text color="#000" ms="4px" fontWeight="normal">
            Choisir un docteur{" "}
          </Text>
          <AutoCompleteComponent onChange={setFieldValue} />
        </Flex>

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

        <Flex justifyContent="end">
          <Button onClick={prevStepHandler} variant="ghost" color="#000">
            Précédent
          </Button>
          <Button
            color="#fff"
            _hover={{
              bg: "secondary.500",
            }}
            onClick={() => nextForm(values)}
          >
            Enregistrer
          </Button>
        </Flex>
      </Stack>
    </div>
  );
};

export default OtherInformation;
