// HOOKS
import { useDisclosure, useSteps } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// FUNCTIONS
import { createConsultation } from "@/modules/consultation/functions/consultation";
import { updatePatient } from "@/modules/patient/functions/patient";
import { getDoctor } from "@/modules/doctor/functions/doctor";
import { setUser } from "@/reducers/userReducer";
import * as Yup from "yup";

// COMPONENTS
import VerifyData from "./VerifyData";
import DateStep from "./forms/DateStep";
import PorfileInfo from "./forms/PorfileInfo";
import { Formik, Form } from "formik";
import LoadingSpinner from "@/components/LoadingSpinner";


// STYLE
import {
  Flex,
  chakra,
  Box,
  Heading,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepTitle,
  StepSeparator,
  StepIcon,
  StepNumber,
  Image,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

const steps = [{ title: "Profile information" }, { title: "Date and Time" }];

const Consultation = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.user);
  const { onClose } = useDisclosure();
  const params = useParams();

  const getDoctorDetailsQuery = async () => {
    const response = await getDoctor(params.id);
    return response.data
  };

 //Query Invoked Using useQuery
const { data: doctor, isPending, isError, error} = useQuery({
  queryKey : ['doctor', params.id],
  queryFn : () => getDoctorDetailsQuery()
})

  const { activeStep, goToNext, goToPrevious } = useSteps({
    index: 0,
    count: steps.length,
  });

  const resetHandler = () => {
    onClose();
    goToPrevious();
  };

  useEffect(() => {
    if (user?.isProfileCompleted) {
      goToNext();
    }
  }, [user]);

  if(isPending){
    return <Flex direction='row' justifyContent='center' marginTop={10}><LoadingSpinner/></Flex>
  }

  if(isError){
    return <Flex direction='row' justifyContent='center' marginTop={10}>Error : {error.message}</Flex>
  }

  return (
    <Flex direction="column" bg="#fff" p={10} w="100%">
      <Formik
        initialValues={{
          date: new Date(),
          firstName: user?.firstName ?? "",
          lastName: user?.lastName ?? "",
          address: user?.address ?? "",
          phone: user?.phone ?? "",
          age: user?.age ?? 0,
          city: user?.city ?? "",
          zip: user?.zip ?? "",
          weight: user?.weight ?? "",
          patient: user?._id,
          doctor: params?.id,
          isProfileCompleted: true,
        }}
        validationSchema={Yup.object({
          date: Yup.string().required("Date is required"),
          firstName: Yup.string().required("Firstname is required").trim(),
          lastName: Yup.string().required("Lastname is required").trim(),
          age: Yup.number()
            .required("Age is required")
            .min(18, "You must be at least 18 years old")
            .max(100, "Age cannot exceed 100 years"),
          phone: Yup.string()
            .required("Phone number is required")
            .trim()
            .matches(/^[0-9]*$/, "The phone number is not valid"),
          address: Yup.string()
            .required("Address is required")
            .max(50, "The address cannot exceed 50 characters."),
          city: Yup.string()
            .required("City is required")
            .max(50, "City cannot exceed 50 characters"),
          zip: Yup.string()
            .required("ZIP is required")
            .matches(/^[0-9]+$/, "ZIP must be a number")
            .min(4, "ZIP must be at least 4 digits long")
            .max(5, "ZIP cannot exceed 5 digits"),
        })}
        onSubmit={async (values) => {
          const { date, patient, doctor, ...resValues } = values;
          await updatePatient({ id: user._id, token: user.token }, resValues);
          await createConsultation({ date, patient, doctor });
          dispatch(
            setUser({
              ...user,
              ...resValues,
            })
          );
        }}
      >
        <Form>
          <Stepper pb={10} size="lg" colorScheme="primary" index={activeStep}>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>
                <Box flexShrink="0">
                  <StepTitle>{step.title}</StepTitle>
                </Box>
                <StepSeparator />
              </Step>
            ))}
          </Stepper>
          <Flex justifyContent="space-between" gap={10}>
            <Flex direction="column" w="35%" gap={4}>
              <Heading size="sm">Consultation with</Heading>
              <Flex direction="column" bg="#fff" w="full">
                <Image
                  src={doctor?.photo}
                  alt="doctor-image"
                  borderRadius="lg"
                  maxHeight="400px"
                />
                <Box py={8} maxW="xl">
                  <chakra.h2 fontSize="2xl" color="gray.800" fontWeight="bold">
                    <chakra.span color="primary.500">Dr.</chakra.span>{" "}
                    {doctor?.firstName} {doctor?.lastName}
                  </chakra.h2>
                  <chakra.p mt={4} color="gray.600">
                    {doctor?.description}
                  </chakra.p>
                </Box>
              </Flex>
            </Flex>
            <Flex w="90%" justifyContent="center">
              {activeStep === 0 ? (
                <PorfileInfo goToNext={goToNext} goToPrevious={goToPrevious} />
              ) : (
                activeStep === 1 && (
                  <DateStep goToNext={goToNext} goToPrevious={goToPrevious} />
                )
              )}
            </Flex>
          </Flex>
          <VerifyData
            isOpen={activeStep === steps.length}
            onClose={resetHandler}
          />
        </Form>
      </Formik>
    </Flex>
  );
};

export default Consultation;
