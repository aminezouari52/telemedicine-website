"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
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
    <div className="w-full flex items-center justify-center">
      <div className="flex gap-2">
        <PaginationButton onClick={prevPage} disabled={currentPage === 0}>
          <ChevronLeft className="h-3 w-3" />
        </PaginationButton>
        {items.length > 0 && (
          <div className="flex gap-1">
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
                    <span key={index} className="inline-block px-2">
                      ...
                    </span>
                  );
                }

                return null;
              })
              .filter(Boolean)}
          </div>
        )}
        <PaginationButton
          onClick={nextPage}
          disabled={currentPage === items.length - 1}
        >
          <ChevronRight className="h-3 w-3" />
        </PaginationButton>
      </div>
    </div>
  ) : undefined;
};
