import { Box, FormLabel, FormControl } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { useController } from "react-hook-form";

const InputField = ({
  label,
  labelColor,
  isRequired,
  labelWeight = "normal",
  ...props
}) => {
  const {
    field,
    fieldState: { error },
  } = useController(props);
  const errorMessageColor = error ? "deepRed.500" : props.secondarycolor;

  return (
    <FormControl w="100%" flexDirection="column" isRequired={isRequired}>
      <FormLabel color={labelColor} ms="4px" fontWeight={labelWeight}>
        {label}
      </FormLabel>
      <Input
        borderRadius="15px"
        borderColor={errorMessageColor}
        focusBorderColor={errorMessageColor}
        _hover={{
          borderColor: errorMessageColor,
        }}
        {...field}
        {...props}
      />
      {error ? (
        <Box mt={1} color="deepRed.500" fontSize="sm">
          {error.message}
        </Box>
      ) : null}
    </FormControl>
  );
};

export default InputField;
