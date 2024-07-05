// COMPONENTS
import Search from "./Search";
import DoctorCard from "./DoctorCard";

// STYLE
import { Heading, Flex, Select, Text } from "@chakra-ui/react";

// ASSETS
import doctor1 from "../../images/avatars/doctors/1.avif";
import doctor2 from "../../images/avatars/doctors/2.avif";
import doctor3 from "../../images/avatars/doctors/3.avif";
import doctor4 from "../../images/avatars/doctors/4.avif";
import doctor5 from "../../images/avatars/doctors/5.avif";
import doctor6 from "../../images/avatars/doctors/6.avif";
import doctor7 from "../../images/avatars/doctors/7.avif";
import doctor8 from "../../images/avatars/doctors/8.avif";
import doctor9 from "../../images/avatars/doctors/9.avif";
import doctor10 from "../../images/avatars/doctors/10.avif";
import { ArrowUpDownIcon } from "@chakra-ui/icons";
import Pagination, { paginate } from "./Pagination";
import { useState } from "react";
const doctors = [
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

  const nextPageHandler = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const prevPageHandler = () => {
    setCurrentPage((prev) => prev - 1);
  };

  return (
    <Flex flexDirection="column" gap={10} p={10}>
      <Heading fontSize="xl">Trouver un docteur</Heading>
      <Flex bg="#fff" direction="column" gap={8} p={10}>
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
                <option value="recent">tous</option>
                <option value="recent">specspecspec</option>
                <option value="recent">spec2</option>
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
                <option value="recent">tous</option>
                <option value="recent">hospital1</option>
                <option value="recent">hospital2</option>
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
          {paginate(doctors)[currentPage].map((doc) => (
            <DoctorCard
              key={doc.id}
              product={{
                id: doc.id,
                title: doc.title,
                price: doc.price,
                images: doc.images,
                patients: doc.patients,
                hospital: doc.hospital,
              }}
            />
          ))}
        </Flex>
      </Flex>
      <Pagination
        doctors={paginate(doctors)}
        currentPage={currentPage}
        nextPage={nextPageHandler}
        prevPage={prevPageHandler}
        updatePage={setCurrentPage}
      />
    </Flex>
  );
};

export default Doctors;
