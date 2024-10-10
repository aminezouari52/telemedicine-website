import { Field } from "formik";
import { FormControl, FormLabel, Input, Text } from "@chakra-ui/react";

const TextFormControl = ({
  onChange,
  name,
  label,
  value,
  autoComplete,
  error,
}) => {
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
      <Field
        as={Input}
        type="text"
        name={name}
        id={name}
        autoComplete={autoComplete}
        borderColor={error ? "red.300" : "inherit"}
        focusBorderColor={error ? "red.500" : "secondary.500"}
        shadow="sm"
        size="sm"
        w="full"
        rounded="md"
        value={value}
        onChange={onChange}
        _hover={{
          borderColor: error ? "red.400" : "gray.300",
        }}
        _focus={{
          _hover: {
            borderColor: error ? "red.400" : "secondary.500",
          },
        }}
      />
      {error && (
        <Text mt={1} color="red.400" fontSize="xs">
          {error}
        </Text>
      )}
    </FormControl>
  );
};

export default TextFormControl;
