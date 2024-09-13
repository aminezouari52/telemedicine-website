// HOOKS
import { useParams, useNavigate } from "react-router-dom";

// STYLE
import {
  Button,
  Flex,
  Heading,
  Image,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";

// ASSETS
import doctor from "@/images/avatars/doctors/1.avif";

function DoctorDetails() {
  const params = useParams();
  const navigate = useNavigate();

  return (
    <Flex>
      <Flex direction="column" w="35%" p={5} bg="#fff" gap={6}>
        <Image
          src={doctor}
          alt="doctor-image"
          borderRadius="lg"
          maxHeight="400px"
        />
        <Flex direction="column" gap={2}>
          <Flex direction="column">
            <Heading size="lg">Titre, Nader ben ftima {params.id}</Heading>
            <Text fontWeight="semibold" color="primary.500" fontSize="sm">
              Spécialité
            </Text>
          </Flex>

          <Heading size="md"></Heading>
          <Text>
            Je m'appelle Dr. Nader ben ftima, et je suis spécialisé en
            orthepedie. Après avoir obtenu mon diplôme de médecine à
            l'Université de Paris Descartes, j'ai poursuivi une formation
            approfondie en cardiologie à l'Hôpital Cochin.
          </Text>
          <Button colorScheme="danger" size="md">
            Supprimer compte
          </Button>
        </Flex>
      </Flex>
      <Flex p={10} w="65%" direction="column" gap={4}>
        <Flex>
          <Flex
            direction="column"
            p={6}
            bg="#fff"
            gap={5}
            borderTopLeftRadius="lg"
            w="100%"
          >
            <Flex direction="column" gap={2}>
              <Heading size="sm">Téléphone</Heading>
              <Text>+216 25 655 564</Text>
            </Flex>
            <Flex direction="column" gap={2}>
              <Heading size="sm">Email</Heading>
              <Text>drjanesmith@example.com</Text>
            </Flex>

            <Flex direction="column" gap={2}>
              <Heading size="sm">Certifications</Heading>
              <UnorderedList>
                <ListItem>American Board of Internal Medicine, 2006</ListItem>
                <ListItem>
                  Certification in Cardiovascular Disease, 2008
                </ListItem>
              </UnorderedList>
            </Flex>
            <Flex direction="column" gap={2}>
              <Heading size="sm">Diplôme</Heading>
              <UnorderedList>
                <ListItem>Harvard Medical School, MD, 2005</ListItem>
                <ListItem>
                  Johns Hopkins University, BS in Biology, 2001
                </ListItem>
              </UnorderedList>
            </Flex>
            <Flex direction="column" gap={2}>
              <Heading size="sm">Experience</Heading>
              <Text>3 ans</Text>
            </Flex>
          </Flex>

          <Flex
            direction="column"
            p={6}
            bg="#fff"
            gap={5}
            borderTopRightRadius="lg"
            w="100%"
          >
            <Flex direction="column" gap={2}>
              <Heading size="sm">Hôpital</Heading>
              <Text>XYZ Hospital</Text>
            </Flex>
            <Flex direction="column" gap={2}>
              <Heading size="sm">Adresse</Heading>
              <Text>Tunis, Bardo 3, rue salah 34</Text>
            </Flex>
            <Flex direction="column" gap={2}>
              <Heading size="sm">Horaire</Heading>
              <Text>Lundi - Jeudi , 8h - 16h</Text>
            </Flex>
            <Flex direction="column" gap={2}>
              <Heading size="sm">Prix de consultation</Heading>
              <Text>50.00dt</Text>
            </Flex>
          </Flex>
        </Flex>

        <Flex justifyContent="flex-end">
          <Button
            size="sm"
            colorScheme="primary"
            _hover={{
              opacity: "0.8",
            }}
            onClick={() => navigate(`/patient/consultation/${params.id}`)}
          >
            Prenez un rendez-vous
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default DoctorDetails;
