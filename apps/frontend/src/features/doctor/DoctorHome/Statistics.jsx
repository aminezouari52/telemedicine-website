import StatisticsBox from "./StatisticsBox";
import { Users } from "lucide-react";
import { FileText } from "lucide-react";
import { Clock3 } from "lucide-react";
import { CircleX } from "lucide-react";
import { CircleCheckBig } from "lucide-react";
import { Calendar } from "lucide-react";
import { DollarSign } from "lucide-react";

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

  const totalEarnings = () => {
    return consultations
      ?.filter((c) => c?.payment?.status === "paid")
      .reduce((sum, c) => sum + (c.payment.amount || 0), 0);
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
          title="Total number of patients"
          number={doctor?.patientsCount}
          icon={<Users className="text-primary-500 h-6 w-6" />}
        />
        <StatisticsBox
          title="Total number of consultations"
          number={consultations?.length}
          icon={<FileText className="text-primary-500 h-5 w-5" />}
        />
      </div>
      <div className="flex gap-4">
        <StatisticsBox
          title="Pending consultations"
          number={consultations?.filter((c) => c.status === "pending")?.length}
          icon={<Clock3 className="text-orange-300 h-4 w-4" />}
        />
        <StatisticsBox
          title="Canceled consultations"
          number={consultations?.filter((c) => c.status === "canceled")?.length}
          icon={<CircleX className="text-red-300 h-5 w-5" />}
        />
        <StatisticsBox
          title="Completed Consultations"
          number={
            consultations?.filter((c) => c.status === "completed")?.length
          }
          icon={<CircleCheckBig className="text-green-500 h-4 w-4" />}
        />
      </div>
      <div className="flex gap-4">
        <StatisticsBox
          title="Total earnings"
          number={`$${totalEarnings().toFixed(2)}`}
          icon={<DollarSign className="text-yellow-500 h-5 w-5" />}
        />
      </div>
    </div>
  );
};

export default Statistics;
