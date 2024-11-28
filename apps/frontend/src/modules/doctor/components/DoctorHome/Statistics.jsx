import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDoctorPatientsCount } from "@/modules/doctor/functions/doctor";
import { getDoctorConsultations } from "@/modules/consultation/functions/consultation";
import { Flex, Icon } from "@chakra-ui/react";
import StatisticsBox from "./StatisticsBox";
import { IoIosPeople } from "react-icons/io";
import { HiDocumentText } from "react-icons/hi2";
import { FaClock } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { CalendarIcon } from "@chakra-ui/icons";

const Statistics = () => {
  const [doctor, setDoctor] = useState();
  const [consultations, setConsultations] = useState([]);
  const user = useSelector((state) => state.userReducer.user);

  const loadConsultations = async () => {
    const consultationsData = (await getDoctorConsultations(user?._id)).data;
    setConsultations(consultationsData);
  };

  const loadDoctor = async () => {
    const patientsCount = (await getDoctorPatientsCount(user._id)).data
      .patientsCount;
    setDoctor({ ...user, patientsCount });
  };

  useEffect(() => {
    if (user) {
      loadDoctor(user);
      loadConsultations(user);
    }
  }, [user]);

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
          title="Consultations ce mois"
          number={consultationsThisMonth()}
          icon={<CalendarIcon color="primary.500" />}
        />
        <StatisticsBox
          title="Nombre total des patiens"
          number={doctor?.patientsCount}
          icon={<Icon color="primary.500" h={6} w={6} as={IoIosPeople} />}
        />
        <StatisticsBox
          title="Nombre total des Consultations"
          number={consultations?.length}
          icon={<Icon color="primary.500" h={5} w={5} as={HiDocumentText} />}
        />
      </Flex>
      <Flex gap={4}>
        <StatisticsBox
          title="Consultations en attente"
          number={consultations?.filter((c) => c.status === "pending")?.length}
          icon={<Icon as={FaClock} color="orange.300" h={4} w={4} />}
        />
        <StatisticsBox
          title="Consultations annulé"
          number={consultations?.filter((c) => c.status === "canceled")?.length}
          icon={<Icon as={MdCancel} color="red.300" h={5} w={5} />}
        />
        <StatisticsBox
          title="Consultations complète"
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
