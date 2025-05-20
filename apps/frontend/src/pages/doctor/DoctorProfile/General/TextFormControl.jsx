import { Controller } from "react-hook-form";
import { FormControl, FormLabel, Input, Text } from "@chakra-ui/react";

const TextFormControl = ({
  control,
  name,
  label,
  autoComplete,
  type = "text",
  placeholder,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error, isTouched } }) => (
        <FormControl isInvalid={error && isTouched}>
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
            {...field}
            type={type}
            id={name}
            placeholder={placeholder}
            autoComplete={autoComplete}
            borderColor={error ? "red.300" : "inherit"}
            focusBorderColor={error ? "red.500" : "secondary.500"}
            shadow="sm"
            size="sm"
            w="full"
            rounded="md"
            value={field.value || ""}
            onChange={(e) => {
              const value =
                type === "number"
                  ? parseFloat(e.target.value) || ""
                  : e.target.value;
              field.onChange(value);
            }}
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
              {error.message}
            </Text>
          )}
        </FormControl>
      )}
    />
  );
};

export default TextFormControl;
