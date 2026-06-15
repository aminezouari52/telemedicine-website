"use client";

// hooks
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

// style
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CreditCard, MapPin, Search, X } from "lucide-react";

// functions
import { getPatientConsultations } from "@/services/consultationService";
import { DateTime } from "luxon";

// components
import LoadingSpinner from "@/components/LoadingSpinner";

// hooks
import { useQuery } from "@tanstack/react-query";

// constants
const PER_PAGE = 5;

const statusVariant = (status) => {
  switch (status) {
    case "completed":
      return "default";
    case "in-progress":
      return "secondary";
    case "canceled":
      return "destructive";
    default:
      return "outline";
  }
};

const statusLabel = {
  completed: "Completed on",
  canceled: "Canceled on",
  "in-progress": "In progress",
};

const paymentBadgeVariant = (paymentStatus) => {
  switch (paymentStatus) {
    case "paid":
      return "default";
    case "pending":
      return "secondary";
    case "refunded":
      return "outline";
    case "failed":
      return "destructive";
    default:
      return "outline";
  }
};

function ConsultationCard({ consultation, showStatus }) {
  const payment = consultation?.payment;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={consultation?.doctor?.photo || "/assets/avatar-doctor.jpg"}
              alt="Doctor"
            />
            <AvatarFallback>DR</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold truncate">
                Dr. {consultation?.doctor?.firstName}{" "}
                {consultation?.doctor?.lastName}
              </p>
              {showStatus && (
                <Badge
                  variant={statusVariant(consultation?.status)}
                  className="shrink-0"
                >
                  {consultation?.status}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {consultation?.doctor?.specialty}
            </p>
            <div className="flex gap-2 items-center text-sm">
              <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
              <span className="truncate">{consultation?.doctor?.hospital}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <div className="border-t border-gray-300" />
      <CardFooter className="p-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2.5">
            <Calendar className="h-4 w-4 text-gray-500 shrink-0" />
            <div className="text-xs">
              <span className="text-gray-500">
                {showStatus
                  ? statusLabel[consultation?.status] || "Consultation"
                  : "Your consultation"}
              </span>
              <br />
              <span>
                {consultation?.date
                  ? DateTime.fromJSDate(new Date(consultation.date)).toFormat(
                      "dd-MM-yyyy 'à' HH:mm",
                    )
                  : null}
              </span>
            </div>
          </div>
          {payment && (
            <div className="flex items-center gap-2 shrink-0">
              <CreditCard className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-sm font-semibold">
                ${payment.amount?.toFixed(2)}
              </span>
              <Badge
                variant={paymentBadgeVariant(payment.status)}
                className="text-[10px] px-1.5 py-0"
              >
                {payment.status}
              </Badge>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-6">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      {start > 1 && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="min-w-[36px]"
            onClick={() => onPageChange(1)}
          >
            1
          </Button>
          {start > 2 && <span className="px-1 text-gray-400">...</span>}
        </>
      )}
      {pages.map((p) => (
        <Button
          key={p}
          variant={p === page ? "default" : "outline"}
          size="sm"
          className="min-w-[36px]"
          onClick={() => onPageChange(p)}
        >
          {p}
        </Button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="px-1 text-gray-400">...</span>
          )}
          <Button
            variant="outline"
            size="sm"
            className="min-w-[36px]"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}
      <Button
        variant="outline"
        size="sm"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search by doctor, specialty, hospital..."}
        className="pl-9 pr-9"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function ResultsInfo({ from, to, total }) {
  return (
    <p className="text-sm text-gray-500">
      Showing <span className="font-medium">{from}</span>
      {" - "}
      <span className="font-medium">{to}</span> of{" "}
      <span className="font-medium">{total}</span> consultations
    </p>
  );
}

export default function PatientConsultationsPage() {
  const user = useSelector((state) => state.userReducer.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("upcoming");

  const {
    data: consultations,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["consultations"],
    queryFn: async () => {
      const res = await getPatientConsultations(user?._id);
      return res.data;
    },
  });

  const sortByDate = (items, order) =>
    [...(items ?? [])].sort((a, b) =>
      order === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date),
    );

  const upcomingConsultations = useMemo(
    () =>
      sortByDate(
        consultations?.filter((c) => c.status === "pending"),
        sortOrder,
      ),
    [consultations, sortOrder],
  );

  const historyConsultations = useMemo(
    () =>
      sortByDate(
        consultations?.filter((c) => c.status !== "pending"),
        sortOrder,
      ),
    [consultations, sortOrder],
  );

  const filteredUpcoming = useMemo(() => {
    if (!searchQuery.trim()) return upcomingConsultations;
    const q = searchQuery.toLowerCase().trim();
    return upcomingConsultations.filter(
      (c) =>
        c?.doctor?.firstName?.toLowerCase().includes(q) ||
        c?.doctor?.lastName?.toLowerCase().includes(q) ||
        c?.doctor?.specialty?.toLowerCase().includes(q) ||
        c?.doctor?.hospital?.toLowerCase().includes(q),
    );
  }, [upcomingConsultations, searchQuery]);

  const filteredHistory = useMemo(() => {
    let result = historyConsultations;
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c?.doctor?.firstName?.toLowerCase().includes(q) ||
          c?.doctor?.lastName?.toLowerCase().includes(q) ||
          c?.doctor?.specialty?.toLowerCase().includes(q) ||
          c?.doctor?.hospital?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [historyConsultations, searchQuery, statusFilter]);

  const totalPagesUpcoming = Math.max(
    1,
    Math.ceil(filteredUpcoming.length / PER_PAGE),
  );
  const totalPagesHistory = Math.max(
    1,
    Math.ceil(filteredHistory.length / PER_PAGE),
  );

  // clamp page when total pages shrinks due to filtering
  useEffect(() => {
    const max =
      activeTab === "upcoming" ? totalPagesUpcoming : totalPagesHistory;
    if (page > max) setPage(max);
  }, [page, activeTab, totalPagesUpcoming, totalPagesHistory]);

  const paginatedUpcoming = filteredUpcoming.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE,
  );
  const paginatedHistory = filteredHistory.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE,
  );

  const handleTabChange = (value) => {
    setActiveTab(value);
    setPage(1);
    setSearchQuery("");
    setStatusFilter("all");
  };

  if (isPending) {
    return (
      <div className="flex justify-center mt-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center mt-10 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 md:px-6 py-6">
      <h1 className="text-xl font-semibold">My Consultations</h1>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingConsultations.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              History ({historyConsultations.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="mb-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={(v) => {
                setSearchQuery(v);
                setPage(1);
              }}
            />
          </div>
          <div className="w-full sm:w-44">
            <Select
              value={sortOrder}
              onValueChange={(v) => {
                setSortOrder(v);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest first</SelectItem>
                <SelectItem value="asc">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {activeTab === "history" && (
            <div className="w-full sm:w-44">
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                  <SelectItem value="in-progress">In progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <TabsContent value="upcoming" className="mt-0">
          {filteredUpcoming.length > 0 && (
            <ResultsInfo
              from={(page - 1) * PER_PAGE + 1}
              to={Math.min(page * PER_PAGE, filteredUpcoming.length)}
              total={filteredUpcoming.length}
            />
          )}
          <div className="flex flex-col gap-4 mt-2">
            {paginatedUpcoming.length > 0 ? (
              paginatedUpcoming.map((consultation) => (
                <ConsultationCard
                  key={consultation._id}
                  consultation={consultation}
                  showStatus={false}
                />
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                {searchQuery
                  ? "No upcoming consultations match your search"
                  : "You have no upcoming consultations"}
              </div>
            )}
          </div>
          <Pagination
            page={page}
            totalPages={totalPagesUpcoming}
            onPageChange={setPage}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          {filteredHistory.length > 0 && (
            <ResultsInfo
              from={(page - 1) * PER_PAGE + 1}
              to={Math.min(page * PER_PAGE, filteredHistory.length)}
              total={filteredHistory.length}
            />
          )}
          <div className="flex flex-col gap-4 mt-2">
            {paginatedHistory.length > 0 ? (
              paginatedHistory.map((consultation) => (
                <ConsultationCard
                  key={consultation._id}
                  consultation={consultation}
                  showStatus={true}
                />
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                {searchQuery || statusFilter !== "all"
                  ? "No history consultations match your filters"
                  : "You have no past consultations"}
              </div>
            )}
          </div>
          <Pagination
            page={page}
            totalPages={totalPagesHistory}
            onPageChange={setPage}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
