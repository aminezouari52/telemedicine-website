"use client";

// hooks
import { useSelector } from "react-redux";
import { useState } from "react";

// components
import LoadingSpinner from "@/components/LoadingSpinner";

// functions
import { getDoctorConsultations } from "@/services/consultationService";
import { DateTime } from "luxon";

// style
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Phone, Weight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";

function ConsultationCard({ consultation }) {
  return (
    <Card key={consultation?._id}>
      <CardContent className="p-0">
        <div className="flex flex-col p-4">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/assets/avatar-patient.png" alt="Patient" />
              <AvatarFallback>PT</AvatarFallback>
            </Avatar>
            <p className="font-bold">
              {consultation?.patient?.firstName}{" "}
              {consultation?.patient?.lastName}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-gray-500">
              {consultation?.patient?.phone}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <Weight className="h-4 w-4 text-gray-500" />
            <span>{consultation?.patient?.weight}kg</span>
          </div>
        </div>
        <div className="border-t border-gray-300" />
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-2.5">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div className="text-xs flex flex-col">
              <span className="text-gray-500">Your consultation</span>
              <span>
                {consultation?.date
                  ? DateTime.fromJSDate(new Date(consultation.date)).toFormat(
                      "dd-MM-yyyy 'à' HH:mm",
                    )
                  : null}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AllConsultationsModal({ consultations, onClose, isOpen }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>All consultations</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col p-4 gap-4 overflow-y-auto">
          {consultations.map((consultation, index) => (
            <ConsultationCard key={index} consultation={consultation} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function DoctorConsultationsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.userReducer.user);

  const getDoctorConsultationsQuery = async () => {
    const consultationsData = (await getDoctorConsultations(user?._id)).data;
    return consultationsData.filter((c) => c.status === "pending");
  };

  const {
    data: consultations,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["consultations"],
    queryFn: () => getDoctorConsultationsQuery(),
  });

  const sortedUpcomingConsultations = () =>
    consultations?.sort((a, b) => new Date(a.date) - new Date(b.date));

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
    <>
      <AllConsultationsModal
        consultations={consultations}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <div className="flex flex-col">
        <div className="flex justify-around py-6 px-12">
          <div className="w-[40%]">
            <div className="flex items-center justify-between py-5">
              <h2 className="text-lg font-semibold">Upcoming consultations</h2>
              {consultations?.length > 2 && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="hover:opacity-80"
                  onClick={() => setIsOpen(true)}
                >
                  See all
                </Button>
              )}
            </div>
            {!sortedUpcomingConsultations()?.length && (
              <div>You don&apos;t have any consultations</div>
            )}

            <div className="space-y-6">
              {sortedUpcomingConsultations()
                ?.slice(0, 2)
                .map((consultation, index) => (
                  <ConsultationCard key={index} consultation={consultation} />
                ))}
            </div>
          </div>

          <div className="w-[50%]">
            {sortedUpcomingConsultations()?.length !== 0 && (
              <>
                <div className="flex items-center justify-between py-5">
                  <h2 className="text-lg font-semibold">Next consultation</h2>
                </div>
                <Card>
                  <CardContent>
                    <div className="flex justify-between pb-4 gap-4">
                      <div className="flex flex-col gap-2">
                        <p className="font-bold">
                          {sortedUpcomingConsultations()[0]?.patient?.firstName}{" "}
                          {sortedUpcomingConsultations()[0]?.patient?.lastName}
                        </p>
                        <div className="flex items-center gap-2">
                          <MapPin className="text-red-500" />
                          <span>
                            {sortedUpcomingConsultations()[0]?.patient?.address}
                          </span>
                        </div>
                      </div>
                      <div className="border-l border-gray-300 ml-6" />
                      <div className="flex items-center gap-5">
                        <div className="text-xs flex flex-col">
                          <div className="flex">
                            <span className="mr-2 text-gray-500">Date: </span>
                            <span>
                              {DateTime.fromJSDate(
                                new Date(
                                  sortedUpcomingConsultations()[0]?.date,
                                ),
                              ).toFormat("dd-MM-yyyy")}
                            </span>
                          </div>
                          <div className="flex">
                            <span className="mr-2 text-gray-500">Time: </span>
                            <span>
                              {DateTime.fromJSDate(
                                new Date(
                                  sortedUpcomingConsultations()[0]?.date,
                                ),
                              ).toFormat("HH:mm")}
                            </span>
                          </div>
                        </div>
                        <Calendar className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 font-bold">Details</p>
                      <ul className="text-sm p-2 list-disc list-inside">
                        <li>
                          <strong>Phone:</strong>{" "}
                          {sortedUpcomingConsultations()[0]?.patient?.phone}
                        </li>
                        <li>
                          <strong>Age:</strong>{" "}
                          {sortedUpcomingConsultations()[0]?.patient?.age}
                        </li>
                        <li>
                          <strong>Weight: </strong>
                          {sortedUpcomingConsultations()[0]?.patient?.weight}kg
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
