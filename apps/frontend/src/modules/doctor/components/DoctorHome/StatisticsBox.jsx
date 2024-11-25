// STYLED COMPONENTS
import { Card, CardBody, Flex, Text } from "@chakra-ui/react";

const StatisticsBox = ({ title, icon, number }) => {
  return (
    <Card minWidth="200px">
      <CardBody>
        <Flex direction="column" alignItems="center">
          <Flex mb={4}>
            <Text color="gray.700" fontSize="xl" fontWeight="700" mr={4}>
              {title}
            </Text>
            {icon}
          </Flex>
          <Text fontSize="2xl" fontWeight="700">
            {number}
          </Text>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default StatisticsBox;
