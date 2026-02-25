import { Card, CardContent } from "@/components/ui/card";

const StatisticsBox = ({ title, icon, number }) => {
  return (
    <Card className="w-[33%]">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="flex mb-4 gap-4">
            <p className="text-gray-700 text-xl font-bold">{title}</p>
            <div className="p-1">{icon}</div>
          </div>
          <p className="text-2xl font-bold">{number}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsBox;
