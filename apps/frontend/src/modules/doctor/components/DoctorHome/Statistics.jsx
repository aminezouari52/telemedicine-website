import { Flex, Icon } from "@chakra-ui/react";
import StatisticsBox from "./StatisticsBox";
import { IoIosPeople } from "react-icons/io";
import { HiDocumentText } from "react-icons/hi2";
import { FaClock } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { CalendarIcon } from "@chakra-ui/icons";

const Statistics = ({doctor, consultations}) => {
  const consultationsThisMonth = () => {
    return consultations?.filter((consultation) => {
      const date = new Date(consultation.date);
      const now = new Date();
      return (
        consultation.status === "pending" &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })?.length;
  };

  return (
    <Flex direction="column" gap={4} color="white">
      <Flex gap={4}>
        <StatisticsBox
          title="Consultations this month"
          number={consultationsThisMonth()}
          icon={<CalendarIcon color="primary.500" />}
        />
        <StatisticsBox
          title="Total number of patiens"
          number={doctor?.patientsCount}
          icon={<Icon color="primary.500" h={6} w={6} as={IoIosPeople} />}
        />
        <StatisticsBox
          title="Total number of consultations"
          number={consultations?.length}
          icon={<Icon color="primary.500" h={5} w={5} as={HiDocumentText} />}
        />
      </Flex>
      <Flex gap={4}>
        <StatisticsBox
          title="Pending consultations"
          number={consultations?.filter((c) => c.status === "pending")?.length}
          icon={<Icon as={FaClock} color="orange.300" h={4} w={4} />}
        />
        <StatisticsBox
          title="Canceled consultations"
          number={consultations?.filter((c) => c.status === "canceled")?.length}
          icon={<Icon as={MdCancel} color="red.300" h={5} w={5} />}
        />
        <StatisticsBox
          title="Completed Consultations"
          number={
            consultations?.filter((c) => c.status === "completed")?.length
          }
          icon={<Icon as={FaCheckCircle} color="green.500" h={4} w={4} />}
        />
      </Flex>
    </Flex>
  );
};

export default Statistics;
