// HOOKS
import { useDisclosure, useSteps } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

// FUNCTIONS
import { createConsultation } from "@/modules/consultation/functions/consultation";
import { getDoctor } from "@/modules/doctor/functions/doctor";
import { useSelector } from "react-redux";
import * as Yup from "yup";

// COMPONENTS
import VerifyData from "./VerifyData";
import DateStep from "./forms/Date";
import ContactInfo from "./forms/ContactInfo";
import OtherInformation from "./forms/OtherInformation";
import { Formik, Form } from "formik";

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
} from "@chakra-ui/react";

const steps = [
  { title: "Date et l'heure" },
  { title: "Informations de contact" },
  { title: "Assurance" },
];

const Consultation = () => {
  const user = useSelector((state) => state.user.loggedInUser);
  const { onClose } = useDisclosure();
  const params = useParams();
  const [doctor, setDoctor] = useState();

  const loadDoctor = async () => {
    const response = await getDoctor(params.id);
    setDoctor(response.data);
  };

  useEffect(() => {
    loadDoctor();
  }, []);

  // FORMS METHODS
  const prevFormHandler = () => {
    goToPrevious();
  };
  const nextFormHandler = () => {
    goToNext();
  };

  const { activeStep, goToNext, goToPrevious } = useSteps({
    index: 0,
    count: steps.length,
  });

  const resetHandler = () => {
    onClose();
    goToPrevious();
  };

  return (
    <Flex direction="column" bg="#fff" p={10} w="100%">
      <Formik
        initialValues={{
          date: new Date(),
          firstName: "",
          lastName: "",
          address: "",
          phone: "",
          age: "",
          weight: "",
          type: "",
          dateInsurance: "",
          provider: "",
          police: "",
          patient: user?._id,
          doctor: params?.id,
        }}
        validationSchema={Yup.object({
          date: Yup.string().required("La date est requis"),
          firstName: Yup.string().required("Le prenom est requis").trim(),
          lastName: Yup.string().required("Le nom est requis").trim(),
          phone: Yup.string()
            .required("Le numéro de téléphone est requis")
            .trim()
            .matches(/^[0-9]*$/, "Le numéro de téléphone n'nest pas valide"),
        })}
        onSubmit={async (values) => {
          await createConsultation(values);
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
              <Heading size="sm">Consultation avec</Heading>
              <Flex direction="column" bg="#fff" w="full">
                <Box
                  h={64}
                  bgSize="cover"
                  bgImage={`url('${doctor?.photo}')`}
                  borderRadius="md"
                ></Box>
                <Box py={8} maxW="xl">
                  <chakra.h2 fontSize="2xl" color="gray.800" fontWeight="bold">
                    <chakra.span color="primary.600">Dr.</chakra.span>{" "}
                    {doctor?.firstName} {doctor?.lastName}
                  </chakra.h2>
                  <chakra.p mt={4} color="gray.600">
                    {doctor?.description}
                  </chakra.p>
                </Box>
              </Flex>
            </Flex>
            <Flex w="90%">
              {activeStep === 0 ? (
                <DateStep nextForm={nextFormHandler} />
              ) : activeStep === 1 ? (
                <ContactInfo
                  nextForm={nextFormHandler}
                  prevForm={prevFormHandler}
                />
              ) : (
                <OtherInformation
                  nextForm={nextFormHandler}
                  prevForm={prevFormHandler}
                />
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
