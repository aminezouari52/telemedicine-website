import StatisticsBox from "./StatisticsBox";
import {
  Users,
  FileText,
  Clock3,
  CircleX,
  CircleCheckBig,
  Calendar,
  DollarSign,
} from "lucide-react";

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

  const countByStatus = (status) =>
    consultations?.filter((c) => c.status === status)?.length;

  const boxes = [
    {
      title: "Consultations this month",
      number: consultationsThisMonth(),
      icon: <Calendar className="h-6 w-6" />,
      accent: "primary",
    },
    {
      title: "Total patients",
      number: doctor?.patientsCount,
      icon: <Users className="h-6 w-6" />,
      accent: "primary",
    },
    {
      title: "Total consultations",
      number: consultations?.length,
      icon: <FileText className="h-6 w-6" />,
      accent: "primary",
    },
    {
      title: "Pending consultations",
      number: countByStatus("pending"),
      icon: <Clock3 className="h-6 w-6" />,
      accent: "orange",
    },
    {
      title: "Canceled consultations",
      number: countByStatus("canceled"),
      icon: <CircleX className="h-6 w-6" />,
      accent: "red",
    },
    {
      title: "Completed consultations",
      number: countByStatus("completed"),
      icon: <CircleCheckBig className="h-6 w-6" />,
      accent: "green",
    },
    {
      title: "Total earnings",
      number: `$${(totalEarnings() ?? 0).toFixed(2)}`,
      icon: <DollarSign className="h-6 w-6" />,
      accent: "yellow",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {boxes.map((box) => (
        <StatisticsBox
          key={box.title}
          title={box.title}
          number={box.number}
          icon={box.icon}
          accent={box.accent}
        />
      ))}
    </div>
  );
};

export default Statistics;
