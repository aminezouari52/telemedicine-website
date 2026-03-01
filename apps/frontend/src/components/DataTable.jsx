"use client";

import { paginate } from "@/components/pagination/Pagination";
import { Pagination } from "@/components/pagination";
import { useEffect, useState } from "react";

const DataTable = ({ data, renderRow, headers }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [paginatedData, setPaginatedData] = useState([]);

  const nextPageHandler = () => {
    setCurrentPage((prev) => prev + 1);
  };
  const prevPageHandler = () => {
    setCurrentPage((prev) => prev - 1);
  };

  useEffect(() => {
    setPaginatedData(paginate(data));
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      <div className="min-h-[320px] overflow-hidden rounded-lg border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 transition-colors">
                {headers?.map((header, index) => (
                  <th
                    key={index}
                    className="h-11 px-4 text-left align-middle font-medium text-muted-foreground"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData?.length > 0 &&
                paginatedData[currentPage]?.map((item, index) =>
                  renderRow(item, index),
                )}
              {!paginatedData?.length && (
                <tr>
                  <td
                    colSpan={headers?.length}
                    className="h-32 px-4 text-center text-sm text-muted-foreground"
                  >
                    No data to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        items={paginatedData}
        currentPage={currentPage}
        nextPage={nextPageHandler}
        prevPage={prevPageHandler}
        updatePage={setCurrentPage}
      />
    </div>
  );
};

export default DataTable;
