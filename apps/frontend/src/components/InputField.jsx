import { Box, FormLabel, FormControl, Input } from "@chakra-ui/react";
import { Controller } from "react-hook-form";

const InputField = ({
  label,
  labelColor,
  isRequired,
  labelWeight = "normal",
  control,
  name,
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error, touched } }) => (
        <FormControl w="100%" flexDirection="column" isRequired={isRequired}>
          <FormLabel color={labelColor} ms="4px" fontWeight={labelWeight}>
            {label}
          </FormLabel>
          <Input
            borderRadius="15px"
            borderColor={
              touched && error ? "deepRed.500" : props.secondarycolor
            }
            focusBorderColor={
              touched && error ? "deepRed.500" : props.secondarycolor
            }
            _hover={{
              borderColor:
                touched && error ? "deepRed.500" : props.secondarycolor,
            }}
            {...field}
            {...props}
          />
          {touched && error ? (
            <Box mt={1} color="deepRed.500" fontSize="sm">
              {error.message}
            </Box>
          ) : null}
        </FormControl>
      )}
    />
  );
};

export default InputField;
