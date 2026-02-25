"use client";

// hooks
import { useParams, useRouter } from "next/navigation";

// functions
import { getDoctor } from "@/services/doctorService";

// components
import LoadingSpinner from "@/components/LoadingSpinner";

// style
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

export default function DoctorDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const getDoctorDetailsQuery = async () => {
    const response = await getDoctor(params.id);
    return response.data;
  };

  const {
    data: doctor,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["doctor", params.id],
    queryFn: () => getDoctorDetailsQuery(),
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

  return (
    <div className="flex">
      <div className="flex flex-col w-[35%] p-5 bg-white gap-6">
        <img
          src={doctor?.photo}
          alt="doctor-image"
          className="rounded-lg max-h-[400px] object-cover"
        />
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold">
              Dr, {doctor?.firstName} {doctor?.lastName}
            </h1>
            <p className="font-semibold text-primary-500 text-sm">
              {doctor?.specialty}
            </p>
          </div>

          <p>{doctor?.description}</p>
        </div>
      </div>
      <div className="p-10 w-[65%] flex flex-col gap-4">
        <div className="flex">
          <Card className="p-6 bg-white gap-5 rounded-tl-lg w-full">
            <CardContent className="p-0 space-y-5">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold">Phone</h3>
                <p>{doctor?.phone}</p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold">Email</h3>
                <p>{doctor?.email}</p>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold">Certificates</h3>
                <ul className="list-disc list-inside">
                  {doctor?.certifications?.map((certification, index) => (
                    <li key={index}>{certification}</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold">Degrees</h3>
                <ul className="list-disc list-inside">
                  {doctor?.degrees?.map((degree, index) => (
                    <li key={index}>{degree}</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold">Experience</h3>
                <p>{doctor?.experience}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6 bg-white gap-5 rounded-tr-lg w-full">
            <CardContent className="p-0 space-y-5">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold">Hospital</h3>
                <p>{doctor?.hospital}</p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold">Address</h3>
                <p>
                  {doctor?.address}, {doctor?.city} {doctor?.zip}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold">Schedule</h3>
                <p>{doctor?.schedule?.join(", ")}</p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold">Consultation price</h3>
                <p>{doctor?.price} dt/h</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button
            size="sm"
            className="hover:opacity-80"
            onClick={() => router.push(`/patient/consultation/${params.id}`)}
          >
            Book a consultation
          </Button>
        </div>
      </div>
    </div>
  );
}
