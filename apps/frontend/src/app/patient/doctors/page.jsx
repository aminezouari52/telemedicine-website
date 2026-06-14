"use client";

// hooks
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

// functions
import { paginate } from "@/components/pagination/Pagination";
import {
  getAllDoctors,
  getDoctorPatientsCount,
} from "@/services/doctorService";

// components
import Search from "@/components/Search";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Pagination } from "@/components/pagination";

// style
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  Hospital,
  Users,
  Stethoscope,
  Building2,
  ArrowRight,
  SearchX,
} from "lucide-react";

const ALL_VALUE = "__all__";

function DoctorCard({ doctor }) {
  const router = useRouter();
  const {
    photo,
    firstName = "first name",
    lastName = "last name",
    price = 0,
    hospital = "hospital",
    specialty,
    id,
  } = doctor;

  const getPatientCount = async (doctorID) => {
    if (!doctorID) return 0;
    const response = (await getDoctorPatientsCount(id)).data.patientsCount;
    return response;
  };

  const { data: patientsCount, isPending } = useQuery({
    queryKey: ["patientCount", id],
    queryFn: () => getPatientCount(id),
  });

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="h-full"
    >
      <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary-500/10">
        {/* Image */}
        <div
          className="relative cursor-pointer overflow-hidden"
          onClick={() => router.push(`/patient/doctors/${doctor.id}`)}
        >
          <img
            className="h-[300px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={photo}
            alt={`Dr. ${firstName} ${lastName}`}
          />
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* price chip */}
          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-sm font-bold text-primary-600 shadow-md backdrop-blur">
            {price}.00dt
          </span>

          {/* specialty chip */}
          {specialty && (
            <Badge className="absolute left-3 top-3 gap-1 border-transparent bg-primary-500/90 text-white shadow-md backdrop-blur hover:bg-primary-500/90">
              <Stethoscope className="h-3 w-3" />
              {specialty}
            </Badge>
          )}
        </div>

        {/* Body */}
        <CardContent className="flex flex-1 flex-col gap-4 p-5">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-gray-900">
              Dr. {firstName} {lastName}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Building2 className="h-4 w-4 shrink-0 text-primary-400" />
              <span className="truncate">{hospital}</span>
            </div>
          </div>

          {/* patients */}
          <div className="flex items-center gap-2 rounded-xl bg-primary-50 px-3 py-2 text-sm">
            <Users className="h-4 w-4 text-primary-500" />
            {isPending ? (
              <LoadingSpinner />
            ) : (
              <span className="font-semibold text-gray-900">
                {patientsCount}
              </span>
            )}
            <span className="text-gray-500">patients treated</span>
          </div>

          {/* actions */}
          <div className="mt-auto flex items-center gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/patient/doctors/${doctor.id}`)}
              className="flex-1 border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-600"
            >
              View profile
            </Button>
            <Button
              size="sm"
              disabled={doctor?.quantity < 1}
              onClick={() => router.push(`/patient/consultation/${doctor.id}`)}
              className="flex-1 gap-1 bg-primary-500 hover:bg-primary-600"
            >
              Book
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function PatientDoctorsPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [specialty, setSpecialty] = useState("");
  const [hospital, setHospital] = useState("");
  const [sortBy, setSortBy] = useState("");
  const searchText = useSelector((state) => state.searchReducer.searchText);
  const { text } = searchText;

  const nextPageHandler = () => {
    setCurrentPage((prev) => prev + 1);
  };
  const prevPageHandler = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const getAllDoctorsQuery = async () => {
    const queryParams = {};
    if (specialty) queryParams.specialty = specialty;
    if (hospital) queryParams.hospital = hospital;
    if (text) queryParams.text = text;
    const filters = new URLSearchParams(queryParams).toString();
    const response = await getAllDoctors(filters, sortBy);
    return paginate(response.data.results);
  };

  const {
    data: doctors,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["doctors", specialty, hospital, sortBy, searchText],
    queryFn: () => getAllDoctorsQuery(),
  });

  const totalResults =
    doctors?.reduce((acc, page) => acc + page.length, 0) ?? 0;
  const currentDoctors = doctors?.[currentPage] ?? [];
  const hasResults = currentDoctors.length > 0;

  return (
    <div className="flex flex-col gap-8 py-6 md:px-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">Find a doctor</h1>
        <p className="text-sm text-gray-500">
          Browse trusted specialists and book your next consultation.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Name
              </label>
              <Search />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Speciality
              </label>
              <Select
                value={specialty || ALL_VALUE}
                onValueChange={(v) => setSpecialty(v === ALL_VALUE ? "" : v)}
              >
                <SelectTrigger className="focus:ring-primary-500">
                  <Stethoscope className="mr-1 h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>All</SelectItem>
                  <SelectItem value="Generalist">Generalist</SelectItem>
                  <SelectItem value="Cardiologist">Cardiologist</SelectItem>
                  <SelectItem value="Dermatologist">Dermatologist</SelectItem>
                  <SelectItem value="Endocrinologist">
                    Endocrinologist
                  </SelectItem>
                  <SelectItem value="Gastroenterologist">
                    Gastroenterologist
                  </SelectItem>
                  <SelectItem value="Neurologist">Neurologist</SelectItem>
                  <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                  <SelectItem value="Psychiatrist">Psychiatrist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Hospital
              </label>
              <Select
                value={hospital || ALL_VALUE}
                onValueChange={(v) => setHospital(v === ALL_VALUE ? "" : v)}
              >
                <SelectTrigger className="focus:ring-primary-500">
                  <Hospital className="mr-1 h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>All</SelectItem>
                  <SelectItem value="Hospital Mongi Slim">
                    Hospital Mongi Slim
                  </SelectItem>
                  <SelectItem value="Hospital Charles Nicolle">
                    Hospital Charles Nicolle
                  </SelectItem>
                  <SelectItem value="Hospital La Rabta">
                    Hospital La Rabta
                  </SelectItem>
                  <SelectItem value="Hospital Razi">Hospital Razi</SelectItem>
                  <SelectItem value="Hospital Sahloul">
                    Hospital Sahloul
                  </SelectItem>
                  <SelectItem value="Hospital Farhat Hached">
                    Hospital Farhat Hached
                  </SelectItem>
                  <SelectItem value="Hospital Fattouma Bourguiba">
                    Hospital Fattouma Bourguiba
                  </SelectItem>
                  <SelectItem value="Hospital Hédi Chaker">
                    Hospital Hédi Chaker
                  </SelectItem>
                  <SelectItem value="Hospital Habib Bourguiba">
                    Hospital Habib Bourguiba
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2 lg:w-56">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Sort
            </label>
            <Select
              value={sortBy || ALL_VALUE}
              onValueChange={(v) => setSortBy(v === ALL_VALUE ? "" : v)}
            >
              <SelectTrigger className="cursor-pointer hover:opacity-80 focus:ring-primary-500">
                <ArrowUpDown className="mr-1 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Sort by: all" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>Sort by: all</SelectItem>
                <SelectItem value="price:asc">Price: low to high</SelectItem>
                <SelectItem value="price:desc">Price: high to low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results count */}
      {!isPending && !isError && (
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{totalResults}</span>{" "}
          {totalResults === 1 ? "doctor" : "doctors"} found
        </p>
      )}

      {/* Grid */}
      <div className="min-h-[300px]">
        {isPending ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-2 py-20 text-center">
            <SearchX className="h-10 w-10 text-gray-300" />
            <span className="text-gray-600">Error: {error.message}</span>
          </div>
        ) : hasResults ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentDoctors.map((doctor) => (
              <DoctorCard
                key={doctor._id}
                doctor={{
                  id: doctor._id,
                  firstName: doctor.firstName,
                  lastName: doctor.lastName,
                  price: doctor.price,
                  photo: doctor.photo,
                  hospital: doctor.hospital,
                  specialty: doctor.specialty,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
              <SearchX className="h-8 w-8 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              No doctors found
            </h3>
            <p className="max-w-sm text-sm text-gray-500">
              Try adjusting your search or filters to find the right specialist.
            </p>
          </div>
        )}
      </div>

      <Pagination
        items={doctors}
        currentPage={currentPage}
        nextPage={nextPageHandler}
        prevPage={prevPageHandler}
        updatePage={setCurrentPage}
      />
    </div>
  );
}
