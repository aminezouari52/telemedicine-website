// HOOKS
import { useSelector } from "react-redux";

//  COMPONENTS
import DataTable from "@/components/DataTable";
import LoadingSpinner from "@/components/LoadingSpinner";

// FUNCTIONS
import { getDoctorConsultations } from "@/modules/consultation/functions/consultation";
import { DateTime } from "luxon";

// STYLE
import { Box, Heading, Tr, Td, Flex } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

const DoctorPatients = () => {
  const user = useSelector((state) => state.userReducer.user);

  const getConsultations = async () => {
    const consultationsData = (await getDoctorConsultations(user?._id)).data;
    return consultationsData?.filter((c) => c.status === "completed")
  };

   //Query Invoked Using useQuery
  const { data: consultations, isPending, isError, error} = useQuery({
    queryKey : ['patients'],
    queryFn : () => getConsultations()
  })

    if(isPending){
      return <Flex direction='row' justifyContent='center' marginTop={10}><LoadingSpinner/></Flex>
    }
  
    if(isError){
      return <Flex direction='row' justifyContent='center' marginTop={10}>Error : {error.message}</Flex>
    }
  
  const uniquePatientConsultations = consultations?.filter(
    (consultation, index, self) =>
      index ===
      self.findIndex((c) => c.patient?._id === consultation.patient?._id)
  );

  const headers = ["Patient", "Phone", "Age", "Created at"];

  const renderRow = (consultation, index) => (
    <Tr key={index} fontSize="xs">
      <Td fontWeight="bold">
        {consultation?.patient?.firstName} {consultation?.patient?.lastName}
      </Td>
      <Td>{consultation?.patient?.phone}</Td>
      <Td>{consultation?.patient?.age}</Td>
      <Td>
        {DateTime.fromJSDate(new Date(consultation?.createdAt)).toFormat(
          "dd-MM-yyyy 'à' HH:mm"
        )}
      </Td>
    </Tr>
  );

  return (
    <Box px={12} py={6}>
      <Heading my={4} fontSize="lg">
        Patients who have completed their consultation
      </Heading>
      <DataTable
        data={uniquePatientConsultations}
        renderRow={renderRow}
        headers={headers}
      />
    </Box>
  );
};

export default DoctorPatients;
