"use client";

// hooks
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// functions
import { createConsultation } from "@/services/consultationService";
import { updatePatient } from "@/services/patientService";
import { getDoctor } from "@/services/doctorService";
import { setUser } from "@/reducers/userReducer";

// components
import VerifyData from "./VerifyData";
import DateStep from "./DateStep";
import ProfileInfo from "./ProfileInfo";
import { Form } from "@/components/ui/form";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Stepper } from "@/components/ui/stepper";

// style
import { useQuery } from "@tanstack/react-query";

const steps = [{ title: "Profile information" }, { title: "Date and Time" }];

const consultationSchema = z.object({
  date: z.date({ required_error: "Date is required" }),
  firstName: z.string().min(1, "Firstname is required").trim(),
  lastName: z.string().min(1, "Lastname is required").trim(),
  age: z
    .number()
    .min(18, "You must be at least 18 years old")
    .max(100, "Age cannot exceed 100 years"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .trim()
    .regex(/^[0-9]*$/, "The phone number is not valid"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(50, "The address cannot exceed 50 characters."),
  city: z
    .string()
    .min(1, "City is required")
    .max(50, "City cannot exceed 50 characters"),
  zip: z
    .string()
    .min(1, "ZIP is required")
    .regex(/^[0-9]+$/, "ZIP must be a number")
    .min(4, "ZIP must be at least 4 digits long")
    .max(5, "ZIP cannot exceed 5 digits"),
  weight: z.string().optional(),
  patient: z.string(),
  doctor: z.string(),
  isProfileCompleted: z.boolean(),
});

export default function BookConsultationPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.user);
  const [activeStep, setActiveStep] = useState(0);
  const params = useParams();

  const form = useForm({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      date: new Date(),
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      address: user?.address ?? "",
      phone: user?.phone ?? "",
      age: user?.age ?? 0,
      city: user?.city ?? "",
      zip: user?.zip ?? "",
      weight: user?.weight ?? "",
      patient: user?._id,
      doctor: params?.id,
      isProfileCompleted: true,
    },
  });

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

  const goToNext = () => {
    if (activeStep < steps.length) {
      setActiveStep(activeStep + 1);
    }
  };

  const goToPrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const resetHandler = () => {
    setActiveStep(0);
    form.reset();
  };

  useEffect(() => {
    if (user?.isProfileCompleted) {
      setActiveStep(1);
    }
  }, [user]);

  useEffect(() => {
    form.reset({
      date: new Date(),
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      address: user?.address ?? "",
      phone: user?.phone ?? "",
      age: user?.age ?? 0,
      city: user?.city ?? "",
      zip: user?.zip ?? "",
      weight: user?.weight ?? "",
      patient: user?._id,
      doctor: params?.id,
      isProfileCompleted: true,
    });
  }, [user, params.id]);

  const onSubmit = async (values) => {
    const { date, patient, doctor, ...resValues } = values;
    await updatePatient({ id: user._id, token: user.token }, resValues);
    await createConsultation({ date, patient, doctor });
    dispatch(
      setUser({
        ...user,
        ...resValues,
      }),
    );
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

  return (
    <div className="flex flex-col bg-white p-10 w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stepper activeStep={activeStep} steps={steps} />
          <div className="flex justify-between gap-10">
            <div className="flex flex-col w-[35%] gap-4">
              <h3 className="text-sm font-semibold">Consultation with</h3>
              <div className="flex flex-col bg-white w-full">
                <img
                  src={doctor?.photo}
                  alt="doctor-image"
                  className="rounded-lg max-h-[400px] object-cover"
                />
                <div className="py-8 max-w-xl">
                  <h2 className="text-2xl text-gray-800 font-bold">
                    <span className="text-primary-500">Dr.</span>{" "}
                    {doctor?.firstName} {doctor?.lastName}
                  </h2>
                  <p className="mt-4 text-gray-600">{doctor?.description}</p>
                </div>
              </div>
            </div>
            <div className="w-[90%] flex justify-center">
              {activeStep === 0 ? (
                <ProfileInfo
                  goToNext={goToNext}
                  goToPrevious={goToPrevious}
                  form={form}
                />
              ) : (
                activeStep === 1 && (
                  <DateStep
                    goToNext={goToNext}
                    goToPrevious={goToPrevious}
                    form={form}
                  />
                )
              )}
            </div>
          </div>
          <VerifyData
            isOpen={activeStep === steps.length}
            onClose={resetHandler}
          />
        </form>
      </Form>
    </div>
  );
}
