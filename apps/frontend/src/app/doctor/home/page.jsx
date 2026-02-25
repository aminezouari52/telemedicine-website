"use client";

// hooks
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

// functions
import { getDoctorPatientsCount } from "@/services/doctorService";
import { getDoctorConsultations } from "@/services/consultationService";
import { consultationsMonthlyGrowth } from "@/utils/consultation";

// components
import LoadingSpinner from "@/components/LoadingSpinner";
import Statistics from "@/features/doctor/DoctorHome/Statistics";
import ConsultationsTable from "@/features/doctor/DoctorHome/ConsultationsTable";

// style
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

// assets
import { useQuery } from "@tanstack/react-query";

export default function DoctorHomePage() {
  const router = useRouter();
  const user = useSelector((state) => state.userReducer.user);

  const getConsultationsQuery = async () => {
    const consultationsData = (await getDoctorConsultations(user?._id)).data;
    return consultationsData;
  };

  const getPatientsCountQuery = async () => {
    const patientsCount = (await getDoctorPatientsCount(user._id)).data
      .patientsCount;
    return patientsCount;
  };

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["doctor", "consultations"],
    queryFn: async () => {
      const consultations = await getConsultationsQuery();
      const patientsCount = await getPatientsCountQuery();
      return { doctor: { ...user, patientsCount }, consultations };
    },
  });

  if (isPending) {
    return (
      <div className="flex flex-row justify-center mt-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-row justify-center mt-10">
        Error : {error.message}
      </div>
    );
  }

  const growth = consultationsMonthlyGrowth(data.consultations);
  const isPositive = growth >= 0;

  return (
    <div className="flex flex-col gap-10 py-6 px-12">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage
              src={data.doctor?.photo || "/assets/avatar-doctor.jpg"}
            />
            <AvatarFallback>DR</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold">
              Hello, Dr {data.doctor?.firstName}!
            </h2>
            {!user?.isProfileCompleted && (
              <Button
                variant="link"
                className="text-primary-500 font-normal p-0 h-auto"
                onClick={() => router.push("/doctor/profile")}
              >
                complete your profile
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Monthly growth</p>
              <p className="text-2xl font-bold">{data.consultations?.length}</p>
              <div className="flex items-center gap-1 text-sm">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={isPositive ? "text-green-500" : "text-red-500"}
                >
                  {isPositive ? "+" : ""}
                  {growth}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Statistics doctor={data.doctor} consultations={data.consultations} />
      <ConsultationsTable consultations={data.consultations} />
    </div>
  );
}
