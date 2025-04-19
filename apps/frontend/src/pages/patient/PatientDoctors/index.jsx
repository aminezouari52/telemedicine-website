// HOOKS
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

// FUNCTIONS
import { paginate } from "@/components/pagination/Pagination";
import { getAllDoctors } from "@/services/doctorService";

// COMPONENTS
import Search from "@/components/Search";
import DoctorCard from "./DoctorCard";
import { Pagination } from "@/components/pagination";
import LoadingSpinner from "@/components/LoadingSpinner";

// STYLE
import { Heading, Flex, Select, Text } from "@chakra-ui/react";

// ASSETS
import { ArrowUpDownIcon } from "@chakra-ui/icons";

const PatientDoctors = () => {
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

  //Get All Doctors Query Function
  const getAllDoctorsQuery = async () => {
    const queryParams = {};
    if (specialty) queryParams.specialty = specialty;
    if (hospital) queryParams.hospital = hospital;
    if (text) queryParams.text = text;
    const filters = new URLSearchParams(queryParams).toString();
    const response = await getAllDoctors(filters, sortBy);
    return paginate(response.data.results);
  };

  //Query Invoked Using useQuery
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
    <Flex flexDirection="column" gap={10} px={12} py={6}>
      <Heading fontSize="xl">Find a doctor</Heading>
      <Flex bg="#fff" direction="column" gap={8} p={10} borderRadius={4}>
        <Flex justifyContent="space-between">
          <Flex gap={10}>
            <Flex direction="column" gap={4}>
              <Text fontWeight="bold" fontSize={14} color="gray.600">
                Name
              </Text>
              <Search />
            </Flex>
            <Flex direction="column" gap={4}>
              <Text fontWeight="bold" fontSize={14} color="gray.600">
                Speciality
              </Text>
              <Select
                size="sm"
                variant="outline"
                focusBorderColor="primary.500"
                onChange={(event) => setSpecialty(event.target.value)}
              >
                <option value="">All</option>
                <option value="Generalist">Generalist</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Endocrinologist">Endocrinologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Psychiatrist">Psychiatrist</option>
              </Select>
            </Flex>

            <Flex direction="column" gap={4}>
              <Text fontWeight="bold" fontSize={14} color="gray.600">
                Hospital
              </Text>
              <Select
                size="sm"
                variant="outline"
                focusBorderColor="primary.500"
                onChange={(event) => setHospital(event.target.value)}
              >
                <option value="">All</option>
                <option value="Hospital Mongi Slim">Hospital Mongi Slim</option>
                <option value="Hospital Charles Nicolle">
                  Hospital Charles Nicolle
                </option>
                <option value="Hospital La Rabta">Hospital La Rabta</option>
                <option value="Hospital Razi">Hospital Razi</option>
                <option value="Hospital Sahloul">Hospital Sahloul</option>
                <option value="Hospital Farhat Hached">
                  Hospital Farhat Hached
                </option>
                <option value="Hospital Fattouma Bourguiba">
                  Hospital Fattouma Bourguiba
                </option>
                <option value="Hospital Hédi Chaker">
                  Hospital Hédi Chaker
                </option>
                <option value="Hospital Habib Bourguiba">
                  Hospital Habib Bourguiba
                </option>
              </Select>
            </Flex>
          </Flex>
          <Flex gap={6}>
            <Select
              variant="filled"
              cursor="pointer"
              _hover={{
                opacity: "0.8",
              }}
              icon={
                <ArrowUpDownIcon
                  style={{
                    height: "10px",
                  }}
                />
              }
              focusBorderColor="primary.500"
              size="sm"
              iconSize={14}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="">Sort by: all</option>
              <option value="price:asc">price: cheaper</option>
              <option value="price:desc">price: more expensive</option>
            </Select>
          </Flex>
        </Flex>
        <Flex gap={20} py={4} flexWrap="wrap" justifyContent="center">
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
        </Flex>
      </Flex>
      <Pagination
        items={doctors}
        currentPage={currentPage}
        nextPage={nextPageHandler}
        prevPage={prevPageHandler}
        updatePage={setCurrentPage}
      />
    </Flex>
  );
};

export default PatientDoctors;
