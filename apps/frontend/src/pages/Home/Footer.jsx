import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
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
import { FaFacebook, FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import logoDark from "@/assets/logo-dark.png";
import { footerEmailInputValidations } from "@/utils/formValidations";

const Footer = () => {
  const navigate = useNavigate();
  // react-use-form
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const { email } = data;

    // TODO: Implement the email service
    console.info(email);
  };

  return (
    <Box as="footer" backgroundColor="primary.900" color="white">
      <Flex p={10} gap={12}>
        <Flex direction="column" w="35%">
          <Image objectFit="cover" src={logoDark} alt="logo" h="auto" />
          <div>
            Discover our telemedicine platform, a modern and practical solution
            for accessing online medical consultations.
          </div>
        </Flex>

        <Flex flexDirection="column" w="30%" gap={4}>
          <Heading fontSize="md">Newsletter</Heading>
          <Text fontSize="sm">
            Subscribe to our newsletter and receive the latest information on
            innovations in telemedicine, health tips, and much more to take care
            of yourself and your loved ones.
          </Text>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              fontSize="sm"
              type="email"
              variant="flushed"
              placeholder="E-Mail address"
              borderColor="gray.200"
              _placeholder={{
                color: "gray.200",
              }}
              focusBorderColor="white"
              {...register("email", footerEmailInputValidations)}
            />
            {errors && (
              <Text fontSize="sm" color="red.300">
                {errors.email?.message}
              </Text>
            )}
            <button type="submit" />
          </form>
        </Flex>

        <Flex flexDirection="column" w="10%" gap={4}>
          <Heading fontSize="md">Start with</Heading>
          <Flex direction="column" alignItems="start">
            <Button
              fontSize="sm"
              fontWeight="500"
              variant="link"
              colorScheme="white"
              onClick={() => navigate("/auth/register")}
            >
              Register
            </Button>
            <Button
              fontSize="sm"
              fontWeight="500"
              variant="link"
              colorScheme="white"
              onClick={() => navigate("/auth/login")}
            >
              Login
            </Button>
          </Flex>
        </Flex>

        <Flex flexDirection="column" w="25%" gap={4}>
          <Heading fontSize="md">Company</Heading>
          <Box fontSize="sm">
            <Text>Tunisia, Sousse 5054</Text>
            <Text>Ahmed bouselem street</Text>
            <Text>Amine Zouari building, 1st floor</Text>
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
          <IconButton
            as="a"
            href="https://github.com/aminezouari52/telemedecine-app/"
            target="_blank"
            size="sm"
            colorScheme="gray"
            icon={<FaGithub />}
          />
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
