import { Button } from "@chakra-ui/react";

const activeStyle = {
  bg: "primary.500",
  color: "#fff",
};

const PaginationButton = (props) => {
  return (
    <Button
      size="xs"
      bg="#fff"
      color="gray.700"
      borderRadius={4}
      isDisabled={props.disabled}
      opacity={props.disabled && 0.6}
      _hover={!props.disabled && activeStyle}
      cursor={props.disabled && "not-allowed"}
      {...(props.active && activeStyle)}
      onClick={props.onClick}
      {...props}
    >
      {props.children}
    </Button>
  );
};

export default PaginationButton;
