"use client";

import { useState } from "react";
import { DateTime } from "luxon";
import DataTable from "@/components/DataTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const transformStatus = (status) => {
  if (status === "pending") return "Pending";
  if (status === "canceled") return "Canceled";
  if (status === "completed") return "Completed";
  if (status === "in-progress") return "In progress";
};

const headers = [
  "Patient",
  "Date",
  "Status",
  "Price",
  "Payment",
  "Created at",
  "Updated at",
];

const ConsultationsTable = ({ consultations }) => {
  const [activeTab, setActiveTab] = useState("pending");

  const renderRow = (consultation, index) => (
    <tr key={index} className="text-xs">
      <td className="px-4 py-2 font-bold">
        {consultation?.patient?.firstName} {consultation?.patient?.lastName}
      </td>
      <td className="px-4 py-2">
        {DateTime.fromJSDate(new Date(consultation?.date)).toFormat(
          "dd-MM-yyyy 'à' HH:mm",
        )}
      </td>
      <td className="px-4 py-2">{transformStatus(consultation?.status)}</td>
      <td className="px-4 py-2">
        {consultation?.payment?.amount
          ? `$${consultation.payment.amount.toFixed(2)}`
          : "—"}
      </td>
      <td className="px-4 py-2">
        {consultation?.payment?.status ? (
          <span
            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
              consultation.payment.status === "paid"
                ? "bg-green-100 text-green-700"
                : consultation.payment.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : consultation.payment.status === "refunded"
                    ? "bg-gray-100 text-gray-600"
                    : "bg-red-100 text-red-700"
            }`}
          >
            {consultation.payment.status}
          </span>
        ) : (
          "—"
        )}
      </td>
      <td className="px-4 py-2">
        {DateTime.fromJSDate(new Date(consultation?.createdAt)).toFormat(
          "dd-MM-yyyy 'à' HH:mm",
        )}
      </td>
      <td className="px-4 py-2">
        {DateTime.fromJSDate(new Date(consultation?.updatedAt)).toFormat(
          "dd-MM-yyyy 'à' HH:mm",
        )}
      </td>
    </tr>
  );

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-gray-100">
        {[
          { value: "pending", label: "Pending consultations" },
          { value: "canceled", label: "Canceled consultations" },
          { value: "completed", label: "Completed consultations" },
          { value: "all", label: "All consultations" },
        ].map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className={cn(
              "text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-primary-500 data-[state=active]:border-t-2 data-[state=active]:border-primary-500",
              activeTab === item.value ? "text-primary-500" : "text-gray-600",
            )}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="pending" className="p-0 mt-0">
        <DataTable
          renderRow={renderRow}
          headers={headers}
          data={consultations?.filter((c) => c.status === "pending")}
        />
      </TabsContent>
      <TabsContent value="canceled" className="p-0 mt-0">
        <DataTable
          headers={headers}
          renderRow={renderRow}
          data={consultations?.filter((c) => c.status === "canceled")}
        />
      </TabsContent>
      <TabsContent value="completed" className="p-0 mt-0">
        <DataTable
          headers={headers}
          renderRow={renderRow}
          data={consultations?.filter((c) => c.status === "completed")}
        />
      </TabsContent>
      <TabsContent value="all" className="p-0 mt-0">
        <DataTable
          headers={headers}
          renderRow={renderRow}
          data={consultations}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ConsultationsTable;
