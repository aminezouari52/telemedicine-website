"use client";

// hooks
import { useState } from "react";
import { useSelector } from "react-redux";

// style
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Phone } from "lucide-react";

// functions
import { getPatientConsultations } from "@/services/consultationService";
import { DateTime } from "luxon";

// components
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// assets
import { FaMapPin } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

const ConsultationCard = ({ consultation }) => {
  return (
    <Card key={consultation?._id}>
      <CardContent className="p-0">
        <div className="flex flex-col p-4">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={consultation?.doctor?.photo} alt="Doctor" />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
            <p className="font-bold">
              {consultation?.doctor?.firstName} {consultation?.doctor?.lastName}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-gray-500">{consultation?.doctor?.phone}</span>
          </div>
          <div className="flex gap-2 items-center">
            <FaMapPin className="text-red-500" />
            <span>{consultation?.doctor?.hospital}</span>
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
};

function AllConsultationsModal({ consultations, onClose, isOpen }) {
  const sorted = [...consultations].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>All consultations</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col p-4 gap-4 overflow-y-auto">
          {sorted.map((consultation) => (
            <ConsultationCard
              key={consultation._id}
              consultation={consultation}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function PatientConsultationsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.userReducer.user);

  const getPatientConsultationsQuery = async () => {
    const consultationsData = (await getPatientConsultations(user?._id)).data;
    return consultationsData.filter((c) => c.status === "pending");
  };

  const {
    data: consultations,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["consultations"],
    queryFn: () => getPatientConsultationsQuery(),
  });

  const sortedUpcomingConsultations = () =>
    consultations?.sort((a, b) => new Date(b.date) - new Date(a.date));

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
          <div className="w-[40%] flex flex-col gap-6">
            <div className="flex items-center justify-between">
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
            {sortedUpcomingConsultations()?.length < 1 && (
              <p>You still have no consultations</p>
            )}
            {sortedUpcomingConsultations()
              ?.slice(0, 2)
              ?.map((consultation) => (
                <Card key={consultation._id}>
                  <CardContent className="p-4">
                    <div className="flex p-4 gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={
                            consultation?.doctor?.photo ||
                            "/assets/avatar-doctor.jpg"
                          }
                          alt="Doctor"
                        />
                        <AvatarFallback>DR</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="font-bold">
                          Dr. {consultation?.doctor?.firstName}{" "}
                          {consultation?.doctor?.lastName}
                        </p>
                        <p className="text-gray-500">
                          {consultation?.doctor?.specialty}
                        </p>
                        <div className="flex gap-2 items-center">
                          <FaMapPin className="text-red-500" />
                          <span>{consultation?.doctor?.hospital}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <div className="border-t border-gray-300" />
                  <CardFooter>
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-2.5">
                        <Calendar className="text-gray-500 h-4 w-4" />
                        <div className="text-xs flex flex-col">
                          <span className="text-gray-500">
                            Your consultation
                          </span>
                          <span>
                            {consultation?.date
                              ? DateTime.fromJSDate(
                                  new Date(consultation.date),
                                ).toFormat("dd-MM-yyyy 'à' HH:mm")
                              : null}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </div>
          <div className="w-[50%] flex flex-col gap-6">
            <h2 className="text-lg font-semibold">Profile</h2>
            {sortedUpcomingConsultations()?.length > 0 && (
              <Card>
                <CardContent>
                  <div className="flex justify-between pb-4 gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage
                            src="/assets/avatar-patient.png"
                            alt="Patient"
                          />
                          <AvatarFallback>PT</AvatarFallback>
                        </Avatar>
                        <p className="font-bold">
                          {sortedUpcomingConsultations()[0]?.patient?.firstName}{" "}
                          {sortedUpcomingConsultations()[0]?.patient?.lastName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapPin className="text-red-500" />
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
                              new Date(sortedUpcomingConsultations()[0]?.date),
                            ).toFormat("dd-MM-yyyy")}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="mr-2 text-gray-500">Time: </span>
                          <span>
                            {DateTime.fromJSDate(
                              new Date(sortedUpcomingConsultations()[0]?.date),
                            ).toFormat("HH:mm")}
                          </span>
                        </div>
                      </div>
                      <Calendar className="text-gray-500 h-4 w-4" />
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
            )}
          </div>
        </div>
      </div>
    </>
  );
}
