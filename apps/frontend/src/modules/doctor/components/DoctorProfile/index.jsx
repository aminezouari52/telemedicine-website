// STYLE
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";

// ASSETS
import Calendar from "./Calendar";
import General from "./General";

const DoctorProfile = () => {
  return (
    <Box p={10} bg="gray.100">
      <Tabs variant="soft-rounded" size="sm">
        <TabList gap={2}>
          <Tab
            _selected={{
              color: "primary.500",
              bg: "primary.100",
            }}
            fontSize="lg"
          >
            Générale
          </Tab>
          <Tab
            _selected={{
              color: "primary.500",
              bg: "primary.100",
            }}
            fontSize="lg"
          >
            Callendrier
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel py={6} px={0}>
            <General />
          </TabPanel>
          <TabPanel py={6} px={0}>
            <Calendar />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default DoctorProfile;
