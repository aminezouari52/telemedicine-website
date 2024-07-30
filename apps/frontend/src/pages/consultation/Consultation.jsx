// HOOKS
import { useDisclosure } from "@chakra-ui/react";

// FUNCTIONS
import { submitConsultation } from "../../functions/patient";

// COMPONENTS
import VerifyData from "./VerifyData";
import DateStep from "./Forms/Date";
import ContactInfo from "./Forms/ContactInfo";
import OtherInformation from "./Forms/OtherInformation";

// STYLE
import { Flex, chakra, Box, Heading } from "@chakra-ui/react";

// ASSETS
import doctor from "../../images/avatars/doctors/1.avif";

// PACKAGES
import { Steps, Step, useSteps } from "chakra-ui-steps";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const Consultation = () => {
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
          date: "",
          time: "",
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
          doctor: "",
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
        onSubmit={(values) => {
          submitConsultation({
            date: values.date,
            time: values.time,
            firstName: values.firstName,
            lastName: values.lastName,
            address: values.address,
            phone: values.phone,
            age: values.age,
            weight: values.weight,
            type: values.type,
            dateInsurance: values.dateInsurance,
            provider: values.provider,
            police: values.police,
            doctor: values.doctor,
          });
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
                        style={{
                          backgroundImage: `url('${doctor}')`,
                        }}
                      ></Box>
                      <Box py={8} maxW="xl">
                        <chakra.h2
                          fontSize="2xl"
                          color="gray.800"
                          fontWeight="bold"
                        >
                          <chakra.span color="primary.600">Dr.</chakra.span>{" "}
                          Ahmed Mohsen
                        </chakra.h2>
                        <chakra.p mt={4} color="gray.600">
                          Lorem, ipsum dolor sit amet consectetur adipisicing
                          elit. Quidem modi reprehenderit vitae exercitationem
                          aliquid dolores ullam
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
