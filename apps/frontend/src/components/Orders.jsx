import { CheckCircleIcon } from "@chakra-ui/icons";
import { AiFillCloseCircle } from "react-icons/ai";

import {
  Flex,
  Badge,
  Th,
  Tr,
  Td,
  TableContainer,
  Table,
  Thead,
  Icon,
  Tbody,
  Card,
  CardBody,
  Select,
  Text,
} from "@chakra-ui/react";
import moment from "moment";

const Orders = ({ orders, handleStatusChange }) => (
  <>
    {orders.map((order, i) => (
      <Card mb={4} key={i}>
        <CardBody>
          <Flex wrap="wrap" mb={4}>
            <Badge m={2} colorScheme="red">
              id: {order._id}
            </Badge>
            <Badge m={2} colorScheme="purple">
              Amount: {order.amount.toFixed(2)}dt
            </Badge>
            <Badge m={2} colorScheme="green">
              Created at:{" "}
              {moment(order.createdAt).format("MMMM Do, YYYY, HH:MM")}
            </Badge>
          </Flex>
          <TableContainer
            key={order._id}
            my={2}
            border="1px"
            borderRadius="4px"
            borderColor="gray.300"
            overflowX="auto"
            mr={2}
          >
            <Table m="0" variant="simple">
              <Thead bg="teal.50">
                <Tr>
                  <Th>Title</Th>
                  <Th>Price</Th>
                  <Th>Brand</Th>
                  <Th>Color</Th>
                  <Th>Count</Th>
                  <Th>Shipping</Th>
                </Tr>
              </Thead>
              <Tbody>
                {order?.products?.map((p, i) => (
                  <Tr key={i}>
                    <Td wordBreak="break-all">
                      <strong>{p.product?.title}</strong>
                    </Td>
                    <Td>${p.product?.price}</Td>
                    <Td>{p.product?.brand}</Td>
                    <Td>{p?.color}</Td>
                    <Td>{p?.count}</Td>
                    <Td>
                      <Flex alignItems="center">
                        {p?.product?.shipping === "Yes" ? (
                          <CheckCircleIcon color="green" />
                        ) : (
                          <Icon as={AiFillCloseCircle} color="red" />
                        )}
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          <Flex alignItems="center" justifyContent="space-between">
            <Text fontWeight="bold" mr={4}>
              Delivery Status:
            </Text>
            <Select
              onChange={(e) => handleStatusChange(order?._id, e.target.value)}
              defaultValue={order.orderStatus}
              name="status"
              mx={2}
            >
              <option value="Not Processed">Not Processed</option>
              <option value="Processing">Processing</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </Select>
          </Flex>
        </CardBody>
      </Card>
    ))}
  </>
);

export default Orders;
