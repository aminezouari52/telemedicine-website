import {
  Flex,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Text,
} from "@chakra-ui/react";
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
    <Flex direction="column" gap={2}>
      <TableContainer
        border="1px"
        borderColor="gray.300"
        minHeight="350px"
        bg="#fff"
      >
        <Table variant="simple">
          <Thead bg="primary.100">
            <Tr>
              {headers?.map((header, index) => (
                <Th key={index}>{header}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {paginatedData?.length > 0 &&
              paginatedData[currentPage]?.map((item, index) =>
                renderRow(item, index)
              )}
            <Text m={4}>{!paginatedData?.length && "This table is empty"}</Text>
          </Tbody>
        </Table>
      </TableContainer>

      <Pagination
        items={paginatedData}
        currentPage={currentPage}
        nextPage={nextPageHandler}
        prevPage={prevPageHandler}
        updatePage={setCurrentPage}
      />
    </Flex>
  );
};

export default DataTable;
