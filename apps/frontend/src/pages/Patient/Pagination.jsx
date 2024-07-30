import { Button, chakra, Flex, Icon } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

export const paginate = (items) => {
  const itemsPerPage = 6;
  const numberOfPages = Math.ceil(items.length / itemsPerPage);
  const newItems = Array.from({ length: numberOfPages }, (_, index) => {
    const start = index * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  });

  return newItems;
};

const PagButton = (props) => {
  const activeStyle = {
    bg: "primary.500",
    color: "#fff",
    // borderRadius: "lg",
  };
  return (
    <Button
      px={4}
      py={2}
      size="sm"
      bg="#fff"
      color="gray.700"
      borderRadius={0}
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

const Pagination = ({
  nextPage,
  prevPage,
  currentPage,
  doctors,
  updatePage,
}) => {
  return (
    <Flex w="full" alignItems="center" justifyContent="center">
      <Flex
        borderLeftRadius="lg"
        borderRightRadius="lg"
        border="1px"
        borderColor="gray.400"
      >
        <PagButton
          borderLeftRadius="lg"
          onClick={prevPage}
          disabled={currentPage === 0}
        >
          <ArrowBackIcon />
        </PagButton>
        {doctors.map((_, index) => (
          <PagButton
            key={index}
            active={currentPage === index}
            onClick={() => updatePage(index)}
          >
            {index + 1}
          </PagButton>
        ))}
        <PagButton
          onClick={nextPage}
          disabled={currentPage === doctors.length - 1}
          borderRightRadius="lg"
        >
          <ArrowForwardIcon />
        </PagButton>
      </Flex>
    </Flex>
  );
};

export default Pagination;
