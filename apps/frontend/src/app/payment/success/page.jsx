"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { confirmPayment } from "@/services/paymentService";
import LoadingSpinner from "@/components/LoadingSpinner";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    if (!sessionId) {
      router.push("/patient/consultations");
      return;
    }

    confirmPayment(sessionId)
      .then((res) => {
        if (res.data.status === "paid") {
          setStatus("success");
          setTimeout(() => router.push("/patient/consultations"), 3000);
        } else {
          setStatus("failed");
        }
      })
      .catch(() => {
        setStatus("failed");
      });
  }, [sessionId, router]);

  if (!sessionId) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-10">
      {status === "processing" && (
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner />
          <p className="text-gray-600 text-lg">Confirming your payment...</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Payment successful!
          </h1>
          <p className="text-gray-600">
            Your consultation has been booked. Redirecting to your
            consultations...
          </p>
        </div>
      )}

      {status === "failed" && (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Payment failed</h1>
          <p className="text-gray-600">
            Something went wrong with your payment. Please try again.
          </p>
          <button
            onClick={() => router.push("/patient/doctors")}
            className="text-primary-500 underline"
          >
            Go back to doctors
          </button>
        </div>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-10">
          <LoadingSpinner />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
