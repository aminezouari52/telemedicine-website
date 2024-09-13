// HOOKS
import { useState, useEffect } from "react";

// FUNCTIONS
import { paginate } from "@/components/pagination/Pagination";
import { getAllDoctors } from "@/functions/doctor";

// COMPONENTS
import Search from "@/components/Search";
import DoctorCard from "./DoctorCard";
import { Pagination } from "@/components/pagination";

// STYLE
import { Heading, Flex, Select, Text } from "@chakra-ui/react";

// ASSETS
import doctor1 from "@/images/avatars/doctors/1.avif";
import doctor2 from "@/images/avatars/doctors/2.avif";
import doctor3 from "@/images/avatars/doctors/3.avif";
import doctor4 from "@/images/avatars/doctors/4.avif";
import doctor5 from "@/images/avatars/doctors/5.avif";
import doctor6 from "@/images/avatars/doctors/6.avif";
import doctor7 from "@/images/avatars/doctors/7.avif";
import doctor8 from "@/images/avatars/doctors/8.avif";
import doctor9 from "@/images/avatars/doctors/9.avif";
import doctor10 from "@/images/avatars/doctors/10.avif";
import { ArrowUpDownIcon } from "@chakra-ui/icons";

const doctors2 = [
  {
    id: 1,
    title: "Dr. Mohamed Amine",
    price: 60,
    slug: "dr-mohamed-amine",
    images: [doctor1],
    patients: 164,
    hospital: "Hopital sahloul sousse",
  },
  {
    id: 2,
    title: "Dr. John Doe",
    price: 60,
    slug: "dr-mohamed-amine",
    images: [doctor2],
    hospital: "Farhat Hached Sousse",
    patients: 206,
  },
  {
    id: 3,
    title: "Dr. Benjamin Hawthorne",
    price: 80,
    slug: "dr-mohamed-amine",
    images: [doctor3],
    hospital: "Riverside Medical Center",
    patients: 603,
  },
  {
    id: 4,
    title: "Dr. Mia Kensington",
    price: 100,
    slug: "dr-mohamed-amine",
    images: [doctor4],
    hospital: "Farhat Hached Sousse",
    patients: 1533,
  },
  {
    id: 5,
    title: "Dr. Isabella Langston",
    price: 70,
    slug: "dr-mohamed-amine",
    images: [doctor5],
    hospital: "Farhat Hached Sousse",
    patients: 702,
  },
  {
    id: 6,
    title: "Dr. Isabella Langston",
    price: 70,
    slug: "dr-mohamed-amine",
    images: [doctor6],
    hospital: "Farhat Hached Sousse",
    patients: 702,
  },
  {
    id: 7,
    title: "Dr. Isabella Langston",
    price: 70,
    slug: "dr-mohamed-amine",
    images: [doctor7],
    hospital: "Farhat Hached Sousse",
    patients: 702,
  },
  {
    id: 8,
    title: "Dr. Isabella Langston",
    price: 70,
    slug: "dr-mohamed-amine",
    images: [doctor8],
    hospital: "Farhat Hached Sousse",
    patients: 702,
  },
  {
    id: 9,
    title: "Dr. Isabella Langston",
    price: 70,
    slug: "dr-mohamed-amine",
    images: [doctor9],
    hospital: "Farhat Hached Sousse",
    patients: 702,
  },
  {
    id: 10,
    title: "Dr. Isabella Langston",
    price: 70,
    slug: "dr-mohamed-amine",
    images: [doctor10],
    hospital: "Farhat Hached Sousse",
    patients: 702,
  },
  {
    id: 1,
    title: "Dr. Mohamed Amine",
    price: 60,
    slug: "dr-mohamed-amine",
    images: [doctor1],
    patients: 164,
    hospital: "Hopital sahloul sousse",
  },
  {
    id: 2,
    title: "Dr. John Doe",
    price: 60,
    slug: "dr-mohamed-amine",
    images: [doctor2],
    hospital: "Farhat Hached Sousse",
    patients: 206,
  },
  {
    id: 3,
    title: "Dr. Benjamin Hawthorne",
    price: 80,
    slug: "dr-mohamed-amine",
    images: [doctor3],
    hospital: "Riverside Medical Center",
    patients: 603,
  },
  {
    id: 4,
    title: "Dr. Mia Kensington",
    price: 100,
    slug: "dr-mohamed-amine",
    images: [doctor4],
    hospital: "Farhat Hached Sousse",
    patients: 1533,
  },
  {
    id: 5,
    title: "Dr. Isabella Langston",
    price: 70,
    slug: "dr-mohamed-amine",
    images: [doctor5],
    hospital: "Farhat Hached Sousse",
    patients: 702,
  },
  {
    id: 6,
    title: "Dr. Isabella Langston",
    price: 70,
    slug: "dr-mohamed-amine",
    images: [doctor6],
    hospital: "Farhat Hached Sousse",
    patients: 702,
  },
  {
    id: 7,
    title: "Dr. Isabella Langston",
    price: 70,
    slug: "dr-mohamed-amine",
    images: [doctor7],
    hospital: "Farhat Hached Sousse",
    patients: 702,
  },
  {
    id: 8,
    title: "Dr. Isabella Langston",
    price: 70,
    slug: "dr-mohamed-amine",
    images: [doctor8],
    hospital: "Farhat Hached Sousse",
    patients: 702,
  },
  {
    id: 9,
    title: "Dr. Isabella Langston",
    price: 70,
    slug: "dr-mohamed-amine",
    images: [doctor9],
    hospital: "Farhat Hached Sousse",
    patients: 702,
  },
  {
    id: 10,
    title: "Dr. Isabella Langston",
    price: 70,
    slug: "dr-mohamed-amine",
    images: [doctor10],
    hospital: "Farhat Hached Sousse",
    patients: 702,
  },
];

const Doctors = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [doctors, setDoctors] = useState();
  const nextPageHandler = () => {
    setCurrentPage((prev) => prev + 1);
  };
  const prevPageHandler = () => {
    setCurrentPage((prev) => prev - 1);
  };

  useEffect(() => {
    const getAllDoctorsEffect = async () => {
      const response = await getAllDoctors();
      [currentPage];
      const paginatedData = paginate(response.data.results);
      setDoctors(paginatedData[currentPage]);
    };
    getAllDoctorsEffect();
  }, []);

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
            >
              <option value="recent">Triée par: tout</option>
              <option value="recent">prix: moins cher</option>
              <option value="recent">prix: plus bas</option>
              <option value="recent">patients: plus haut</option>
              <option value="recent">patients: plus bas</option>
            </Select>
          </Flex>
        </Flex>
        <Flex gap={20} py={4} flexWrap="wrap">
          {doctors?.map((doctor) => (
            <DoctorCard
              key={doctor._id}
              doctor={{
                id: doctor._id,
                firstName: doctor.firstName,
                lastName: doctor.lastName,
                price: doctor.price,
                photo: doctor.photo,
                patients: doctor.patients,
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
