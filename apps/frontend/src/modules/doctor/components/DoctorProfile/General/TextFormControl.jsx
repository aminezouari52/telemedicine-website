import { Field } from "formik";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";

const TextFormControl = ({ onChange, name, label, value, autoComplete }) => {
  return (
    <FormControl>
      <FormLabel
        htmlFor={name}
        fontSize="sm"
        fontWeight="md"
        color="gray.700"
        mb={3}
      >
        {label}
      </FormLabel>
      <Input
        as={Field}
        type="text"
        name={name}
        id={name}
        autoComplete={autoComplete}
        focusBorderColor="secondary.500"
        shadow="sm"
        size="sm"
        w="full"
        rounded="md"
        value={value}
        onChange={onChange}
      />
    </FormControl>
  );
};

export default TextFormControl;
