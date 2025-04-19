import { DateTime } from "luxon";
import {
  Card,
  Flex,
  Text,
  Icon,
  Divider,
  Avatar,
  Stack,
} from "@chakra-ui/react";

// ASSETS
import { PhoneIcon } from "@chakra-ui/icons";
import { CalendarIcon } from "@chakra-ui/icons";
import { FaMapPin } from "react-icons/fa";

const ConsultationCard = ({ consultation }) => {
  return (
    <Card key={consultation?._id}>
      <Stack>
        <Stack flexDirection="column" p={4}>
          <Flex alignItems="center" gap={2}>
            <Avatar name="Patient" src={consultation?.doctor?.photo} />
            <Text fontWeight="bold">
              {consultation?.doctor?.firstName} {consultation?.doctor?.lastName}
            </Text>
          </Flex>
          <Flex gap={2} alignItems="center">
            <Icon as={PhoneIcon} color="gray.500" />
            <Text color="gray.500">{consultation?.doctor?.phone}</Text>
          </Flex>
          <Flex gap={2} alignItems="center">
            <Icon as={FaMapPin} color="red.500" />
            <Text>{consultation?.doctor?.hospital}kg</Text>
          </Flex>
        </Stack>
        <Divider borderColor="gray.300" />
        <Flex justifyContent="space-between" alignItems="center" p={4}>
          <Flex alignItems="center" gap="10px">
            <Icon as={CalendarIcon} color="gray.500" />
            <Flex fontSize="12px" flexDirection="column">
              <Text color="gray">Your consultation</Text>
              <Text>
                {consultation?.date
                  ? DateTime.fromJSDate(new Date(consultation.date)).toFormat(
                      "dd-MM-yyyy 'à' HH:mm",
                    )
                  : null}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Stack>
    </Card>
  );
};

export default ConsultationCard;
