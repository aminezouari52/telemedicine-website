import { Button } from "@chakra-ui/react";

const activeStyle = {
  bg: "primary.500",
  color: "#fff",
};

const PaginationButton = (props) => {
  return (
    <Button
      size="xs"
      bg={!props.active ? "#fff" : "primary.500"}
      color={!props.active ? "#gray.700" : "#fff"}
      borderRadius={4}
      isDisabled={props.disabled}
      opacity={props.disabled && 0.6}
      _hover={!props.disabled && activeStyle}
      cursor={props.disabled && "not-allowed"}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
};

export default PaginationButton;
