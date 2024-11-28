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
          Profile
        </Heading>
        <Text
          mt={1}
          fontSize="sm"
          color="gray.600"
          _dark={{
            color: "gray.400",
          }}
        >
          Complete your profile to be visible to patients and to offer
          up-to-date details.
        </Text>
      </Box>
      <Divider />
      <General setIsLoading={setIsLoading} />
    </Flex>
  );
};

export default DoctorProfile;
