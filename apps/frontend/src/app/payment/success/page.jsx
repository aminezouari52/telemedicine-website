"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { confirmPayment } from "@/services/paymentService";
import LoadingSpinner from "@/components/LoadingSpinner";

function getErrorStatus(error) {
  return error?.response?.status;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const { isSuccess, isPending, isError, failureReason, error } = useQuery({
    queryKey: ["confirm-payment", sessionId],
    queryFn: async () => {
      const res = await confirmPayment(sessionId);
      if (res.data?.status !== "paid") {
        const unpaid = new Error("Payment has not been completed");
        unpaid.response = { status: 402 };
        throw unpaid;
      }
      return res.data;
    },
    enabled: !!sessionId,
    retry: (failureCount, err) => {
      if (getErrorStatus(err) === 402) return false;
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 4000),
  });

  useEffect(() => {
    if (!sessionId) {
      router.push("/patient/consultations");
    }
  }, [sessionId, router]);

  useEffect(() => {
    if (!isSuccess) return undefined;
    const timeoutId = setTimeout(
      () => router.push("/patient/consultations"),
      3000,
    );
    return () => clearTimeout(timeoutId);
  }, [isSuccess, router]);

  if (!sessionId) {
    return null;
  }

  const failedStatus = getErrorStatus(failureReason ?? error);
  const isUnpaid = isError && failedStatus === 402;
  const isConfirmUnresolved = isError && !isUnpaid;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-10">
      {(isPending || (!isSuccess && !isError)) && (
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner />
          <p className="text-gray-600 text-lg">Confirming your payment...</p>
        </div>
      )}

      {isSuccess && (
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

      {isUnpaid && (
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

      {isConfirmUnresolved && (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
            <svg
              className="h-8 w-8 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Booking is being confirmed
          </h1>
          <p className="text-gray-600 max-w-md">
            We couldn&apos;t confirm the payment right away, but if your card
            was charged your consultation will appear in your consultations
            shortly.
          </p>
          <button
            onClick={() => router.push("/patient/consultations")}
            className="text-primary-500 underline"
          >
            Go to my consultations
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
