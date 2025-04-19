// STYLED COMPONENTS
import { Card, CardBody, Flex, Text, Box } from "@chakra-ui/react";

const StatisticsBox = ({ title, icon, number }) => {
  return (
    <Card w="33%">
      <CardBody>
        <Flex direction="column" alignItems="center">
          <Flex mb={4} gap={4}>
            <Text color="gray.700" fontSize="xl" fontWeight="700">
              {title}
            </Text>
            <Box p={1}>{icon}</Box>
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
