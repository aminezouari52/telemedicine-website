import { Flex } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import PaginationButton from "./PaginationButton";

export const paginate = (items) => {
  if (items && items.length > 0) {
    const itemsPerPage = 6;
    const numberOfPages = Math.ceil(items.length / itemsPerPage);
    const newItems = Array.from({ length: numberOfPages }, (_, index) => {
      const start = index * itemsPerPage;
      return items.slice(start, start + itemsPerPage);
    });
    return newItems;
  } else {
    return [];
  }
};

export const Pagination = ({
  nextPage,
  prevPage,
  currentPage,
  items,
  updatePage,
}) => {
  return items && items.length > 0 ? (
    <Flex w="full" alignItems="center" justifyContent="center">
      <Flex gap={2}>
        <PaginationButton onClick={prevPage} disabled={currentPage === 0}>
          <ArrowBackIcon h={3} w={3} />
        </PaginationButton>
        {items.map((_, index) => (
          <PaginationButton
            key={index}
            active={currentPage === index}
            onClick={() => updatePage(index)}
          >
            {index + 1}
          </PaginationButton>
        ))}
        <PaginationButton
          onClick={nextPage}
          disabled={currentPage === items.length - 1}
        >
          <ArrowForwardIcon h={3} w={3} />
        </PaginationButton>
      </Flex>
    </Flex>
  ) : undefined;
};
