// HOOKS
import { useState } from "react";

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
  Spinner,
} from "@chakra-ui/react";

// ASSETS
import Calendar from "./Calendar";
import General from "./General";

const DoctorProfile = () => {
  const [isLoading, setIsLoading] = useState(true);

  return isLoading ? (
    <Box
      h="100%"
      w="100%"
      position="absolute"
      zIndex={6}
      top={0}
      left={0}
      backgroundColor="#00000033"
    >
      <Spinner
        pos="absolute"
        top="50%"
        right="50%"
        thickness="4px"
        emptyColor="gray.200"
        color="primary.500"
        size="xl"
        transform="translate(50ox, 50%)"
      />
    </Box>
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
          Remplissez ou modifiez les informations de votre profil pour offrir
          aux patients des détails complets et à jour.
          <br />
          Consultez ainsi votre calendrier pour visualiser vos rendez-vous en
          détails.
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
