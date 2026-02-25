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
    <div className="flex flex-col gap-2">
      <div className="border border-gray-300 min-h-[350px] bg-white rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-primary-100">
            <tr>
              {headers?.map((header, index) => (
                <th key={index} className="px-4 py-2 text-left font-semibold">
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
                  className="px-4 py-4 text-center text-gray-500"
                >
                  This table is empty
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
