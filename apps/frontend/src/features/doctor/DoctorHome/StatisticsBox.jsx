import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const StatisticsBox = ({ title, icon, number, accent = "primary" }) => {
  const accents = {
    primary: "bg-primary-50 text-primary-500",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-500",
    red: "bg-red-50 text-red-500",
    yellow: "bg-yellow-50 text-yellow-600",
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            accents[accent] ?? accents.primary,
          )}
        >
          {icon}
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{number}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsBox;
