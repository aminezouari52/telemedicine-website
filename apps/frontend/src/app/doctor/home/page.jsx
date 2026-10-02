"use client";

// hooks
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useMyConsultations } from "@/hooks";

// functions
import { getDoctorPatientsCount } from "@/services/doctorService";
import { consultationsMonthlyGrowth } from "@/utils/consultation";

// components
import LoadingSpinner from "@/components/LoadingSpinner";
import Statistics from "@/features/doctor/DoctorHome/Statistics";
import Charts from "@/features/doctor/DoctorHome/Charts";
import ConsultationsTable from "@/features/doctor/DoctorHome/ConsultationsTable";

// style
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

export default function DoctorHomePage() {
  const router = useRouter();
  const user = useSelector((state) => state.userReducer.user);

  const consultationsQuery = useMyConsultations();
  const patientsCountQuery = useQuery({
    queryKey: ["doctor", "patientsCount", user?._id],
    queryFn: async () =>
      (await getDoctorPatientsCount(user._id)).data.patientsCount,
    enabled: !!user?._id,
  });

  const isPending =
    consultationsQuery.isPending || patientsCountQuery.isPending;
  const error = consultationsQuery.error || patientsCountQuery.error;
  const isError = Boolean(error);
  const data = {
    doctor: { ...user, patientsCount: patientsCountQuery.data },
    consultations: consultationsQuery.data,
  };

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
    <div className="flex flex-col gap-8 py-6 px-12">
      <div className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white shadow-sm md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-white/40">
            <AvatarImage
              src={data.doctor?.photo || "/assets/avatar-doctor.jpg"}
            />
            <AvatarFallback>DR</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">
              Hello, Dr {data.doctor?.firstName}! 👋
            </h2>
            <p className="text-sm text-white/80">
              Here&apos;s what&apos;s happening with your practice today.
            </p>
            {!user?.isProfileCompleted && (
              <Button
                variant="link"
                className="h-auto w-fit p-0 font-normal text-white underline-offset-2 hover:opacity-90"
                onClick={() => router.push("/doctor/profile")}
              >
                Complete your profile
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <Card className="border-none bg-white/15 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-white/80">Monthly growth</p>
              <p className="text-2xl font-bold text-white">
                {data.consultations?.length}
              </p>
              <div className="flex items-center gap-1 text-sm">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-200" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-200" />
                )}
                <span
                  className={isPositive ? "text-green-200" : "text-red-200"}
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
      <Charts consultations={data.consultations} />
      <ConsultationsTable consultations={data.consultations} />
    </div>
  );
}
