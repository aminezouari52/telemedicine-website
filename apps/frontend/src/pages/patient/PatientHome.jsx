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
              Our
              <span
                style={{
                  color: "#615EFC",
                }}
              >
                {" "}
                doctors{" "}
              </span>
              and therapists are here,{" "}
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
              Don't wait to start feeling better. Connect with a certified
              physician in minutes. Book an appointment anywhere.
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
                Book a consultation!
              </Button>
            </Flex>
          </Flex>

          <Image
            m={6}
            w="70%"
            h="600px"
            objectFit="cover"
            src="https://res.cloudinary.com/dfzx2pdi3/image/upload/v1739200306/patient-home_ebcahl.jpg"
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
              <Heading fontSize="xl">Find a doctor</Heading>
              <Text fontSize="smaller" py={2}>
                We recruit the best specialists to offer you a first-rate
                first-rate diagnostic service.
              </Text>
              <Button
                variant="link"
                color="primary.500"
                onClick={() => navigate("/patient/doctors")}
              >
                Find a doctor.
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
              <Heading fontSize="xl">Book a consultation</Heading>
              <Text fontSize="smaller" py={2}>
                Connect with a specialist in just a few minutes and receive the
                care you need.
              </Text>
              <Button
                variant="link"
                color="primary.500"
                onClick={() => navigate("/patient/doctors")}
              >
                Book now.
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
              <Heading fontSize="xl">See my Consultations</Heading>
              <Text fontSize="smaller" py={2}>
                View the history of your past and future medical appointments.
                appointments.
              </Text>
              <Button
                variant="link"
                color="primary.500"
                onClick={() => navigate("/patient/consultations")}
              >
                My consultations.
              </Button>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default PatientHome;
