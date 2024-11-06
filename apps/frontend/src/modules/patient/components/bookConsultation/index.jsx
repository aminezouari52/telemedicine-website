// HOOKS
import { useDisclosure } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSteps } from "chakra-ui-steps";

// FUNCTIONS
import { submitConsultation } from "@/modules/patient/functions/patient";
import { getDoctorById } from "@/modules/doctor/functions/doctor";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import moment from "moment";

// COMPONENTS
import VerifyData from "./VerifyData";
import DateStep from "./forms/Date";
import ContactInfo from "./forms/ContactInfo";
import OtherInformation from "./forms/OtherInformation";
import { Formik, Form } from "formik";
import { Steps, Step } from "chakra-ui-steps";

// STYLE
import { Flex, chakra, Box, Heading } from "@chakra-ui/react";

const Consultation = () => {
  const user = useSelector((state) => state.user.loggedInUser);
  const params = useParams();
  const [doctor, setDoctor] = useState();

  const getDoctorByIdFunction = async () => {
    const response = await getDoctorById(params.id);
    setDoctor(response.data);
  };

  useEffect(() => {
    getDoctorByIdFunction();
  }, []);

  const { onClose } = useDisclosure();

  // FORMS METHODS
  const prevFormHandler = () => {
    prevStep();
  };
  const nextFormHandler = () => {
    nextStep();
  };

  // chakra-ui-steps
  const steps = ["Date et l'heure", "Informations de contact", "Assurance"];
  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  });
  const hasCompletedAllSteps = activeStep === steps.length;

  const resetHandler = () => {
    onClose();
    prevStep();
  };

  return (
    <Flex direction="column" bg="#fff" p={4} w="100%">
      <Formik
        initialValues={{
          date: moment(new Date()).format("DD-MM-YYYY"),
          time: moment(new Date()).format("HH:mm"),
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
          time: Yup.string().required("Le temps est requis"),
          firstName: Yup.string().required("Le prenom est requis").trim(),
          lastName: Yup.string().required("Le nom est requis").trim(),
          phone: Yup.string()
            .required("Le numéro de téléphone est requis")
            .trim()
            .matches(
              /^[0-9]{8}$/,
              "Le numéro de téléphone doit contenir exactement 8 chiffres"
            ),
        })}
        onSubmit={async (values) => {
          await submitConsultation(values);
        }}
      >
        <Form>
          <Steps
            variant="circles-alt"
            colorScheme={hasCompletedAllSteps ? "green" : "secondary"}
            activeStep={activeStep}
          >
            {steps.map((label) => (
              <Step label={label} key={label}>
                <Flex justifyContent="space-between" p={10} gap={10}>
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
                        <chakra.h2
                          fontSize="2xl"
                          color="gray.800"
                          fontWeight="bold"
                        >
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
              </Step>
            ))}
          </Steps>
          {hasCompletedAllSteps && (
            <VerifyData isOpen={hasCompletedAllSteps} onClose={resetHandler} />
          )}
        </Form>
      </Formik>
    </Flex>
  );
};

export default Consultation;
