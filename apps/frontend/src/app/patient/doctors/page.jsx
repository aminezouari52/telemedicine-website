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
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Hospital, Users } from "lucide-react";

const ALL_VALUE = "__all__";

function DoctorCard({ doctor }) {
  const router = useRouter();
  const {
    photo,
    firstName = "first name",
    lastName = "last name",
    price = 0,
    hospital = "hospital",
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
    <Card className="bg-white w-[340px] flex flex-col justify-between rounded-md shadow-xl">
      <div
        className="cursor-pointer"
        onClick={() => router.push(`/patient/doctors/${doctor.id}`)}
      >
        <motion.div
          whileHover={{
            y: -10,
          }}
          style={{
            zIndex: 1,
          }}
        >
          <img
            className="rounded-t-md w-[340px] h-[380px] object-cover"
            src={photo}
            alt="profile image"
          />
        </motion.div>
      </div>

      <CardContent className="flex flex-col justify-around gap-2 py-4">
        <h2 className="text-center text-lg font-semibold">
          {firstName} {lastName}
        </h2>
        <div className="flex justify-center items-center gap-2">
          <Hospital className="text-gray-500" />
          <span className="text-gray-500">{hospital}</span>
        </div>
        <div className="flex justify-center items-center gap-2">
          <Users className="text-gray-500" />

          {isPending ? (
            <LoadingSpinner />
          ) : (
            <span className="font-bold text-black">{patientsCount}</span>
          )}

          <span className="text-gray-500">Patients</span>
        </div>

        <div className="flex justify-evenly items-center">
          <span className="text-primary-500 font-bold text-lg">
            {price}.00dt
          </span>
          <Button
            size="sm"
            disabled={doctor?.quantity < 1}
            onClick={() => router.push(`/patient/consultation/${doctor.id}`)}
            className="hover:opacity-80"
          >
            Book
          </Button>
        </div>
      </CardContent>
    </Card>
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

  return (
    <div className="flex flex-col gap-10 px-12 py-6">
      <h1 className="text-xl font-semibold">Find a doctor</h1>
      <div className="bg-white flex flex-col gap-8 p-10 rounded">
        <div className="flex justify-between">
          <div className="flex gap-10">
            <div className="flex flex-col gap-4">
              <span className="font-bold text-sm text-gray-600">Name</span>
              <Search />
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold text-sm text-gray-600">
                Speciality
              </span>
              <Select
                value={specialty || ALL_VALUE}
                onValueChange={(v) => setSpecialty(v === ALL_VALUE ? "" : v)}
              >
                <SelectTrigger className="focus:ring-primary-500">
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

            <div className="flex flex-col gap-4">
              <span className="font-bold text-sm text-gray-600">Hospital</span>
              <Select
                value={hospital || ALL_VALUE}
                onValueChange={(v) => setHospital(v === ALL_VALUE ? "" : v)}
              >
                <SelectTrigger className="focus:ring-primary-500">
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
          <div className="flex gap-6">
            <Select
              value={sortBy || ALL_VALUE}
              onValueChange={(v) => setSortBy(v === ALL_VALUE ? "" : v)}
            >
              <SelectTrigger className="focus:ring-primary-500 cursor-pointer hover:opacity-80">
                <SelectValue placeholder="Sort by: all" />
                <ArrowUpDown className="h-2.5 w-2.5" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>Sort by: all</SelectItem>
                <SelectItem value="price:asc">price: cheaper</SelectItem>
                <SelectItem value="price:desc">
                  price: more expensive
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-20 py-4 flex-wrap justify-center">
          {isPending ? (
            <LoadingSpinner />
          ) : isError ? (
            <span>Error : {error.message}</span>
          ) : (
            doctors &&
            doctors?.length !== 0 &&
            doctors[currentPage]?.map((doctor) => (
              <DoctorCard
                key={doctor._id}
                doctor={{
                  id: doctor._id,
                  firstName: doctor.firstName,
                  lastName: doctor.lastName,
                  price: doctor.price,
                  photo: doctor.photo,
                  hospital: doctor.hospital,
                }}
              />
            ))
          )}
        </div>
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
