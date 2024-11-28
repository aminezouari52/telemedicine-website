import { Flex, Box } from "@chakra-ui/react";
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
        {items.length > 0 && (
          <Flex gap={1}>
            {Array.from({ length: items.length })
              .map((_, index) => {
                if (
                  index === 0 ||
                  index === items.length - 1 ||
                  (index >= currentPage - 2 && index <= currentPage + 2)
                ) {
                  return (
                    <PaginationButton
                      key={index}
                      active={currentPage === index}
                      onClick={() => updatePage(index)}
                    >
                      {index + 1}
                    </PaginationButton>
                  );
                }

                if (
                  (index === currentPage - 3 && currentPage > 3) ||
                  (index === currentPage + 3 && currentPage < items.length - 4)
                ) {
                  return (
                    <Box display="inline-block" key={index}>
                      ...
                    </Box>
                  );
                }

                return null;
              })
              .filter(Boolean)}
          </Flex>
        )}
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
