import StatisticsBox from "./StatisticsBox";
import { IoIosPeople } from "react-icons/io";
import { HiDocumentText } from "react-icons/hi2";
import { FaClock } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { Calendar } from "lucide-react";

const Statistics = ({ doctor, consultations }) => {
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
    <div className="flex flex-col gap-4 text-white">
      <div className="flex gap-4">
        <StatisticsBox
          title="Consultations this month"
          number={consultationsThisMonth()}
          icon={<Calendar className="text-primary-500" />}
        />
        <StatisticsBox
          title="Total number of patiens"
          number={doctor?.patientsCount}
          icon={<IoIosPeople className="text-primary-500 h-6 w-6" />}
        />
        <StatisticsBox
          title="Total number of consultations"
          number={consultations?.length}
          icon={<HiDocumentText className="text-primary-500 h-5 w-5" />}
        />
      </div>
      <div className="flex gap-4">
        <StatisticsBox
          title="Pending consultations"
          number={consultations?.filter((c) => c.status === "pending")?.length}
          icon={<FaClock className="text-orange-300 h-4 w-4" />}
        />
        <StatisticsBox
          title="Canceled consultations"
          number={consultations?.filter((c) => c.status === "canceled")?.length}
          icon={<MdCancel className="text-red-300 h-5 w-5" />}
        />
        <StatisticsBox
          title="Completed Consultations"
          number={
            consultations?.filter((c) => c.status === "completed")?.length
          }
          icon={<FaCheckCircle className="text-green-500 h-4 w-4" />}
        />
      </div>
    </div>
  );
};

export default Statistics;
