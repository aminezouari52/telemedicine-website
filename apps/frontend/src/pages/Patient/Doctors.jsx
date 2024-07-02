// COMPONENTS
import Search from "./Search";
import DoctorCard from "./DoctorCard";

// STYLE
import { Heading, Flex, Select, Text } from "@chakra-ui/react";

// ASSETS
import Avatar1 from "../../images/avatars/doctors/1.avif";
import Avatar2 from "../../images/avatars/doctors/2.avif";
import Avatar3 from "../../images/avatars/doctors/3.avif";
import Avatar4 from "../../images/avatars/doctors/4.avif";
import Avatar5 from "../../images/avatars/doctors/5.avif";
import Avatar6 from "../../images/avatars/doctors/6.avif";
import Avatar7 from "../../images/avatars/doctors/7.avif";
import Avatar8 from "../../images/avatars/doctors/8.avif";
import Avatar9 from "../../images/avatars/doctors/9.avif";
import Avatar10 from "../../images/avatars/doctors/10.avif";
import { ArrowUpDownIcon } from "@chakra-ui/icons";
const doctors = [
  {
    id: 1,
    title: "Dr. Mohamed Amine",
    price: 60,
    slug: "dr-mohamed-amine",
    images: [Avatar1],
    patients: 164,
    hospital: "Hopital sahloul sousse",
  },
  {
    id: 2,
    title: "Dr. John Doe",
    price: 60,
    slug: "dr-mohamed-amine",
    images: [Avatar2],
    hospital: "Farhat Hached Sousse",
    patients: 206,
  },
  {
    id: 3,
    title: "Dr. Benjamin Hawthorne",
    price: 80,
    slug: "dr-mohamed-amine",
    images: [Avatar3],
    hospital: "Riverside Medical Center",
    patients: 603,
  },
  {
    id: 4,
    title: "Dr. Mia Kensington",
    price: 100,
    slug: "dr-mohamed-amine",
    images: [Avatar4],
    hospital: "Farhat Hached Sousse",
    patients: 1533,
  },
  {
    id: 5,
    title: "Dr. Isabella Langston",
    price: 70,
    slug: "dr-mohamed-amine",
    images: [Avatar5],
    hospital: "Farhat Hached Sousse",
    patients: 702,
  },
  {
    id: 5,
    title: "Dr. Isabella Langston",
    price: 70,
    slug: "dr-mohamed-amine",
    images: [Avatar6],
    hospital: "Farhat Hached Sousse",
    patients: 702,
  },
  {
    id: 5,
    title: "Dr. Isabella Langston",
    price: 70,
    slug: "dr-mohamed-amine",
    images: [Avatar7],
    hospital: "Farhat Hached Sousse",
    patients: 702,
  },
  {
    id: 5,
    title: "Dr. Isabella Langston",
    price: 70,
    slug: "dr-mohamed-amine",
    images: [Avatar8],
    hospital: "Farhat Hached Sousse",
    patients: 702,
  },
  {
    id: 5,
    title: "Dr. Isabella Langston",
    price: 70,
    slug: "dr-mohamed-amine",
    images: [Avatar9],
    hospital: "Farhat Hached Sousse",
    patients: 702,
  },
  {
    id: 5,
    title: "Dr. Isabella Langston",
    price: 70,
    slug: "dr-mohamed-amine",
    images: [Avatar10],
    hospital: "Farhat Hached Sousse",
    patients: 702,
  },
];

const Doctors = () => {
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
          {doctors.map((doc) => (
            <DoctorCard
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
    </Flex>
  );
};

export default Doctors;
