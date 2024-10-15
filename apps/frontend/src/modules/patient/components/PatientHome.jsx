// STYLE
import {
  Box,
  Flex,
  Text,
  Icon,
  Heading,
  Button,
  Image,
} from "@chakra-ui/react";

// ASSETS
import { RxArrowTopRight } from "react-icons/rx";
import patientHome from "@/images/patient-home.jpeg";
import { FaRegHospital } from "react-icons/fa";
import { GiMedicalPackAlt } from "react-icons/gi";
import { FaHandHoldingMedical } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PatientHome = () => {
  const navigate = useNavigate();
  return (
    <Box w="100%" bg="white">
      <Flex
        alignItems="center"
        justifyContent="space-around"
        flexDirection="column"
      >
        <Flex justifyContent="space-around">
          <Flex flexDirection="column" justifyContent="center" gap="10px">
            <Heading fontSize="5xl" as="h1" p={6}>
              Nos
              <span
                style={{
                  color: "#615EFC",
                }}
              >
                {" "}
                médecins{" "}
              </span>
              et thérapeutes sont là,{" "}
              <span
                style={{
                  color: "#615EFC",
                }}
              >
                24/7{" "}
              </span>
              .
            </Heading>
            <Text fontWeight="semibold" p={6}>
              N'attendez pas pour commencer à vous sentir mieux. Connectez-vous
              avec un médecin certifié en quelques minutes. Prenez rendez-vous
              partout.
            </Text>

            <Flex p={6}>
              <Button
                rightIcon={<RxArrowTopRight fontSize="24px" />}
                variant="solid"
                colorScheme="primary"
                color="#fff"
                borderColor="primary.500"
                _hover={{
                  opacity: 0.8,
                }}
                size={{ sm: "sm", md: "md", lg: "lg" }}
                onClick={() => navigate("/patient/doctors")}
              >
                Réservez une consultation!
              </Button>
            </Flex>
          </Flex>

          <Image
            m={6}
            w="70%"
            h="600px"
            objectFit="cover"
            src={patientHome}
            alt="product image"
          />
        </Flex>
        <Flex justifyContent="space-between" p={6} rowGap="10px" w="100%">
          <Flex
            width="30%"
            border="1px"
            borderColor="gray.400"
            borderRadius="md"
            p={4}
            bg="white"
          >
            <Flex justifyContent="center">
              <Icon
                as={FaRegHospital}
                w="70px"
                h="50px"
                color="primary.500"
                px="10px"
              ></Icon>
            </Flex>

            <Box>
              <Heading fontSize="xl">Trouvez un medecin</Heading>
              <Text fontSize="smaller" py={2}>
                Nous recrutons les meilleurs spécialistes pour vous offrir un
                service de diagnostic de premier ordre.
              </Text>
              <Button
                variant="link"
                color="primary.500"
                onClick={() => navigate("/patient/doctors")}
              >
                Trouvez medecin.
              </Button>
            </Box>
          </Flex>
          <Flex
            width="30%"
            border="1px"
            borderColor="gray.400"
            borderRadius="md"
            p={4}
            bg="white"
          >
            <Flex justifyContent="center">
              <Icon
                as={FaHandHoldingMedical}
                w="65px"
                h="50px"
                color="primary.500"
                px="10px"
              ></Icon>
            </Flex>

            <Box>
              <Heading fontSize="xl">Prenez rendez-vous</Heading>
              <Text fontSize="smaller" py={2}>
                Connectez-vous avec un spécialiste en quelques minutes et
                recevez les soins dont vous avez besoin.
              </Text>
              <Button
                variant="link"
                color="primary.500"
                onClick={() => navigate("/patient/doctors")}
              >
                Réservez maintenant.
              </Button>
            </Box>
          </Flex>
          <Flex
            width="30%"
            border="1px"
            borderColor="gray.400"
            borderRadius="md"
            p={4}
            bg="white"
          >
            <Flex justifyContent="center">
              <Icon
                as={GiMedicalPackAlt}
                w="70px"
                h="50px"
                color="primary.500"
                px="10px"
              ></Icon>
            </Flex>

            <Box>
              <Heading fontSize="xl">Voir mes Consultations</Heading>
              <Text fontSize="smaller" py={2}>
                Consultez l'historique de vos rendez-vous médicaux passés et à
                venir.
              </Text>
              <Button
                variant="link"
                color="primary.500"
                onClick={() => navigate("/patient/consultations")}
              >
                Mes consultations.
              </Button>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default PatientHome;
