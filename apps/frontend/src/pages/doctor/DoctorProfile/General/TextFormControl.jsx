import { useController } from "react-hook-form";
import { FormControl, FormLabel, Input, Text } from "@chakra-ui/react";

const TextFormControl = ({ control, name, label, autoComplete, error }) => {
  const { field } = useController({ control, name });
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
        type="text"
        id={name}
        autoComplete={autoComplete}
        borderColor={error ? "red.300" : "inherit"}
        focusBorderColor={error ? "red.500" : "secondary.500"}
        shadow="sm"
        size="sm"
        w="full"
        rounded="md"
        {...field}
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
