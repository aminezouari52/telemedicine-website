// HOOKS
import { useState, useEffect } from "react";

// FUNCTIONS
import { paginate } from "@/components/pagination/Pagination";
import { getAllDoctors } from "@/modules/doctor/functions/doctor";
import { useSelector } from "react-redux";

// COMPONENTS
import Search from "@/components/Search";
import DoctorCard from "./DoctorCard";
import { Pagination } from "@/components/pagination";

// STYLE
import { Heading, Flex, Select, Text } from "@chakra-ui/react";

// ASSETS
import { ArrowUpDownIcon } from "@chakra-ui/icons";

const Doctors = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [specialty, setSpecialty] = useState("");
  const [hospital, setHospital] = useState("");
  const [sortBy, setSortBy] = useState("");
  const searchText = useSelector((state) => state.search.searchText);
  const { text } = searchText;

  const nextPageHandler = () => {
    setCurrentPage((prev) => prev + 1);
  };
  const prevPageHandler = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const getAllDoctorsEffect = async () => {
    const queryParams = {};
    if (specialty) queryParams.specialty = specialty;
    if (hospital) queryParams.hospital = hospital;
    if (text) queryParams.text = text;
    const filters = new URLSearchParams(queryParams).toString();
    const response = await getAllDoctors(filters, sortBy);
    const paginatedData = paginate(response.data.results);
    setDoctors(paginatedData);
  };

  useEffect(() => {
    getAllDoctorsEffect();
  }, [specialty, hospital, sortBy, searchText]);

  return (
    <Flex flexDirection="column" gap={10} p={10} bg="gray.100">
      <Heading fontSize="xl">Trouver un docteur</Heading>
      <Flex bg="#fff" direction="column" gap={8} p={10} borderRadius={4}>
        <Flex justifyContent="space-between">
          <Flex gap={10}>
            <Flex direction="column" gap={4}>
              <Text fontWeight="bold" fontSize={14} color="gray.600">
                Nom
              </Text>
              <Search />
            </Flex>
            <Flex direction="column" gap={4}>
              <Text fontWeight="bold" fontSize={14} color="gray.600">
                Spécialité
              </Text>
              <Select
                size="sm"
                variant="outline"
                focusBorderColor="primary.500"
                onChange={(event) => setSpecialty(event.target.value)}
              >
                <option value="">Tous</option>
                <option value="Généraliste">Généraliste</option>
                <option value="Cardiologue">Cardiologue</option>
                <option value="Dermatologue">Dermatologue</option>
                <option value="Endocrinologue">Endocrinologue</option>
                <option value="Gastro-entérologue">Gastro-entérologue</option>
                <option value="Neurologue">Neurologue</option>
                <option value="Pédiatre">Pédiatre</option>
                <option value="Psychiatre">Psychiatre</option>
              </Select>
            </Flex>

            <Flex direction="column" gap={4}>
              <Text fontWeight="bold" fontSize={14} color="gray.600">
                Hôpital
              </Text>
              <Select
                size="sm"
                variant="outline"
                focusBorderColor="primary.500"
                onChange={(event) => setHospital(event.target.value)}
              >
                <option value="">Tous</option>
                <option value="Hôpital Mongi Slim">Hôpital Mongi Slim</option>
                <option value="Hôpital Charles Nicolle">
                  Hôpital Charles Nicolle
                </option>
                <option value="Hôpital La Rabta">Hôpital La Rabta</option>
                <option value="Hôpital Razi">Hôpital Razi</option>
                <option value="Hôpital Sahloul">Hôpital Sahloul</option>
                <option value="Hôpital Farhat Hached">
                  Hôpital Farhat Hached
                </option>
                <option value="Hôpital Fattouma Bourguiba">
                  Hôpital Fattouma Bourguiba
                </option>
                <option value="Hôpital Hédi Chaker">Hôpital Hédi Chaker</option>
                <option value="Hôpital Habib Bourguiba">
                  Hôpital Habib Bourguiba
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
              <option value="">Triée par: tout</option>
              <option value="price:asc">prix: moins cher</option>
              <option value="price:desc">prix: plus cher</option>
              <option value="patients:asc">patients: plus bas</option>
              <option value="patients:desc">patients: plus haut</option>
            </Select>
          </Flex>
        </Flex>
        <Flex gap={20} py={4} flexWrap="wrap" justifyContent="center">
          {doctors &&
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
            ))}
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

export default Doctors;
