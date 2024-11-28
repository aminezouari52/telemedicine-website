// HOOKS
import { useState } from "react";

// COMPONENTS
import Spinner from "@/components/Spinner";
import General from "./General";

// STYLE
import { Box, Heading, Text, Flex, Divider } from "@chakra-ui/react";

const DoctorProfile = () => {
  const [isLoading, setIsLoading] = useState(false);

  return isLoading ? (
    <Spinner />
  ) : (
    <Flex direction="column" gap={8} py={10} px={40}>
      <Box>
        <Heading fontSize="lg" lineHeight="6">
          Profil
        </Heading>
        <Text
          mt={1}
          fontSize="sm"
          color="gray.600"
          _dark={{
            color: "gray.400",
          }}
        >
          Compléter votre profil être visible aux patients et pour offrir des
          détails complets et à jour.
        </Text>
      </Box>
      <Divider />
      <General setIsLoading={setIsLoading} />
    </Flex>
  );
};

export default DoctorProfile;
