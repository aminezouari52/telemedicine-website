import { useState } from "react";
import { DateTime } from "luxon";
import DataTable from "@/components/DataTable";
import {
  Tabs,
  TabList,
  Tr,
  Td,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

const translateStatus = (status) => {
  if (status === "pending") return "En attente";
  if (status === "canceled") return "Annulé";
  if (status === "completed") return "Confirmé";
};

const headers = ["Patient", "Date", "Status", "Créer le", "Modifier le"];

const ConsultationsTable = ({ consultations }) => {
  const [activeTab, setActiveTab] = useState(0);

  const renderRow = (consultation, index) => (
    <Tr key={index} fontSize="xs">
      <Td fontWeight="bold">
        {consultation?.patient?.firstName} {consultation?.patient?.lastName}
      </Td>
      <Td>
        {DateTime.fromJSDate(new Date(consultation?.date)).toFormat(
          "dd-MM-yyyy 'à' HH:mm"
        )}
      </Td>
      <Td>{translateStatus(consultation?.status)}</Td>
      <Td>
        {DateTime.fromJSDate(new Date(consultation?.createdAt)).toFormat(
          "dd-MM-yyyy 'à' HH:mm"
        )}
      </Td>
      <Td>
        {DateTime.fromJSDate(new Date(consultation?.updatedAt)).toFormat(
          "dd-MM-yyyy 'à' HH:mm"
        )}
      </Td>
    </Tr>
  );

  return (
    <Tabs
      onChange={(index) => setActiveTab(index)}
      variant="enclosed"
      size="md"
    >
      <TabList>
        {[
          "Consultations en attente",
          "Consultations annulé",
          "Consultations confirmé",
          "Toutes les consultationss",
        ].map((item, index) => (
          <Tab
            key={index}
            fontSize="sm"
            fontWeight="700"
            color={activeTab === index ? "primary.500" : "gray.600"}
            borderTopColor={activeTab === index ? "primary.500" : "inherit"}
            bg={activeTab === index ? "#fff" : "inherit"}
            _hover={{
              bg: activeTab === index ? "#fff" : "gray.100",
            }}
          >
            {item}
          </Tab>
        ))}
      </TabList>

      <TabPanels>
        <TabPanel p={0}>
          <DataTable
            renderRow={renderRow}
            headers={headers}
            data={consultations?.filter((c) => c.status === "pending")}
          />
        </TabPanel>
        <TabPanel p={0}>
          <DataTable
            headers={headers}
            renderRow={renderRow}
            data={consultations?.filter((c) => c.status === "canceled")}
          />
        </TabPanel>
        <TabPanel p={0}>
          <DataTable
            headers={headers}
            renderRow={renderRow}
            data={consultations?.filter((c) => c.status === "completed")}
          />
        </TabPanel>
        <TabPanel p={0}>
          <DataTable
            headers={headers}
            renderRow={renderRow}
            data={consultations}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default ConsultationsTable;
