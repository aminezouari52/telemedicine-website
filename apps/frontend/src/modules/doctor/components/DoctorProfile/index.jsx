// HOOKS
import { useState } from "react";

// COMPONENTS
import Spinner from "@/components/Spinner";
import Calendar from "./Calendar";
import General from "./General";

// STYLE
import {
  Box,
  Heading,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  TabIndicator,
} from "@chakra-ui/react";

const DoctorProfile = () => {
  const [isLoading, setIsLoading] = useState(false);

  return isLoading ? (
    <Spinner />
  ) : (
    <Flex direction="column" gap={8} py={10} px="260px">
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
      <Tabs variant="line" size="sm">
        <TabList gap={2}>
          <Tab
            _selected={{
              color: "primary.500",
              fontWeight: "500",
            }}
            px={2}
          >
            Générale
          </Tab>
          <Tab
            _selected={{
              color: "primary.500",
              fontWeight: "500",
            }}
            px={1}
          >
            Callendrier
          </Tab>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="primary.500"
          borderRadius="1px"
        />
        <TabPanels>
          <TabPanel py={6} px={0}>
            <General setIsLoading={setIsLoading} />
          </TabPanel>
          <TabPanel py={6} px={0}>
            <Calendar />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default DoctorProfile;
