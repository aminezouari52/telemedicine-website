import {
  Flex,
  Box,
  Heading,
  Text,
  Input,
  IconButton,
  Image,
  Button,
} from "@chakra-ui/react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import logoDark from "@/images/logo-dark.png";
import { useState } from "react";

const Footer = () => {
  const [newsletter, setNewsletter] = useState("");

  const newsLetterEmailHandler = (event) => {
    event.preventDefault();
    console.log(newsletter);
  };

  return (
    <Box as="footer" backgroundColor="primary.900" color="white">
      <Flex p={10} gap={12}>
        <Flex direction="column" w="35%">
          <Image objectFit="cover" src={logoDark} alt="logo" h="auto" />
          <div>
            Découvrez notre plateforme de télémédecine, une solution moderne et
            pratique pour accéder à des consultations médicales en ligne.
          </div>
        </Flex>

        <Flex flexDirection="column" w="30%" gap={4}>
          <Heading fontSize="md">Newsletter</Heading>
          <Text fontSize="sm">
            Inscrivez-vous à notre newsletter et recevez les dernières
            informations sur les innovations en télémédecine, des conseils
            santé, et bien plus encore pour prendre soin de vous et de vos
            proches.
          </Text>
          <form>
            <Input
              fontSize="sm"
              type="email"
              variant="flushed"
              placeholder="Adresse e-mail"
              borderColor="gray.200"
              onChange={(event) => setNewsletter(event.target.value)}
              _placeholder={{
                color: "gray.200",
              }}
              focusBorderColor="white"
            />
            <button type="submit" onClick={newsLetterEmailHandler} />
          </form>
        </Flex>

        <Flex flexDirection="column" w="10%" gap={4}>
          <Heading fontSize="md">Commencer par</Heading>
          <Flex direction="column" alignItems="start">
            <Button
              fontSize="sm"
              fontWeight="500"
              variant="link"
              colorScheme="white"
            >
              S'inscrire
            </Button>
            <Button
              fontSize="sm"
              fontWeight="500"
              variant="link"
              colorScheme="white"
            >
              Se connecter
            </Button>
          </Flex>
        </Flex>

        <Flex flexDirection="column" w="25%" gap={4}>
          <Heading fontSize="md">Entreprise</Heading>
          <Box fontSize="sm">
            <Text>Tunisia, Sousse 5054</Text>
            <Text>Rue Ahmed bouselem</Text>
            <Text>Bâtiment Amine Zouari, 1er étage</Text>
            <Text>+216 21 316 325</Text>
            <Text>zouariamine52@gmail.com</Text>
          </Box>
        </Flex>
      </Flex>
      <Flex p={8} justifyContent="space-between" alignItems="center">
        <Text letterSpacing="2px" textTransform="uppercase" fontSize="sm">
          Copyright 2025 © télémedecine.inc. All rights reserved.
        </Text>
        <Flex gap="10px">
          <IconButton size="sm" colorScheme="facebook" icon={<FaFacebook />} />
          <IconButton size="sm" colorScheme="twitter" icon={<FaTwitter />} />
          <IconButton size="sm" colorScheme="pink" icon={<FaInstagram />} />
          <IconButton
            as="a"
            href="https://www.linkedin.com/in/amine-zouari52/"
            target="_blank"
            size="sm"
            colorScheme="linkedin"
            icon={<FaLinkedin />}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;
