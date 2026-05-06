"use client";

// style
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// assets
import {
  ArrowUpRight,
  HandHeart,
  Hospital,
  BriefcaseMedical,
} from "lucide-react";

import { useRouter } from "next/navigation";

export default function PatientHomePage() {
  const router = useRouter();

  return (
    <div className="w-full bg-white">
      <div className="flex items-center justify-around flex-col">
        <div className="flex justify-around">
          <div className="flex flex-col justify-center gap-2.5">
            <h1 className="text-5xl p-6">
              Our
              <span className="text-primary-500"> doctors </span>
              and therapists are here,{" "}
              <span className="text-primary-500">24/7</span>.
            </h1>
            <p className="font-semibold p-6">
              Don&apos;t wait to start feeling better. Connect with a certified
              physician in minutes. Book an appointment anywhere.
            </p>

            <div className="p-6">
              <Button
                className="hover:opacity-80"
                onClick={() => router.push("/patient/doctors")}
              >
                Book a consultation!
                <ArrowUpRight className="ml-2 h-6 w-6" />
              </Button>
            </div>
          </div>

          <Image
            className="m-6 w-[70%] h-[600px] object-cover"
            src="https://res.cloudinary.com/dfzx2pdi3/image/upload/v1739200306/patient-home_ebcahl.jpg"
            alt="patient home"
            width={800}
            height={600}
          />
        </div>
        <div className="flex justify-between p-6 gap-2.5 w-full">
          <Card className="w-[30%] border border-gray-400 p-4 bg-white">
            <CardContent className="p-0">
              <div className="flex justify-center">
                <Hospital className="w-[70px] h-[50px] text-primary-500 px-2.5" />
              </div>

              <div>
                <h2 className="text-xl font-semibold">Find a doctor</h2>
                <p className="text-sm py-2">
                  We recruit the best specialists to offer you a first-rate
                  first-rate diagnostic service.
                </p>
                <Button
                  variant="link"
                  className="text-primary-500 p-0 h-auto"
                  onClick={() => router.push("/patient/doctors")}
                >
                  Find a doctor.
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="w-[30%] border border-gray-400 p-4 bg-white">
            <CardContent className="p-0">
              <div className="flex justify-center">
                <HandHeart className="w-[65px] h-[50px] text-primary-500 px-2.5" />
              </div>

              <div>
                <h2 className="text-xl font-semibold">Book a consultation</h2>
                <p className="text-sm py-2">
                  Connect with a specialist in just a few minutes and receive
                  the care you need.
                </p>
                <Button
                  variant="link"
                  className="text-primary-500 p-0 h-auto"
                  onClick={() => router.push("/patient/doctors")}
                >
                  Book now.
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="w-[30%] border border-gray-400 p-4 bg-white">
            <CardContent className="p-0">
              <div className="flex justify-center">
                <BriefcaseMedical className="w-[70px] h-[50px] text-primary-500 px-2.5" />
              </div>

              <div>
                <h2 className="text-xl font-semibold">See my Consultations</h2>
                <p className="text-sm py-2">
                  View the history of your past and future medical appointments.
                  appointments.
                </p>
                <Button
                  variant="link"
                  className="text-primary-500 p-0 h-auto"
                  onClick={() => router.push("/patient/consultations")}
                >
                  My consultations.
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
