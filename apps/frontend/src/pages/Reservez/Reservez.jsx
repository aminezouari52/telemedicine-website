// HOOKS
import { useRef } from "react";

// CHARA-UI-STEPS
import { Steps, Step, useSteps } from "chakra-ui-steps";

// FUNCTIONS
import { submitReservation } from "../../functions/patient";

// COMPONENTS
import FormsWrapper from "./FormWrapper";
import VerifyData from "./VerifyData";

// STYLE
import { Flex, Portal, useDisclosure, Button } from "@chakra-ui/react";

import { Formik, Form } from "formik";
import * as Yup from "yup";

const Reservez = () => {
  const { onClose } = useDisclosure();

  // FORMS METHODS
  const prevFormHandler = () => {
    prevStep();
  };
  const nextFormHandler = (values) => {
    nextStep();
  };

  // chakra-ui-steps
  const steps = [
    // eslint-disable-next-line quotes
    "Date et l'heure",
    "Informations de contact",
    "Assurance",
  ];
  const { nextStep, prevStep, activeStep } = useSteps({
    initialStep: 0,
  });
  const hasCompletedAllSteps = activeStep === steps.length;

  const resetHandler = () => {
    onClose();
    prevStep();
  };

  return (
    <Flex flexDir="column" bg="#fff" m={4} p={4} borderRadius="12px" w="100%">
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
          submitReservation({
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
                <FormsWrapper
                  activeStep={activeStep}
                  prevForm={prevFormHandler}
                  nextForm={nextFormHandler}
                />
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

export default Reservez;
